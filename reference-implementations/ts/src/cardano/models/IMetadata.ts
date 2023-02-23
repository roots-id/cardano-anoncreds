import { ICredDef } from "./ICredDef"
import { IObjectMetadata } from "./IObjectMetadata"
import { IRevReg } from "./IRevReg"
import { ISchema } from "./ISchema"

export interface IMetadata {
    ResourceObject: ISchema | ICredDef | IRevReg | IRevReg
    ResourceObjectMetadata: IObjectMetadata
}
