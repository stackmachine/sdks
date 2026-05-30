from __future__ import annotations

from collections.abc import Mapping
from datetime import datetime
from pathlib import Path
from typing import Any, Dict, Optional


def parse_datetime(value: Any) -> Optional[datetime]:
    if value is None or isinstance(value, datetime):
        return value
    if not isinstance(value, str):
        return None
    normalized = value.replace("Z", "+00:00")
    try:
        return datetime.fromisoformat(normalized)
    except ValueError:
        return None


def operation_name(query: str) -> Optional[str]:
    tokens = query.strip().replace("(", " ").split()
    for index, token in enumerate(tokens):
        if token in {"query", "mutation", "subscription"}:
            return tokens[index + 1] if index + 1 < len(tokens) else None
    return None


def snake_to_camel(name: str) -> str:
    if "_" not in name:
        return name
    first, *rest = name.split("_")
    return first + "".join(part[:1].upper() + part[1:] for part in rest)


def camelize(value: Any) -> Any:
    if isinstance(value, Mapping):
        return {
            snake_to_camel(str(key)): camelize(item)
            for key, item in value.items()
            if item is not None
        }
    if isinstance(value, (list, tuple)):
        return [camelize(item) for item in value if item is not None]
    if isinstance(value, datetime):
        return value.isoformat()
    return value


def merge_input(
    input_data: Optional[Mapping[str, Any]], **kwargs: Any
) -> Dict[str, Any]:
    merged: Dict[str, Any] = {}
    if input_data:
        merged.update(input_data)
    merged.update({key: value for key, value in kwargs.items() if value is not None})
    return merged


def read_file_bytes(file: Any) -> bytes:
    if isinstance(file, bytes):
        return file
    if isinstance(file, bytearray):
        return bytes(file)
    if isinstance(file, memoryview):
        return file.tobytes()
    if isinstance(file, str):
        path = Path(file)
        return path.read_bytes() if path.exists() else file.encode()
    if isinstance(file, Path):
        return file.read_bytes()
    if hasattr(file, "read"):
        data = file.read()
        return data.encode() if isinstance(data, str) else bytes(data)
    raise TypeError("Unsupported file value.")
