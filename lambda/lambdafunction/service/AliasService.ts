import {AliasEntity, AliasEntityTemporary} from "../model/interface";
import {
    DefaultDynamoDBRepository,
    DynamoDBRepository,
    UpdateMultiColumnByPartitionKey
} from "../repository/DynamoDBRepository";
import {TableName, TablePartitioKey} from "../model/TableInterface";

export interface AliasService {
    createAliasRecord(putList: AliasEntity)
    updateAliasRecord(putList: AliasEntity): Promise<AliasEntityTemporary>
    readAllRecords(): Promise<AliasEntity[]>
}

export class DefaultAliasService implements AliasService{

    constructor(
        private repository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.ALIASTTABLE)
    ) {}
    async createAliasRecord(putList: AliasEntity) {
        const tempRequest: AliasEntityTemporary = {
            ...putList,
            testColumn1: `${putList.aliasName} + ${putList.licenseName}`,
            testColumn2: 'hogehoge'
        }
        await this.repository.putItem(tempRequest)
    }

    async readAllRecords(): Promise<AliasEntity[]> {
        return await this.repository.scanParams() as AliasEntity[]
    }

    async updateAliasRecord(putList: AliasEntity): Promise<AliasEntityTemporary> {
        const requestUpdate: UpdateMultiColumnByPartitionKey = {
            partitionKeyName: TablePartitioKey.ALIASTTABLE,
            partitionKeyValue: putList.aliasName,
            updateColumns: [
                {
                    updateColumnKey: 'testColumn1',
                    updateColumnValue: 'アップデートコマンドがうまく働いてます'
                },
                {
                    updateColumnKey: 'testColumn2',
                    updateColumnValue: 'fugafuga'
                }
            ]
        }
        return await this.repository.updateMultiColumnByPartitionKey(requestUpdate) as AliasEntityTemporary
    }

}