import {DefaultHttp, Http} from "../http/Http.ts";
import {apiGateway} from "../config/ReadEnv.ts";
import {TeamRawList} from "../model/TeamLicenceList.ts";

export interface TeamRepository {
    getTeamNames(): Promise<string[]>
    getTeamLicenseRawLists(teamName: string): Promise<TeamRawList[]>
}

export class DefaultTeamRepository implements TeamRepository {
    constructor(private http: Http = new DefaultHttp()) {
    }

    async getTeamNames(): Promise<string[]> {
        return await this.http.get(`${apiGateway}/api/teamLists`)
    }

    async getTeamLicenseRawLists(teamName: string): Promise<TeamRawList[]> {
        return await this.http.get(`${apiGateway}/api/teamLists/${teamName}`)
    }

}