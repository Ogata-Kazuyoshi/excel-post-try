import {AliasEntity} from "../model/interface";
import {DefaultDynamoDBRepository, DynamoDBRepository} from "../repository/DynamoDBRepository";
import {TableName} from "../model/TableInterface";

export interface AliasService {
    resisterToDynamoDB(putList: AliasEntity)
    readAllData(): Promise<AliasEntity[]>
}

export class DefaultAliasService implements AliasService{

    constructor(
        private repository: DynamoDBRepository = new DefaultDynamoDBRepository(TableName.ALIASTTABLE)
    ) {}
    async resisterToDynamoDB(putList: AliasEntity) {
        await this.repository.putItem(putList)
    }

    async readAllData(): Promise<AliasEntity[]> {
        return await this.repository.scanParams() as AliasEntity[]
    }

}