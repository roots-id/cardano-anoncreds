from typing import List, TypedDict

class Schema(TypedDict):
    name: str
    version: str
    attr_names: List[str]