import {APIGatewayProxyEvent} from "aws-lambda";
import multipart from "lambda-multipart-parser";
import {AliasEntity, ColumnName, ExcelEntity} from "../model/interface.ts";
import {
    DefaultDynamoDBRepository,
    DynamoDBRepository,
    GSIQueryRequest,
    UpdateMultiColumnByPartitionKey
} from "../repository/DynamoDBRepository";
import {ApprovalListGSI, TableName, TablePartitioKey} from "../model/TableInterface";
import {BaseExcelFileExtractor} from "./ExcelFileExtractor";
import {v4 as uuidv4} from 'uuid'

export interface ApprovalListService {
    createApprovalLists(event: APIGatewayProxyEvent)
    getAllApprovalLists(): Promise<ExcelEntity[]>
    createAliasRecord(putList: AliasEntity)
}

export class DefaultApprovalListService extends BaseExcelFileExtractor implements ApprovalListService{

    constructor(
        private repository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.APPROVALLIST)
    ) {
        super()
    }

    async createApprovalLists(event: APIGatewayProxyEvent) {
        const encodedFile = (await multipart.parse(event)).files[0]
        const jsonDataLists = this.jsonListsParser(encodedFile)

        for (const data of jsonDataLists) {
            const currentRecord = await this.readCurrentLicense(data);
            if (currentRecord) {
                const updateRequest: UpdateMultiColumnByPartitionKey = {
                    partitionKeyName: TablePartitioKey.APPROVALLIST,
                    partitionKeyValue: currentRecord.id,
                    updateColumns: [
                        {updateColumnKey: 'originalUse', updateColumnValue: data[ColumnName.ORIGINALUSE] },
                        {updateColumnKey: 'modified', updateColumnValue: data[ColumnName.MODIFIED] }
                    ]
                }
                await this.repository.updateMultiColumnByPartitionKey(updateRequest)
            } else {
                const putList: ExcelEntity = {
                    id: uuidv4(),
                    licenseName: data[ColumnName.LICENCENAME],
                    shortIdentifier: data[ColumnName.SHORTIDENTIFIER],
                    fullName: data[ColumnName.FULLNAME],
                    spdx: data[ColumnName.SPDX],
                    originalUse: data[ColumnName.ORIGINALUSE],
                    modified: data[ColumnName.MODIFIED],
                    startedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                }
                await this.repository.putItem(putList)
            }
        }
    }
    async createAliasRecord(putList: AliasEntity) {
        const {aliasName, licenseName} = putList
        const GSIReq: GSIQueryRequest = {
            indexName: ApprovalListGSI.LicenseIndexName,
            partitionKeyName: ApprovalListGSI.LicenseNamePK,
            partitionKeyValue: licenseName
        }
        const currentRecord = await this.repository.queryItemsByGSI(GSIReq) as ExcelEntity[]
        const updateRequest: UpdateMultiColumnByPartitionKey = {
            partitionKeyName: TablePartitioKey.APPROVALLIST,
            partitionKeyValue: currentRecord[0].id,
            updateColumns: [
                {
                    updateColumnKey: 'aliasName',
                    updateColumnValue: aliasName
                },
                {
                    updateColumnKey: 'updatedAt',
                    updateColumnValue: new Date().toISOString()
                }
            ]
        }
        await this.repository.updateMultiColumnByPartitionKey(updateRequest)
    }


    async getAllApprovalLists(): Promise<ExcelEntity[]> {
        return await this.repository.scanParams() as ExcelEntity[]
    }

    private async readCurrentLicense(data: string) {
        const GSIReq: GSIQueryRequest = {
            indexName: ApprovalListGSI.LicenseIndexName,
            partitionKeyName: ApprovalListGSI.LicenseNamePK,
            partitionKeyValue: data[ColumnName.LICENCENAME]
        }
        return (await this.repository.queryItemsByGSI(GSIReq) as ExcelEntity[])[0]
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