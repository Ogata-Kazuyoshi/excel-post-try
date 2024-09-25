import {APIGatewayProxyEvent} from "aws-lambda";
import multipart from "lambda-multipart-parser";
import {ColumnName, ExcelEntity} from "../model/interface.ts";
import {DefaultDynamoDBRepository, DynamoDBRepository} from "../repository/DynamoDBRepository";
import {TableName, TablePrimaryKey} from "../model/TableInterface";
import {BaseExcelFileExtractor} from "./ExcelFileExtractor";

export interface ApprovalListService {
    resisterToDynamoDB(event: APIGatewayProxyEvent)
    readAllData(): Promise<ExcelEntity[]>
}

export class DefaultApprovalListService extends BaseExcelFileExtractor implements ApprovalListService{

    constructor(
        private repository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.APPROVALLIST)
    ) {
        super()
    }

    async resisterToDynamoDB(event: APIGatewayProxyEvent) {
        await this.deleteAllData();

        const encodedFile = await multipart.parse(event)
        const file = encodedFile.files.find(file => file.fieldname === 'file')
        const jsonDataLists = this.jsonListsParser(file)

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
}