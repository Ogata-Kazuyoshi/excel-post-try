export interface ResponceTeamRawList {
    teamName: string
    libraryName: string
    version: string
    aliasName: string
    licenseName: string
    spdx: string
    originalUse: string
}

export interface ResponseApprovalList {
    licenseName: string
    shortIdentifier: string
    fullName: string
    spdx: string
    originalUse: string
    modified: string
}

export interface TableDisplay extends ResponseApprovalList {
    aliasName?: string
}

export interface ResponseAliasList {
    aliasName: string
    licenseName: string
}

export interface RequestUpdateAliasName {
    aliasName: string
    licenseName: string
}

export interface ResponseUpdateAliasRecord {
    aliasName: string
    licenseName: string
    testColumn1: string
    testColumn2: string
}