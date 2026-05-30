from __future__ import annotations

from dataclasses import dataclass
from typing import (
    Any,
    AsyncIterator,
    Awaitable,
    Callable,
    Generic,
    Iterator,
    List,
    Mapping,
    Optional,
    TypeVar,
    cast,
)

from ._errors import StackMachineValidationError

T = TypeVar("T")

DEFAULT_PAGE_LIMIT = 10
MIN_PAGE_LIMIT = 1
MAX_PAGE_LIMIT = 100


@dataclass
class NormalizedPagination:
    limit: int
    direction: str
    first: Optional[int] = None
    after: Optional[str] = None
    last: Optional[int] = None
    before: Optional[str] = None


@dataclass
class PageInfo:
    has_next_page: bool
    has_previous_page: bool
    end_cursor: Optional[str]
    start_cursor: Optional[str]


@dataclass
class PageData(Generic[T]):
    data: List[T]
    page_info: PageInfo
    total_count: Optional[int] = None


def _optional_cursor(value: Any) -> Optional[str]:
    if value is None or value == "":
        return None
    return str(value)


def _resolve_cursor(
    camel: Any,
    snake: Any,
    camel_name: str,
    snake_name: str,
) -> Optional[str]:
    camel_value = _optional_cursor(camel)
    snake_value = _optional_cursor(snake)
    if camel_value and snake_value and camel_value != snake_value:
        raise StackMachineValidationError(
            f"`{camel_name}` and `{snake_name}` must match when both are provided.",
            code="pagination_alias_conflict",
            param=camel_name,
        )
    return camel_value or snake_value


def normalize_pagination(params: Mapping[str, Any]) -> NormalizedPagination:
    raw_limit = params.get("limit")
    limit = DEFAULT_PAGE_LIMIT if raw_limit is None else int(raw_limit)
    if limit < MIN_PAGE_LIMIT or limit > MAX_PAGE_LIMIT:
        raise StackMachineValidationError(
            "`limit` must be an integer between 1 and 100.",
            code="invalid_pagination_limit",
            param="limit",
        )
    starting_after = _resolve_cursor(
        params.get("startingAfter"),
        params.get("starting_after"),
        "startingAfter",
        "starting_after",
    )
    ending_before = _resolve_cursor(
        params.get("endingBefore"),
        params.get("ending_before"),
        "endingBefore",
        "ending_before",
    )
    if starting_after and ending_before:
        raise StackMachineValidationError(
            "`startingAfter` and `endingBefore` cannot both be provided.",
            code="pagination_cursor_conflict",
        )
    if ending_before:
        return NormalizedPagination(
            limit=limit,
            direction="backward",
            last=limit,
            before=ending_before,
        )
    return NormalizedPagination(
        limit=limit,
        direction="forward",
        first=limit,
        after=starting_after,
    )


def connection_to_page_data(
    connection: Optional[Mapping[str, Any]],
    map_node: Callable[[Mapping[str, Any]], T],
) -> PageData[T]:
    edges = connection.get("edges") if connection else None
    data = [
        map_node(edge["node"])
        for edge in edges or []
        if edge and edge.get("node") is not None
    ]
    page_info = connection.get("pageInfo") if connection else None
    return PageData(
        data=data,
        page_info=PageInfo(
            has_next_page=bool(page_info and page_info.get("hasNextPage")),
            has_previous_page=bool(page_info and page_info.get("hasPreviousPage")),
            end_cursor=page_info.get("endCursor") if page_info else None,
            start_cursor=page_info.get("startCursor") if page_info else None,
        ),
        total_count=connection.get("totalCount") if connection else None,
    )


def _next_params(
    params: Mapping[str, Any],
    has_more: bool,
    next_cursor: Optional[str],
    previous_cursor: Optional[str],
    direction: str,
) -> Optional[dict[str, Any]]:
    if not has_more:
        return None
    cursor = next_cursor if direction == "forward" else previous_cursor
    if not cursor:
        return None
    next_params = dict(params)
    next_params.pop("startingAfter", None)
    next_params.pop("starting_after", None)
    next_params.pop("endingBefore", None)
    next_params.pop("ending_before", None)
    if direction == "forward":
        next_params["starting_after"] = cursor
    else:
        next_params["ending_before"] = cursor
    return next_params


SyncFetchPage = Callable[[NormalizedPagination, Mapping[str, Any]], PageData[T]]
AsyncFetchPage = Callable[
    [NormalizedPagination, Mapping[str, Any]], Awaitable[PageData[T]]
]


