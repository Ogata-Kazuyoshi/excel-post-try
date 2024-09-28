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
    originalName: string
}