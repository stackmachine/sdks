use crate::{Error, Result, StackMachine};
use serde::{Deserialize, Serialize, de::DeserializeOwned};
use serde_json::{Value, json};

/// Forward pagination with an optional cursor. Page sizes must be 1–100.
#[derive(Clone, Debug, Serialize)]
pub struct Pagination {
    pub limit: u32,
    pub after: Option<String>,
}

impl Default for Pagination {
    fn default() -> Self {
        Self {
            limit: 25,
            after: None,
        }
    }
}

impl Pagination {
    pub fn new(limit: u32) -> Self {
        Self { limit, after: None }
    }

    pub(crate) fn variables(&self, mut variables: Value) -> Result<Value> {
        if !(1..=100).contains(&self.limit) {
            return Err(Error::Validation(
                "pagination limit must be between 1 and 100".into(),
            ));
        }
        variables["first"] = json!(self.limit);
        variables["after"] = json!(self.after);
        Ok(variables)
    }
}

#[derive(Clone, Debug, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PageInfo {
    pub has_next_page: bool,
    pub has_previous_page: bool,
    pub start_cursor: Option<String>,
    pub end_cursor: Option<String>,
}

/// A page of resources. `next_page` retains the query, filters and request options.
#[derive(Clone, Debug)]
pub struct Page<T> {
    pub data: Vec<T>,
    pub page_info: PageInfo,
    pub total_count: Option<u64>,
    client: StackMachine,
    query: &'static str,
    variables: Value,
    pointer: &'static str,
}

impl<T: DeserializeOwned> Page<T> {
    pub async fn next_page(&self) -> Result<Option<Self>> {
        if !self.page_info.has_next_page {
            return Ok(None);
        }
        let cursor = self
            .page_info
            .end_cursor
            .as_deref()
            .filter(|cursor| !cursor.is_empty())
            .ok_or_else(|| {
                Error::InvalidResponse("page has a next page but no end cursor".into())
            })?;
        if self.variables.get("after").and_then(Value::as_str) == Some(cursor) {
            return Err(Error::InvalidResponse(
                "pagination cursor did not advance".into(),
            ));
        }
        let mut variables = self.variables.clone();
        variables["after"] = json!(cursor);
        Ok(Some(
            self.client
                .page(self.query, variables, self.pointer)
                .await?,
        ))
    }

    /// Collect at most `limit` items across pages, without requesting extra pages.
    pub async fn collect(mut self, limit: usize) -> Result<Vec<T>> {
        let mut data = Vec::new();
        let mut cursors = std::collections::HashSet::new();
        loop {
            let take = limit.saturating_sub(data.len());
            data.extend(self.data.drain(..).take(take));
            if data.len() >= limit || !self.page_info.has_next_page {
                return Ok(data);
            }
            if let Some(cursor) = &self.page_info.end_cursor
                && !cursors.insert(cursor.clone())
            {
                return Err(Error::InvalidResponse("pagination cursor repeated".into()));
            }
            self = match self.next_page().await? {
                Some(page) => page,
                None => return Ok(data),
            };
        }
    }
}

impl StackMachine {
    pub(crate) async fn page<T: DeserializeOwned>(
        &self,
        query: &'static str,
        variables: Value,
        pointer: &'static str,
    ) -> Result<Page<T>> {
        let data: Value = self.graphql(query, &variables).await?;
        let connection = data
            .pointer(pointer)
            .filter(|value| !value.is_null())
            .ok_or_else(|| Error::missing("connection", pointer))?;
        let edges = connection
            .get("edges")
            .and_then(Value::as_array)
            .ok_or_else(|| Error::InvalidResponse("connection is missing edges".into()))?;
        let items = edges
            .iter()
            .filter_map(|edge| edge.get("node"))
            .filter(|node| !node.is_null())
            .map(|node| serde_json::from_value(node.clone()))
            .collect::<std::result::Result<Vec<T>, _>>()?;
        let page_info = connection
            .get("pageInfo")
            .ok_or_else(|| Error::InvalidResponse("connection is missing pageInfo".into()))?;
        Ok(Page {
            data: items,
            page_info: serde_json::from_value(page_info.clone())?,
            total_count: connection.get("totalCount").and_then(Value::as_u64),
            client: self.clone(),
            query,
            variables,
            pointer,
        })
    }
}
