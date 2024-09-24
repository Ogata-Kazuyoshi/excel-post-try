import {GetCommand, NativeAttributeValue, PutCommand, ScanCommand, ScanCommandOutput} from "@aws-sdk/lib-dynamodb";
import {dynamo} from "../config/dynamodbConfig";
import {AliasEntity} from "../model/interface";

export interface AliasRepository {
    scanParams():Promise<(Omit<ScanCommandOutput, "Items" | "LastEvaluatedKey"> & {Items?: Record<string, NativeAttributeValue>[], LastEvaluatedKey?: Record<string, NativeAttributeValue>}) | ScanCommandOutput>
    putItem(record: AliasEntity)
    getItemByAliasName(aliasName: string): Promise<AliasEntity | undefined>
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
            }
        }));
    }

    async getItemByAliasName(aliasName: string): Promise<AliasEntity | undefined> {
        const result = await dynamo.send(new GetCommand({
            TableName: this.tableName,
            Key: {
                aliasName: aliasName
            }
        }));

        return result.Item as AliasEntity | undefined;
    }
}