export enum RouteType {
    LISTS= "1",
    TEAMS= "2"
}

export const pathObject: PathObject = {
    "1" : "lists",
    "2" : "teams"
}

interface PathObject {
    [key: string]: string
}

export interface TeamListEntity {
    teamName: string
    libraryName: string
    version: string
    aliasName: string
    licenseName: string
    spdx: string
    originalUse: string
}