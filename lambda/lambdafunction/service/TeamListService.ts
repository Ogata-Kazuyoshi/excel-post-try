import {APIGatewayProxyEvent} from "aws-lambda";
import multipart from "lambda-multipart-parser";
import {CheckResult, CSVList, ExcelEntity, ResponseTeamList, TeamListEntity} from "../model/interface.ts";
import {DefaultDynamoDBRepository, DynamoDBRepository, GSIQueryRequest} from "../repository/DynamoDBRepository";
import {ApprovalListGSI, TableName, TeamListGSI} from "../model/TableInterface";
import {BaseExcelFileExtractor} from "./ExcelFileExtractor";
import {v4 as uuidv4} from 'uuid'

export interface TeamListService {
    createTeamLists(event: APIGatewayProxyEvent, teamName: string)
    getTeamListByName(teamName: string): Promise<ResponseTeamList[]>
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
                const putList: TeamListEntity = {
                    id: uuidv4(),
                    teamName: teamName,
                    libraryName: data[CSVList.LIBRARYNAME],
                    version: data[CSVList.VERSION],
                    aliasName: data[CSVList.ARIASNAME],
                }
                await this.teamListRepository.putItem(putList)
            }
        }
    }

    async getTeamListByName(teamName: string): Promise<ResponseTeamList[]> {
        const GSIReq: GSIQueryRequest = {
            indexName: TeamListGSI.teamIndexName,
            partitionKeyName: TeamListGSI.teamNamePK,
            partitionKeyValue: teamName
        }
        const teamEntities =  await this.teamListRepository.queryItemsByGSI(GSIReq) as TeamListEntity[]
        return await this.createResponseTeamList(teamEntities);
    }

    private async createResponseTeamList(teamEntities: TeamListEntity[]) {
        const temporaryMemoryForAlias:TemporaryMemoryForAlias = {}
        const result: ResponseTeamList[] = []
        for (const teamEntity of teamEntities) {
            const aliasName = teamEntity.aliasName
            const GSIReq: GSIQueryRequest = {
                indexName: ApprovalListGSI.AliasIndexName,
                partitionKeyName: ApprovalListGSI.AliasNamePK,
                partitionKeyValue: aliasName
            }
            const isExistingMemoryForAlias = temporaryMemoryForAlias[aliasName] !== undefined
            const currentApprovalListRecords =
                isExistingMemoryForAlias? temporaryMemoryForAlias[aliasName] : (await this.approvalListRepository.queryItemsByGSI(GSIReq) as ExcelEntity[])
            const isLicenseExisting = currentApprovalListRecords.length !== 0
            const modifiedData: ResponseTeamList = {
                id: teamEntity.id,
                teamName: teamEntity.teamName,
                libraryName: teamEntity.libraryName,
                version: teamEntity.version,
                aliasName,
                licenseName: isLicenseExisting ? currentApprovalListRecords[0].licenseName : CheckResult.UNKNOWN,
                spdx: isLicenseExisting ? currentApprovalListRecords[0].spdx : '',
                originalUse: isLicenseExisting ? currentApprovalListRecords[0].originalUse : '',
            }
            result.push(modifiedData)
            temporaryMemoryForAlias[aliasName] = currentApprovalListRecords
        }
        return result
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

type TemporaryMemoryForAlias = {
    [key: string]: ExcelEntity[]
}