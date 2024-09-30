import {DefaultHttp, Http} from "../http/Http.ts";
import {apiGateway} from "../config/ReadEnv.ts";
import {
    RequestUpdateAliasName,
    ResponseAliasList,
    ResponseApprovalList,
    ResponseUpdateAliasRecord
} from "../model/HttpInterface.ts";
import {BaseConfigCreator} from "./BaseConfigCreator.ts";
import {ConfigType} from "../model/RepositoryInterface.ts";

export interface ApprovalListRepository {
    resisterApprovalList(file: FormData): Promise<string>
    getApprovalList(): Promise<ResponseApprovalList[]>
    getAliasList(): Promise<ResponseAliasList[]>
    updateAliasName(reqBody: RequestUpdateAliasName): Promise<void>
    updateAliasRecord(reqBody: RequestUpdateAliasName): Promise<ResponseUpdateAliasRecord>
}

export class DefaultApprovalListRepository extends BaseConfigCreator implements ApprovalListRepository {
    constructor(private http: Http = new DefaultHttp()) {
        super()
    }

    async resisterApprovalList(file: FormData): Promise<string> {
        return await this.http.post(`${apiGateway}/api/lists`, file, this.getConfig(ConfigType.FORMDATA))
    }

    async getApprovalList(): Promise<ResponseApprovalList[]> {
        return await this.http.get(`${apiGateway}/api/lists`)
    }

    async getAliasList(): Promise<ResponseAliasList[]> {
        return await this.http.get(`${apiGateway}/api/aliases`)
    }

    async updateAliasName(reqBody: RequestUpdateAliasName): Promise<void> {
        await this.http.post(`${apiGateway}/api/aliases`, reqBody, this.getConfig(ConfigType.JSON))
    }

    async updateAliasRecord(reqBody: RequestUpdateAliasName): Promise<ResponseUpdateAliasRecord> {
        return await this.http.put(`${apiGateway}/api/aliases`, reqBody, this.getConfig(ConfigType.JSON))
    }
}