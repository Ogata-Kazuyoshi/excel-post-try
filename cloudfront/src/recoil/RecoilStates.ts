import { atom } from 'recoil'
import {DisplaySortedByAliasName} from "../model/TeamLicenceList.ts";
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
