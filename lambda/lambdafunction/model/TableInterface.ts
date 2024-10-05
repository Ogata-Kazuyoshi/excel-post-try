export enum TableName {
    APPROVALLIST = 'approval-list',
    TEAMLIST = 'team-list',
    LICENSELIST = 'license-list'
}

export enum TablePartitioKey {
    APPROVALLIST = 'id',
    TEAMLIST = 'id'
}

export enum ApprovalListGSI {
    LicenseIndexName = 'licenseName',
    LicenseNamePK = 'licenseName',
    AliasIndexName = 'aliasName',
    AliasNamePK = 'aliasName'
}

export enum TeamListGSI {
    teamIndexName = 'teamName',
    teamNamePK = 'teamName',
    teamNameSK = 'libraryName',
}
