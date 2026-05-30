"""StackMachine Python SDK."""

from importlib.metadata import PackageNotFoundError, version

from ._async_client import AsyncStackMachine
from ._client import StackMachine
from ._config import RequestOptions
from ._errors import (
    StackMachineAPIError,
    StackMachineAuthenticationError,
    StackMachineConnectionError,
    StackMachineError,
    StackMachineGraphQLError,
    StackMachineInvalidRequestError,
    StackMachinePermissionError,
    StackMachineRateLimitError,
    StackMachineValidationError,
    is_stackmachine_error,
)
from ._models import (
    AppAlias,
    AppSshServer,
    DeployApp,
    DeployAppKindWordPress,
    DeployAppVersion,
    DeploymentProgress,
    ExpectedDNSRecord,
    Log,
    SshAuthorizedKey,
    SshUser,
    UploadProgress,
    Viewer,
)
from ._pagination import AsyncStackMachineList, StackMachineList
from ._uploads import create_zip

try:
    __version__ = version("stackmachine")
except PackageNotFoundError:
    __version__ = "0.3.1"

__all__ = [
    "AppAlias",
    "AppSshServer",
    "AsyncStackMachine",
    "AsyncStackMachineList",
    "DeployApp",
    "DeployAppKindWordPress",
    "DeployAppVersion",
    "DeploymentProgress",
    "ExpectedDNSRecord",
    "Log",
    "RequestOptions",
    "SshAuthorizedKey",
    "SshUser",
    "StackMachine",
    "StackMachineAPIError",
    "StackMachineAuthenticationError",
    "StackMachineConnectionError",
    "StackMachineError",
    "StackMachineGraphQLError",
    "StackMachineInvalidRequestError",
    "StackMachineList",
    "StackMachinePermissionError",
    "StackMachineRateLimitError",
    "StackMachineValidationError",
    "UploadProgress",
    "Viewer",
    "__version__",
    "create_zip",
    "is_stackmachine_error",
]
