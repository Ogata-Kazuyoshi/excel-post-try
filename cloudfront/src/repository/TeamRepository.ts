import {DefaultHttp, Http} from "../http/Http.ts";
import {apiGateway} from "../config/ReadEnv.ts";
import {ResponceTeamRawList} from "../model/HttpInterface.ts";
import {BaseConfigCreator} from "./BaseConfigCreator.ts";
import {ConfigType} from "../model/RepositoryInterface.ts";

export interface TeamRepository {
    getTeamNames(): Promise<string[]>
    getTeamLicenseRawLists(teamName: string): Promise<ResponceTeamRawList[]>
    resisterTeamLicenseList(file: FormData, teamName: string): Promise<string>
}

export class DefaultTeamRepository extends BaseConfigCreator implements TeamRepository {

    constructor(private http: Http = new DefaultHttp()) {
        super()
    }

    async getTeamNames(): Promise<string[]> {
        return await this.http.get(`${apiGateway}/api/teamLists`)
    }

    async getTeamLicenseRawLists(teamName: string): Promise<ResponceTeamRawList[]> {
        return await this.http.get(`${apiGateway}/api/teamLists/${teamName}`)
    }

    async resisterTeamLicenseList(file: FormData, teamName: string): Promise<string> {
        return await this.http.post(`${apiGateway}/api/teamLists/${teamName}`, file, this.getConfig(ConfigType.FORMDATA))
    }

}