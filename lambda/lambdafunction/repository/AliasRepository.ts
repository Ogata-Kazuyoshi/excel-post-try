import {NativeAttributeValue, PutCommand, ScanCommand, ScanCommandOutput} from "@aws-sdk/lib-dynamodb";
import {dynamo} from "../config/dynamodbConfig";
import {AliasEntity} from "../model/interface";

export interface AliasRepository {
    scanParams():Promise<(Omit<ScanCommandOutput, "Items" | "LastEvaluatedKey"> & {Items?: Record<string, NativeAttributeValue>[], LastEvaluatedKey?: Record<string, NativeAttributeValue>}) | ScanCommandOutput>
    putItem(record: AliasEntity)
}

export class DefaultAliasRepository implements AliasRepository {

    tableName: string = 'ogata-aliases'

    async scanParams(): Promise<(Omit<ScanCommandOutput, "Items" | "LastEvaluatedKey"> & {
        Items?: Record<string, NativeAttributeValue>[];
        LastEvaluatedKey?: Record<string, NativeAttributeValue>
    }) | ScanCommandOutput> {
        return await dynamo.send(new ScanCommand({
            TableName: this.tableName
        }))
    }
    async putItem(record: AliasEntity) {
        await dynamo.send(new PutCommand({
            TableName: this.tableName,
            Item: {
                aliasName: record.aliasName,
                originalName: record.originalName,
                originalId: record.originalId,
            }
        }));
    }


}