class StackMachineList(Generic[T]):
    object = "list"

    def __init__(
        self,
        page_data: PageData[T],
        params: Mapping[str, Any],
        url: str,
        fetch_page: SyncFetchPage[T],
        normalized: NormalizedPagination,
    ) -> None:
        self.data = page_data.data
        self.has_more = (
            page_data.page_info.has_next_page
            if normalized.direction == "forward"
            else page_data.page_info.has_previous_page
        )
        self.hasMore = self.has_more
        self.url = url
        self.next_page_cursor = page_data.page_info.end_cursor
        self.nextPageCursor = self.next_page_cursor
        self.previous_page_cursor = page_data.page_info.start_cursor
        self.previousPageCursor = self.previous_page_cursor
        self.total_count = page_data.total_count
        self.totalCount = self.total_count
        self._params = dict(params)
        self._fetch_page = fetch_page
        self._normalized = normalized

    def __iter__(self) -> Iterator[T]:
        current: StackMachineList[T] = self
        params: Optional[dict[str, Any]] = dict(self._params)
        while params:
            yield from current.data
            params = _next_params(
                params,
                current.has_more,
                current.next_page_cursor,
                current.previous_page_cursor,
                current._normalized.direction,
            )
            if not params:
                return
            normalized = normalize_pagination(params)
            current = StackMachineList(
                self._fetch_page(normalized, params),
                params,
                self.url,
                self._fetch_page,
                normalized,
            )

    def auto_paging_each(self, handler: Callable[[T], Optional[bool]]) -> None:
        for item in self:
            if handler(item) is False:
                return

    def auto_paging_to_array(self, *, limit: int) -> List[T]:
        if limit < 1:
            raise StackMachineValidationError(
                "`auto_paging_to_array` requires a positive integer `limit` option.",
                code="invalid_auto_paging_limit",
                param="limit",
            )
        items: List[T] = []
        for item in self:
            items.append(item)
            if len(items) >= limit:
                break
        return items

    autoPagingEach = auto_paging_each
    autoPagingToArray = auto_paging_to_array


class AsyncStackMachineList(Generic[T]):
    object = "list"

    def __init__(
        self,
        page_data: PageData[T],
        params: Mapping[str, Any],
        url: str,
        fetch_page: AsyncFetchPage[T],
        normalized: NormalizedPagination,
    ) -> None:
        self.data = page_data.data
        self.has_more = (
            page_data.page_info.has_next_page
            if normalized.direction == "forward"
            else page_data.page_info.has_previous_page
        )
        self.hasMore = self.has_more
        self.url = url
        self.next_page_cursor = page_data.page_info.end_cursor
        self.nextPageCursor = self.next_page_cursor
        self.previous_page_cursor = page_data.page_info.start_cursor
        self.previousPageCursor = self.previous_page_cursor
        self.total_count = page_data.total_count
        self.totalCount = self.total_count
        self._params = dict(params)
        self._fetch_page = fetch_page
        self._normalized = normalized

    async def __aiter__(self) -> AsyncIterator[T]:
        current: AsyncStackMachineList[T] = self
        params: Optional[dict[str, Any]] = dict(self._params)
        while params:
            for item in current.data:
                yield item
            params = _next_params(
                params,
                current.has_more,
                current.next_page_cursor,
                current.previous_page_cursor,
                current._normalized.direction,
            )
            if not params:
                return
            normalized = normalize_pagination(params)
            current = AsyncStackMachineList(
                await self._fetch_page(normalized, params),
                params,
                self.url,
                self._fetch_page,
                normalized,
            )

    async def auto_paging_each(
        self, handler: Callable[[T], Optional[bool] | Awaitable[Optional[bool]]]
    ) -> None:
        async for item in self:
            result = handler(item)
            if hasattr(result, "__await__"):
                result = await cast(Awaitable[Optional[bool]], result)
            if result is False:
                return

    async def auto_paging_to_array(self, *, limit: int) -> List[T]:
        if limit < 1:
            raise StackMachineValidationError(
                "`auto_paging_to_array` requires a positive integer `limit` option.",
                code="invalid_auto_paging_limit",
                param="limit",
            )
        items: List[T] = []
        async for item in self:
            items.append(item)
            if len(items) >= limit:
                break
        return items

    autoPagingEach = auto_paging_each
    autoPagingToArray = auto_paging_to_array


class AsyncStackMachineListRequest(Generic[T]):
    def __init__(
        self,
        params: Mapping[str, Any],
        url: str,
        fetch_page: AsyncFetchPage[T],
    ) -> None:
        self._params = dict(params)
        self._url = url
        self._fetch_page = fetch_page
        self._list: Optional[AsyncStackMachineList[T]] = None

    def __await__(self) -> Any:
        return self._get().__await__()

    async def _get(self) -> AsyncStackMachineList[T]:
        if self._list is None:
            normalized = normalize_pagination(self._params)
            self._list = AsyncStackMachineList(
                await self._fetch_page(normalized, self._params),
                self._params,
                self._url,
                self._fetch_page,
                normalized,
            )
        return self._list

    async def __aiter__(self) -> AsyncIterator[T]:
        async for item in await self._get():
            yield item

    async def auto_paging_each(
        self, handler: Callable[[T], Optional[bool] | Awaitable[Optional[bool]]]
    ) -> None:
        return await (await self._get()).auto_paging_each(handler)

    async def auto_paging_to_array(self, *, limit: int) -> List[T]:
        return await (await self._get()).auto_paging_to_array(limit=limit)

    autoPagingEach = auto_paging_each
    autoPagingToArray = auto_paging_to_array


def create_list(
    params: Mapping[str, Any],
    url: str,
    fetch_page: SyncFetchPage[T],
) -> StackMachineList[T]:
    normalized = normalize_pagination(params)
    return StackMachineList(
        fetch_page(normalized, params),
        params,
        url,
        fetch_page,
        normalized,
    )


def create_async_list(
    params: Mapping[str, Any],
    url: str,
    fetch_page: AsyncFetchPage[T],
) -> AsyncStackMachineListRequest[T]:
    return AsyncStackMachineListRequest(params, url, fetch_page)
