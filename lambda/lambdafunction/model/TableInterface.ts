export enum TableName {
    APPROVALLIST = 'approval-list',
    ALIASTTABLE = 'alias-list',
    TEAMLIST = 'team-list'
}

export enum TablePartitioKey {
    APPROVALLIST = 'id',
    ALIASTTABLE = 'aliasName',
    TEAMLIST = 'id'
}

export enum TableSortKey {
    TEAMLIST = 'libraryName'
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
