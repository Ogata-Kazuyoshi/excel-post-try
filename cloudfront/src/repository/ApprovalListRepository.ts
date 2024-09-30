import {DefaultHttp, Http} from "../http/Http.ts";
import {apiGateway} from "../config/ReadEnv.ts";
import {RequestUpdateAliasName, ResponseApprovalList} from "../model/HttpInterface.ts";
import {BaseConfigCreator} from "./BaseConfigCreator.ts";
import {ConfigType} from "../model/RepositoryInterface.ts";

export interface ApprovalListRepository {
    registerApprovalList(file: FormData): Promise<string>
    getApprovalList(): Promise<ResponseApprovalList[]>
    registerAliasName(reqBody: RequestUpdateAliasName): Promise<void>
}

export class DefaultApprovalListRepository extends BaseConfigCreator implements ApprovalListRepository {
    constructor(private http: Http = new DefaultHttp()) {
        super()
    }

    async registerApprovalList(file: FormData): Promise<string> {
        return await this.http.post(`${apiGateway}/api/lists`, file, this.getConfig(ConfigType.FORMDATA))
    }

    async getApprovalList(): Promise<ResponseApprovalList[]> {
        return await this.http.get(`${apiGateway}/api/lists`)
    }

    async registerAliasName(reqBody: RequestUpdateAliasName): Promise<void> {
        await this.http.post(`${apiGateway}/api/aliases`, reqBody, this.getConfig(ConfigType.JSON))
    }
}