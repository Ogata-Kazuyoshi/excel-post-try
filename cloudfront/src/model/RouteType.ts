export enum RouteType {
    LISTS= "1",
    TEAMS= "2",
    TEAMLIST="3"
}

export const pathObject: PathObject = {
    "1" : "lists",
    "2" : "teams",
    "3" : "team-list"
}

interface PathObject {
    [key: string]: string
}
