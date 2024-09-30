export enum TableName {
    APPROVALLIST = 'approval-list',
    ALIASTTABLE = 'ogata-aliases',
    TEAMLIST = 'ogata-teamList'
}

export enum TablePartitioKey {
    APPROVALLIST = 'licenseName',
    ALIASTTABLE = 'aliasName',
    TEAMLIST = 'teamName'
}

export enum TableSortKey {
    TEAMLIST = 'libraryName'
}