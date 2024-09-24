import {DeleteCommand, NativeAttributeValue, PutCommand, ScanCommand, ScanCommandOutput} from "@aws-sdk/lib-dynamodb";
import {dynamo} from "../config/dynamodbConfig";
import {ExcelEntity, TeamListEntity} from "../model/interface";

export interface TeamListRepository {
    scanParams():Promise<(Omit<ScanCommandOutput, "Items" | "LastEvaluatedKey"> & {Items?: Record<string, NativeAttributeValue>[], LastEvaluatedKey?: Record<string, NativeAttributeValue>}) | ScanCommandOutput>
    deleteItem(id: string)
    putItem(putList: TeamListEntity)

}

export class DefaultTeamListRepository implements TeamListRepository {

    tableName: string = 'ogata-teamList'

    // ogata-teamList
    // temaName
    // libraryName

    async scanParams(): Promise<(Omit<ScanCommandOutput, "Items" | "LastEvaluatedKey"> & {
        Items?: Record<string, NativeAttributeValue>[];
        LastEvaluatedKey?: Record<string, NativeAttributeValue>
    }) | ScanCommandOutput> {
        return await dynamo.send(new ScanCommand({
            TableName: this.tableName
        }))
    }

    async deleteItem(id: string) {
        await dynamo.send(new DeleteCommand({
            TableName: this.tableName,
            Key: {
                id: id
            }
        }))
    }

    async putItem(putList: TeamListEntity) {
        await dynamo.send(new PutCommand({
            TableName: this.tableName,
            Item: putList
        }))
    }
}