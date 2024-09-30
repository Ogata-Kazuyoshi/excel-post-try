import {APIGatewayProxyEvent} from "aws-lambda";
import multipart from "lambda-multipart-parser";
import {CheckResult, CSVList, ExcelEntity, TeamListEntity} from "../model/interface.ts";
import {DefaultDynamoDBRepository, DynamoDBRepository, GSIQueryRequest} from "../repository/DynamoDBRepository";
import {ApprovalListGSI, TableName, TeamListGSI} from "../model/TableInterface";
import {BaseExcelFileExtractor} from "./ExcelFileExtractor";
import {v4 as uuidv4} from 'uuid'

export interface TeamListService {
    createTeamLists(event: APIGatewayProxyEvent, teamName: string)
    getTeamListByName(teamName: string): Promise<TeamListEntity[]>
    getTeamNames(): Promise<string[]>
}

export class DefaultTeamListService extends BaseExcelFileExtractor implements TeamListService{

    constructor(
        private teamListRepository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.TEAMLIST),
        private approvalListRepository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.APPROVALLIST)
    ){
        super()
    }

    async createTeamLists(event: APIGatewayProxyEvent, teamName: string) {
        const encodedFile = (await multipart.parse(event)).files[0]
        const jsonDataLists = this.jsonListsParser(encodedFile)
        const currentTeamRecords = await this.readCurrentLicense(teamName);
        for (const data of jsonDataLists) {

            const currentLibraryName = data[CSVList.LIBRARYNAME]
            const aliasRecords = currentTeamRecords.find(record => record.libraryName === currentLibraryName)
            if (aliasRecords) {
                console.log('何もしなくて良いです!!一旦既存のライブラリに対しては何もしないにしたが、やることあったらここで実施')
            } else {

                let licenseName: string
                let spdx = ""
                let originalUse = ""

                const aliasName = data[CSVList.ARIASNAME]
                const GSIReq: GSIQueryRequest = {
                    indexName: ApprovalListGSI.AliasIndexName,
                    partitionKeyName: ApprovalListGSI.AliasNamePK,
                    partitionKeyValue: aliasName
                }

                const currentApprovalListRecord = (await this.approvalListRepository.queryItemsByGSI(GSIReq) as ExcelEntity[])[0]
                licenseName = currentApprovalListRecord ? currentApprovalListRecord.licenseName : CheckResult.UNKNOWN
                if (licenseName !== CheckResult.UNKNOWN) {
                    spdx = currentApprovalListRecord.spdx
                    originalUse = currentApprovalListRecord.originalUse
                }

                const putList: TeamListEntity = {
                    id: uuidv4(),
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
        const GSIReq: GSIQueryRequest = {
            indexName: TeamListGSI.teamIndexName,
            partitionKeyName: TeamListGSI.teamNamePK,
            partitionKeyValue: teamName
        }
        return await this.teamListRepository.queryItemsByGSI(GSIReq) as TeamListEntity[]
    }

    async getTeamNames(): Promise<string[]> {
        const teamListRecords = await this.teamListRepository.scanParams() as TeamListEntity[]
        const teamNameLists = teamListRecords.map(teamListRecord => teamListRecord.teamName)
        const uniqueTeamName = [...new Set(teamNameLists)];
        return uniqueTeamName
    }

    private async readCurrentLicense(teamName: string) {
        const GSIReq: GSIQueryRequest = {
            indexName: TeamListGSI.teamIndexName,
            partitionKeyName: TeamListGSI.teamNamePK,
            partitionKeyValue: teamName
        }
        return (await this.teamListRepository.queryItemsByGSI(GSIReq) as TeamListEntity[])
    }
}