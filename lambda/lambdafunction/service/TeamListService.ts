import {APIGatewayProxyEvent} from "aws-lambda";
import multipart from "lambda-multipart-parser";
import path from "path";
import * as os from "os";
import * as fs from "fs";
import * as XLSX from "xlsx";
import {CSVList, ExcelEntity, TeamListEntity} from "../model/interface.ts";
import {DefaultDynamoDBRepository, DynamoDBRepository} from "../repository/DynamoDBRepository";
import {TableName, TablePrimaryKey} from "../model/TableInterface";

export interface TeamListService {
    resisterToDynamoDB(event: APIGatewayProxyEvent, teamName: string)
    getTeamListByName(teamName: string): Promise<TeamListEntity[]>
    readAllData(): Promise<ExcelEntity[]>
}

export class DefaultTeamListService implements TeamListService{

    constructor(
        private teamListRepository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.TEAMLIST),
        private aliasListRepository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.ALIASTTABLE),
        private approvalListRepository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.APPROVALLIST)
    ){}

    async resisterToDynamoDB(event: APIGatewayProxyEvent, teamName: string) {
        const encodedFile = await multipart.parse(event)
        const file = encodedFile.files.find(file => file.fieldname === 'file')
        const tempFilePath = path.join(os.tmpdir(), file.filename);
        fs.writeFileSync(tempFilePath, file.content);

        console.log({teamName})


        const jsonDataLists = this.excelExtractor(tempFilePath);
        const temp = jsonDataLists[0]
        console.log({temp})
        for (const data of jsonDataLists) {
            if (data.length !== 0) {
                let licenseName: string
                let spdx = ""
                let originalUse = ""

                const aliasName = data[CSVList.ARIASNAME]
                const aliasRecord = await this.aliasListRepository.getItemByPrimaryKey({
                    primaryKeyName: TablePrimaryKey.ALIASTTABLE,
                    primaryKeyValue: aliasName
                })
                licenseName = aliasRecord ? aliasRecord.originalName : "unknown"
                if (licenseName !== "unknown") {
                    const approvalListRecord = await this.approvalListRepository.getItemByPrimaryKey({
                        primaryKeyName: TablePrimaryKey.APPROVALLIST,
                        primaryKeyValue: aliasRecord!.originalName
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
        fs.unlinkSync(tempFilePath);
    }

    async getTeamListByName(teamName: string) {
        return await this.teamListRepository.queryItemsByPrimaryKey({
            primaryKeyName: TablePrimaryKey.TEAMLIST,
            primaryKeyValue: teamName
        })
    }

    async readAllData(): Promise<ExcelEntity[]> {
        const scanResults = await this.teamListRepository.scanParams()
        return Promise.resolve(scanResults.Items as ExcelEntity[]);
    }

    private excelExtractor(tempFilePath: string) {
        const workbook = XLSX.readFile(tempFilePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        return XLSX.utils.sheet_to_json(worksheet, {header: 1});
    }
}