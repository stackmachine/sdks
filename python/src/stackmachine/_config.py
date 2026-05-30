from __future__ import annotations

from dataclasses import dataclass
from typing import Mapping, Optional

DEFAULT_API_URL = "https://api.stackmachine.com/graphql"
DEFAULT_TIMEOUT = 80.0
DEFAULT_MAX_NETWORK_RETRIES = 1


@dataclass
class RequestOptions:
    api_key: Optional[str] = None
    apiKey: Optional[str] = None
    headers: Optional[Mapping[str, str]] = None
    timeout: Optional[float] = None
    max_network_retries: Optional[int] = None
    maxNetworkRetries: Optional[int] = None
    idempotency_key: Optional[str] = None
    idempotencyKey: Optional[str] = None
    client_mutation_id: Optional[str] = None
    clientMutationId: Optional[str] = None
    force: Optional[bool] = None


@dataclass
class ClientConfig:
    api_url: str = DEFAULT_API_URL
    headers: Optional[Mapping[str, str]] = None
    timeout: float = DEFAULT_TIMEOUT
    max_network_retries: int = DEFAULT_MAX_NETWORK_RETRIES
