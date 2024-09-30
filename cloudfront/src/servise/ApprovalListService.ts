import {ApprovalListRepository, DefaultApprovalListRepository} from "../repository/ApprovalListRepository.ts";
import {RequestUpdateAliasName, ResponseUpdateAliasRecord, TableDisplay} from "../model/HttpInterface.ts";
import _ from "lodash";

export interface ApprovalListService {
    resisterApprovalList(file: FormData): Promise<string>
    getApprovalList(): Promise<TableDisplay[]>
    registerAliasName(reqBody: RequestUpdateAliasName): Promise<void>
    updateAliasName(reqBody: RequestUpdateAliasName): Promise<ResponseUpdateAliasRecord>

}

export class DefaultApprovalListServise implements ApprovalListService {
    constructor(
        private approvalListRepository: ApprovalListRepository = new DefaultApprovalListRepository()
    ) {}
    async resisterApprovalList(file: FormData): Promise<string> {
        return await this.approvalListRepository.resisterApprovalList(file)
    }

    async getApprovalList(): Promise<TableDisplay[]> {
        const approvalRawList = await this.approvalListRepository.getApprovalList()
        const clone = _.cloneDeep(approvalRawList)
        const sortedRes = clone.sort((a,b) => a.shortIdentifier.localeCompare(b.shortIdentifier))
        const aliasLists = await this.approvalListRepository.getAliasList()
        const displayLists: TableDisplay[] = sortedRes.map(elm => ({...elm, aliasName: undefined }))
        aliasLists.forEach(aliasList => {
            const targetIndex = displayLists.findIndex(displayList => displayList.licenseName === aliasList.licenseName)
            displayLists[targetIndex].aliasName = aliasList.aliasName
        })
        return displayLists
    }

    async registerAliasName(reqBody: RequestUpdateAliasName): Promise<void> {
        await this.approvalListRepository.updateAliasName(reqBody)
    }

    async updateAliasName(reqBody: RequestUpdateAliasName): Promise<ResponseUpdateAliasRecord> {
        return await this.approvalListRepository.updateAliasRecord(reqBody)
    }

}