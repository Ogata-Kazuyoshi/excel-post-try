import {ApprovalListRepository, DefaultApprovalListRepository} from "../repository/ApprovalListRepository.ts";
import {RequestUpdateAliasName, ResponseApprovalList,} from "../model/HttpInterface.ts";
import _ from "lodash";

export interface ApprovalListService {
    resisterApprovalList(file: FormData): Promise<string>
    getApprovalList(): Promise<ResponseApprovalList[]>
    registerAliasName(reqBody: RequestUpdateAliasName): Promise<void>
}

export class DefaultApprovalListServise implements ApprovalListService {
    constructor(
        private approvalListRepository: ApprovalListRepository = new DefaultApprovalListRepository()
    ) {}
    async resisterApprovalList(file: FormData): Promise<string> {
        return await this.approvalListRepository.registerApprovalList(file)
    }

    async getApprovalList(): Promise<ResponseApprovalList[]> {
        const res =  await this.approvalListRepository.getApprovalList()
        const clone = _.cloneDeep(res)
        return clone.sort((a,b) => a.shortIdentifier.localeCompare(b.shortIdentifier))
    }

    async registerAliasName(reqBody: RequestUpdateAliasName): Promise<void> {
        await this.approvalListRepository.registerAliasName(reqBody)
    }
}