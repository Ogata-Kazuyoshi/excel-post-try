import {DefaultHttp, Http} from "../http/Http.ts";
import {AxiosRequestConfig} from "axios";
import {apiGateway} from "../config/ReadEnv.ts";
import {ResponseAliasList, ResponseApprovalList} from "../model/HttpInterface.ts";

export interface ApprovalListRepository {
    resisterApprovalList(file: FormData): Promise<string>
    resisterAliasRecord(file: FormData, teamName: string): Promise<string>
    getApprovalList(): Promise<ResponseApprovalList[]>
    getAliasList(): Promise<ResponseAliasList[]>
}

export class DefaultApprovalListRepository implements ApprovalListRepository {

    config: AxiosRequestConfig = {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    };
    constructor(private http: Http = new DefaultHttp()) {
    }

    async resisterApprovalList(file: FormData): Promise<string> {
        return await this.http.post(`${apiGateway}/api/lists`, file, this.config)
    }

    async resisterAliasRecord(file: FormData, teamName: string): Promise<string> {
        return await this.http.post(`${apiGateway}/api/teamLists/${teamName}`, file, this.config)
    }

    async getApprovalList(): Promise<ResponseApprovalList[]> {
        return await this.http.get(`${apiGateway}/api/lists`)
    }

    async getAliasList(): Promise<ResponseAliasList[]> {
        return await this.http.get(`${apiGateway}/api/aliases`)
    }



}