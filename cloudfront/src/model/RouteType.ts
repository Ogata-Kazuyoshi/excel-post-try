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