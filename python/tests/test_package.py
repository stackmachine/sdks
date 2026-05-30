from importlib.metadata import version

import stackmachine


def test_version_matches_package_metadata():
    assert stackmachine.__version__ == version("stackmachine")
