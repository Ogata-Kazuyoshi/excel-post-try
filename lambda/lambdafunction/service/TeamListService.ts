import {APIGatewayProxyEvent} from "aws-lambda";
import multipart from "lambda-multipart-parser";
import path from "path";
import * as os from "os";
import * as fs from "fs";
import * as XLSX from "xlsx";
import {CSVList, ExcelEntity, TeamListEntity} from "../model/interface.ts";
import {ApprovalListRepository, DefaultApprovalListRepository} from "../repository/ApprovalListRepository";
import {DefaultTeamListRepository, TeamListRepository} from "../repository/TeamListRepository";
import {AliasRepository, DefaultAliasRepository} from "../repository/AliasRepository";

export interface TeamListService {
    resisterToDynamoDB(event: APIGatewayProxyEvent, teamName: string)
    getTeamListByName(teamName: string): Promise<TeamListEntity[]>
    readAllData(): Promise<ExcelEntity[]>
}

export class DefaultTeamListService implements TeamListService{

    constructor(
        private teamListRepository: TeamListRepository = new DefaultTeamListRepository(),
        private aliasListRepository: AliasRepository = new DefaultAliasRepository(),
        private approvalListRepository: ApprovalListRepository = new DefaultApprovalListRepository()
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
        for (const [index, data] of jsonDataLists.entries()) {
            if (data.length !== 0) {
                let licenseName: string
                let spdx = ""
                let originalUse = ""

                const aliasName = data[CSVList.ARIASNAME]
                const aliasRecord = await this.aliasListRepository.getItemByAliasName(aliasName)
                licenseName = aliasRecord ? aliasRecord.originalName : "unknown"
                console.log({licenseName})
                console.log({index})
                if (licenseName !== "unknown") {
                    const approvalListRecord = await this.approvalListRepository.getItemByLicenseName(aliasRecord!.originalName)
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
        return await this.teamListRepository.queryItemsByPrimaryKey(teamName)
    }

    async readAllData(): Promise<ExcelEntity[]> {
        const scanResults = await this.teamListRepository.scanParams()
        return Promise.resolve(scanResults.Items as ExcelEntity[]);
    }

    private async deleteAllData() {
        const scanResults = await this.teamListRepository.scanParams()
        for (const item of scanResults.Items) {
            await this.teamListRepository.deleteItem(item.id)
        }
    }

    private excelExtractor(tempFilePath: string) {
        const workbook = XLSX.readFile(tempFilePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        return XLSX.utils.sheet_to_json(worksheet, {header: 1});
    }




}