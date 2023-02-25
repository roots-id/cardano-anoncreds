import { IRevRegEntry } from "./IRevRegEntry"

export interface IRevRegAccumKey {
    z: string
}

export interface IRevRegPublicKeys {
    accumKey: IRevRegAccumKey
}

export interface IRevRegValue {
    publicKeys: IRevRegPublicKeys
    maxCredNum: number
    tailsLocation: string
    tailsHash: string
}

export interface IRevReg {
    issuerId: string
    revocDefType: string
    credDefId: string
    tag: string
    value: IRevRegValue
    RevRegEntries?: IRevRegEntry[]
}