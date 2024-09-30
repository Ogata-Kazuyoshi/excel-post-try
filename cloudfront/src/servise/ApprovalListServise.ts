import {ApprovalListRepository, DefaultApprovalListRepository} from "../repository/ApprovalListRepository.ts";
import {RequestUpdateAliasName, TableDisplay} from "../model/HttpInterface.ts";
import _ from "lodash";

export interface ApprovalListServise {
    resisterApprovalList(file: FormData): Promise<string>
    getApprovalListTable(): Promise<TableDisplay[]>
    updateAliasName(reqBody: RequestUpdateAliasName): Promise<void>

}

export class DefaultApprovalListServise implements ApprovalListServise {
    constructor(
        private approvalListRepository: ApprovalListRepository = new DefaultApprovalListRepository()
    ) {}
    async resisterApprovalList(file: FormData): Promise<string> {
        return await this.approvalListRepository.resisterApprovalList(file)
    }

    async getApprovalListTable(): Promise<TableDisplay[]> {
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

    async updateAliasName(reqBody: RequestUpdateAliasName): Promise<void> {
        await this.approvalListRepository.updateAliasName(reqBody)
    }

}