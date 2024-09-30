import {AliasEntity, AliasEntityTemporary, ExcelEntity} from "../model/interface";
import {
    DefaultDynamoDBRepository,
    DynamoDBRepository, GSIQueryRequest,
    UpdateMultiColumnByPartitionKey
} from "../repository/DynamoDBRepository";
import {ApprovalListGSI, TableName, TablePartitioKey} from "../model/TableInterface";

export interface AliasService {
    createAliasRecord(putList: AliasEntity)
    readAllRecords(): Promise<AliasEntity[]>
}

export class DefaultAliasService implements AliasService{

    constructor(
        // private repository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.ALIASTTABLE)
        private repository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.APPROVALLIST)
    ) {}
    async createAliasRecord(putList: AliasEntity) {
        console.log({putList})
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
                // {
                //     updateColumnKey: 'update',
                //     updateColumnValue: currentTime.toISOString()
                // }
            ]
        }
        await this.repository.updateMultiColumnByPartitionKey(updateRequest)

    }

    async readAllRecords(): Promise<AliasEntity[]> {
        return await this.repository.scanParams() as AliasEntity[]
    }

}