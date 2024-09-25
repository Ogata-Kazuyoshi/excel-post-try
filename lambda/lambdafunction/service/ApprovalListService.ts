import {APIGatewayProxyEvent} from "aws-lambda";
import multipart from "lambda-multipart-parser";
import path from "path";
import * as os from "os";
import * as fs from "fs";
import * as XLSX from "xlsx";
import {ColumnName, ExcelEntity} from "../model/interface.ts";
import {DefaultDynamoDBRepository, DynamoDBRepository} from "../repository/DynamoDBRepository";
import {TableName, TablePrimaryKey} from "../model/TableInterface";

export interface ApprovalListService {
    resisterToDynamoDB(event: APIGatewayProxyEvent)
    readAllData(): Promise<ExcelEntity[]>
}

export class DefaultApprovalListService implements ApprovalListService{

    constructor(
        private repository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.APPROVALLIST)
    ) {}

    async resisterToDynamoDB(event: APIGatewayProxyEvent) {
        const encodedFile = await multipart.parse(event)
        const file = encodedFile.files.find(file => file.fieldname === 'file')
        const tempFilePath = path.join(os.tmpdir(), file.filename);
        fs.writeFileSync(tempFilePath, file.content);

        await this.deleteAllData();

        const jsonDataLists = this.excelExtractor(tempFilePath);
        for (const data of jsonDataLists) {
            if (data.length !== 0) {
                const putList: ExcelEntity = {
                    licenseName: data[ColumnName.LICENCENAME],
                    shortIdentifier: data[ColumnName.SHORTIDENTIFIER],
                    fullName: data[ColumnName.FULLNAME],
                    spdx: data[ColumnName.SPDX],
                    originalUse: data[ColumnName.ORIGINALUSE],
                    modified: data[ColumnName.MODIFIED],
                }
                await this.repository.putItem(putList)
            }
        }

        fs.unlinkSync(tempFilePath);
    }

    async readAllData(): Promise<ExcelEntity[]> {
        const scanResults = await this.repository.scanParams()
        return Promise.resolve(scanResults.Items as ExcelEntity[]);
    }

    private async deleteAllData() {
        const scanResults = await this.repository.scanParams()
        for (const item of scanResults.Items) {
            await this.repository.deleteItemByPrimaryKey({
                primaryKeyName: TablePrimaryKey.APPROVALLIST,
                primaryKeyValue: item.licenseName
            })
        }
    }

    private excelExtractor(tempFilePath: string) {
        const workbook = XLSX.readFile(tempFilePath);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];

        return XLSX.utils.sheet_to_json(worksheet, {header: 1});
    }


}