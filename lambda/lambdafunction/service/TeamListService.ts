import {APIGatewayProxyEvent} from "aws-lambda";
import multipart from "lambda-multipart-parser";
import {CheckResult, CSVList, TeamListEntity} from "../model/interface.ts";
import {DefaultDynamoDBRepository, DynamoDBRepository} from "../repository/DynamoDBRepository";
import {TableName, TablePrimaryKey} from "../model/TableInterface";
import {BaseExcelFileExtractor} from "./ExcelFileExtractor";

export interface TeamListService {
    resisterToDynamoDB(event: APIGatewayProxyEvent, teamName: string)
    getTeamListByName(teamName: string): Promise<TeamListEntity[]>
    getTeamNames(): Promise<string[]>
}

export class DefaultTeamListService extends BaseExcelFileExtractor implements TeamListService{

    constructor(
        private teamListRepository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.TEAMLIST),
        private aliasListRepository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.ALIASTTABLE),
        private approvalListRepository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.APPROVALLIST)
    ){
        super()
    }

    async resisterToDynamoDB(event: APIGatewayProxyEvent, teamName: string) {
        const encodedFile = (await multipart.parse(event)).files[0]
        const jsonDataLists = this.jsonListsParser(encodedFile)


        for (const data of jsonDataLists) {
            const isEmptyRow = data.length === 0
            if (!isEmptyRow) {
                let licenseName: string
                let spdx = ""
                let originalUse = ""

                const aliasName = data[CSVList.ARIASNAME]
                const aliasRecord = await this.aliasListRepository.getItemByPrimaryKey({
                    primaryKeyName: TablePrimaryKey.ALIASTTABLE,
                    primaryKeyValue: aliasName
                })
                licenseName = aliasRecord ? aliasRecord.licenseName : CheckResult.UNKNOWN
                if (licenseName !== CheckResult.UNKNOWN) {
                    const approvalListRecord = await this.approvalListRepository.getItemByPrimaryKey({
                        primaryKeyName: TablePrimaryKey.APPROVALLIST,
                        primaryKeyValue: aliasRecord!.licenseName
                    })
                    spdx = approvalListRecord!.spdx
                    originalUse = approvalListRecord!.originalUse
                }

                const putList: TeamListEntity = {
                    teamName: teamName,
                    libraryName: data[CSVList.LIBRARYNAME],
                    version: data[CSVList.VERSION],
                    aliasName,
                    licenseName,
                    spdx,
                    originalUse
                }
                await this.teamListRepository.putItem(putList)
            }
        }

    }

    async getTeamListByName(teamName: string) {
        return await this.teamListRepository.queryItemsByPrimaryKey({
            primaryKeyName: TablePrimaryKey.TEAMLIST,
            primaryKeyValue: teamName
        }) as TeamListEntity[]
    }

    async getTeamNames(): Promise<string[]> {
        const teamListRecords = await this.teamListRepository.scanParams() as TeamListEntity[]
        const teamNameLists = teamListRecords.map(teamListRecord => teamListRecord.teamName)
        const uniqueTeamName = [...new Set(teamNameLists)];
        return uniqueTeamName
    }
}