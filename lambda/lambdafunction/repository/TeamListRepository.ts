import {
    DeleteCommand,
    NativeAttributeValue,
    PutCommand,
    QueryCommand,
    ScanCommand,
    ScanCommandOutput
} from "@aws-sdk/lib-dynamodb";
import {dynamo} from "../config/dynamodbConfig";
import {ExcelEntity, TeamListEntity} from "../model/interface";

export interface TeamListRepository {
    scanParams():Promise<(Omit<ScanCommandOutput, "Items" | "LastEvaluatedKey"> & {Items?: Record<string, NativeAttributeValue>[], LastEvaluatedKey?: Record<string, NativeAttributeValue>}) | ScanCommandOutput>
    deleteItem(id: string)
    putItem(putList: TeamListEntity)
    queryItemsByPrimaryKey(temaName: string): Promise<TeamListEntity[]> // 新しいメソッド

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

    async queryItemsByPrimaryKey(teamName: string): Promise<TeamListEntity[]> {
        const result = await dynamo.send(new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: "#teamName = :teamName",
            ExpressionAttributeNames: {
                "#teamName": "teamName"
            },
            ExpressionAttributeValues: {
                ":teamName": teamName
            }
        }))
        return result.Items as TeamListEntity[]
    }
}