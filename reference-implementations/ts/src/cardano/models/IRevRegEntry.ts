export interface IRevRegEntryValue{
    accum: string
    prevAccum: string
    issued: number[]
    revoked: number[]
}

export interface IRevRegEntry {
    revocDefType: string
    revocRegDefId: string
    value: IRevRegEntryValue
}