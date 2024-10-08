import {atom} from 'recoil'
import {DisplaySortedByAliasName} from "../model/TeamLicenceList.ts";
import {ResponseApprovalList} from "../model/HttpInterface.ts";

export const teamNameListState = atom<string[]>({
    key: 'teamNameListState',
    default: [],
})

export const selectedTeamState = atom<string>({
    key: 'selectedTeamState',
    default: '',
})

export const sortedByAliasListsState = atom<DisplaySortedByAliasName[]>({
    key: 'sortedByAliasListsState',
    default: [],
})

export const approvalListsState = atom<ResponseApprovalList[]>({
    key: 'approvalListsState',
    default: []
})
