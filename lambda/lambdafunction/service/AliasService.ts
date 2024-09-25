import {AliasEntity} from "../model/interface";
import {DefaultDynamoDBRepository, DynamoDBRepository} from "../repository/DynamoDBRepository";
import {TableName} from "../model/TableInterface";

export interface AliasService {
    resisterAlias(record: AliasEntity)
    readAllData(): Promise<AliasEntity[]>
}

export class DefaultAliasService implements AliasService{

    constructor(
        private repository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.ALIASTTABLE)
    ) {}
    async resisterAlias(record: AliasEntity) {
        await this.repository.putItem(record)
    }

    async readAllData(): Promise<AliasEntity[]> {
        const scanResults = await this.repository.scanParams()
        return scanResults.Items as AliasEntity[]
    }

}