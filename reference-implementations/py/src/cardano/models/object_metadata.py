from typing import TypedDict
class ObjectMetadata(TypedDict):
    resourceURI: str
    resourceName: str
    resourceFamily: str
    resourceType: str
    resourceVersion: str
    mediaType: str
    created: str
    checkSum: str
    publisherId: str
    publisherSignature: str