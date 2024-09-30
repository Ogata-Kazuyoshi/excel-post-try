import {APIGatewayProxyEvent} from "aws-lambda";
import multipart from "lambda-multipart-parser";
import {ColumnName, ExcelEntity} from "../model/interface.ts";
import {DefaultDynamoDBRepository, DynamoDBRepository, GSIQueryRequest} from "../repository/DynamoDBRepository";
import {ApprovalListGSI, TableName, TablePartitioKey} from "../model/TableInterface";
import {BaseExcelFileExtractor} from "./ExcelFileExtractor";
import {v4 as uuidv4} from 'uuid'

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
        const encodedFile = (await multipart.parse(event)).files[0]
        const jsonDataLists = this.jsonListsParser(encodedFile)

        for (const data of jsonDataLists) {
            const putList: ExcelEntity = {
                id: uuidv4(),
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

    async readAllData(): Promise<ExcelEntity[]> {
        return await this.repository.scanParams() as ExcelEntity[]
    }

    //TODO 一旦使ってないけど、消したい時のイメージとして残しておく
    private async deleteAllData() {
        const Items = await this.repository.scanParams() as ExcelEntity[]
        for (const item of Items) {
            await this.repository.deleteItemByPartitionKey({
                partitionKeyName: TablePartitioKey.APPROVALLIST,
                partitionKeyValue: item.licenseName
            })
        }
    }
}