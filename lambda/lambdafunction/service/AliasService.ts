import {AliasEntity} from "../model/interface";
import {AliasRepository, DefaultAliasRepository} from "../repository/AliasRepository";

export interface AliasService {
    resisterAlias(record: AliasEntity)
    readAllData(): Promise<AliasEntity[]>
}

export class DefaultAliasService implements AliasService{

    constructor(private repository: AliasRepository = new DefaultAliasRepository()) {
    }
    async resisterAlias(record: AliasEntity) {
        await this.repository.putItem(record)
    }

    async readAllData(): Promise<AliasEntity[]> {
        const scanResults = await this.repository.scanParams()
        return Promise.resolve(scanResults.Items as AliasEntity[]);
    }

}