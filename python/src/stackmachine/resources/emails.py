from __future__ import annotations

from typing import Any, Mapping, Optional, Sequence

from typing_extensions import Unpack

from .._errors import StackMachineAPIError, StackMachineValidationError
from .._graphql import operations as gql
from .._models import EmailMessage
from .._pagination import (
    AsyncStackMachineListRequest,
    NormalizedPagination,
    StackMachineList,
    connection_to_page_data,
    create_async_list,
    create_list,
)
from .._types import FileInput, PaginationOptions, RequestOptionsLike
from ._shared import page_variables, required_payload, resource_missing_error


def _email_list_id(app: Optional[str], owner: Optional[str]) -> tuple[str, str]:
    if not app and not owner:
        raise StackMachineValidationError(
            "`app` or `owner` is required.",
            code="invalid_email_list_input",
            param="app",
        )
    if app and owner:
        raise StackMachineValidationError(
            "`app` and `owner` cannot both be provided.",
            code="invalid_email_list_input",
            param="app",
        )
    return ("app", app) if app else ("owner", owner or "")


class EmailsMessagesResource:
    def __init__(self, client: Any, direction: str) -> None:
        self._client = client
        self._direction = direction

    def list(
        self,
        *,
        app: Optional[str] = None,
        owner: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> StackMachineList[EmailMessage]:
        param, id = _email_list_id(app, owner)
        params = {"app": app, "owner": owner, **pagination}
        query = (
            gql.LIST_SENT_EMAILS_QUERY
            if self._direction == "sent"
            else gql.LIST_RECEIVED_EMAILS_QUERY
        )
        operation_name = (
            "srcListSentEmailsQuery"
            if self._direction == "sent"
            else "srcListReceivedEmailsQuery"
        )

        def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = self._client._query(
                query,
                {
                    "id": page_params.get("app") or page_params.get("owner"),
                    **page_variables(normalized),
                },
                request_options=request_options,
            )
            node = response.get("node") if response else None
            emails = node.get("emails") if node else None
            if emails is None:
                raise resource_missing_error(param, id, operation_name, param)
            return connection_to_page_data(emails, EmailMessage.from_graphql)

        return create_list(params, f"/v1/emails/{self._direction}", fetch_page)


class EmailsResource:
    def __init__(self, client: Any) -> None:
        self._client = client
        self.sent = EmailsMessagesResource(client, "sent")
        self.received = EmailsMessagesResource(client, "received")

    def send(
        self,
        *,
        app: str,
        to: Sequence[str],
        subject: str,
        bcc: Optional[Sequence[str]] = None,
        cc: Optional[Sequence[str]] = None,
        from_address: Optional[str] = None,
        from_email_id: Optional[str] = None,
        html_body: Optional[str] = None,
        raw_message: Optional[FileInput] = None,
        rawMessage: Optional[FileInput] = None,
        reply_to: Optional[str] = None,
        text_body: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> EmailMessage:
        raw_upload = raw_message if raw_message is not None else rawMessage
        input_payload = {
            "appId": app,
            "to": list(to),
            "subject": subject,
            "bcc": list(bcc) if bcc is not None else None,
            "cc": list(cc) if cc is not None else None,
            "fromAddress": from_address,
            "fromEmailId": from_email_id,
            "htmlBody": html_body,
            "replyTo": reply_to,
            "textBody": text_body,
        }
        if raw_upload is not None:
            input_payload["rawMessage"] = None
        response = self._client._mutation(
            gql.SEND_APP_EMAIL_MUTATION,
            {"input": input_payload},
            request_options=request_options,
            uploadables=(
                {"variables.input.rawMessage": raw_upload}
                if raw_upload is not None
                else None
            ),
        )
        payload = required_payload(
            response.get("sendAppEmail") if response else None,
            "Failed to send app email, mutation failed.",
            "srcSendAppEmailMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to send app email, mutation was not successful.",
                operation_name="srcSendAppEmailMutation",
            )
        message = required_payload(
            payload.get("message"),
            "Failed to send app email, no message returned.",
            "srcSendAppEmailMutation",
        )
        return EmailMessage.from_graphql(message)


class AsyncEmailsMessagesResource:
    def __init__(self, client: Any, direction: str) -> None:
        self._client = client
        self._direction = direction

    def list(
        self,
        *,
        app: Optional[str] = None,
        owner: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
        **pagination: Unpack[PaginationOptions],
    ) -> AsyncStackMachineListRequest[EmailMessage]:
        param, id = _email_list_id(app, owner)
        params = {"app": app, "owner": owner, **pagination}
        query = (
            gql.LIST_SENT_EMAILS_QUERY
            if self._direction == "sent"
            else gql.LIST_RECEIVED_EMAILS_QUERY
        )
        operation_name = (
            "srcListSentEmailsQuery"
            if self._direction == "sent"
            else "srcListReceivedEmailsQuery"
        )

        async def fetch_page(
            normalized: NormalizedPagination, page_params: Mapping[str, Any]
        ):
            response = await self._client._query(
                query,
                {
                    "id": page_params.get("app") or page_params.get("owner"),
                    **page_variables(normalized),
                },
                request_options=request_options,
            )
            node = response.get("node") if response else None
            emails = node.get("emails") if node else None
            if emails is None:
                raise resource_missing_error(param, id, operation_name, param)
            return connection_to_page_data(emails, EmailMessage.from_graphql)

        return create_async_list(params, f"/v1/emails/{self._direction}", fetch_page)


class AsyncEmailsResource:
    def __init__(self, client: Any) -> None:
        self._client = client
        self.sent = AsyncEmailsMessagesResource(client, "sent")
        self.received = AsyncEmailsMessagesResource(client, "received")

    async def send(
        self,
        *,
        app: str,
        to: Sequence[str],
        subject: str,
        bcc: Optional[Sequence[str]] = None,
        cc: Optional[Sequence[str]] = None,
        from_address: Optional[str] = None,
        from_email_id: Optional[str] = None,
        html_body: Optional[str] = None,
        raw_message: Optional[FileInput] = None,
        rawMessage: Optional[FileInput] = None,
        reply_to: Optional[str] = None,
        text_body: Optional[str] = None,
        request_options: Optional[RequestOptionsLike] = None,
    ) -> EmailMessage:
        raw_upload = raw_message if raw_message is not None else rawMessage
        input_payload = {
            "appId": app,
            "to": list(to),
            "subject": subject,
            "bcc": list(bcc) if bcc is not None else None,
            "cc": list(cc) if cc is not None else None,
            "fromAddress": from_address,
            "fromEmailId": from_email_id,
            "htmlBody": html_body,
            "replyTo": reply_to,
            "textBody": text_body,
        }
        if raw_upload is not None:
            input_payload["rawMessage"] = None
        response = await self._client._mutation(
            gql.SEND_APP_EMAIL_MUTATION,
            {"input": input_payload},
            request_options=request_options,
            uploadables=(
                {"variables.input.rawMessage": raw_upload}
                if raw_upload is not None
                else None
            ),
        )
        payload = required_payload(
            response.get("sendAppEmail") if response else None,
            "Failed to send app email, mutation failed.",
            "srcSendAppEmailMutation",
        )
        if not payload.get("success"):
            raise StackMachineAPIError(
                "Failed to send app email, mutation was not successful.",
                operation_name="srcSendAppEmailMutation",
            )
        message = required_payload(
            payload.get("message"),
            "Failed to send app email, no message returned.",
            "srcSendAppEmailMutation",
        )
        return EmailMessage.from_graphql(message)
