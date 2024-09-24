import {
    DeleteCommand,
    GetCommand,
    NativeAttributeValue,
    PutCommand,
    ScanCommand,
    ScanCommandOutput
} from "@aws-sdk/lib-dynamodb";
import {dynamo} from "../config/dynamodbConfig";
import {ExcelEntity} from "../model/interface";

export interface ApprovalListRepository {
    scanParams():Promise<(Omit<ScanCommandOutput, "Items" | "LastEvaluatedKey"> & {Items?: Record<string, NativeAttributeValue>[], LastEvaluatedKey?: Record<string, NativeAttributeValue>}) | ScanCommandOutput>
    deleteItem(id: string)
    putItem(putList: ExcelEntity)
    getItemByLicenseName(licenseName: string): Promise<ExcelEntity | undefined>

}

export class DefaultApprovalListRepository implements ApprovalListRepository {

    tableName: string = 'approval-list'

    async scanParams(): Promise<(Omit<ScanCommandOutput, "Items" | "LastEvaluatedKey"> & {
        Items?: Record<string, NativeAttributeValue>[];
        LastEvaluatedKey?: Record<string, NativeAttributeValue>
    }) | ScanCommandOutput> {
        return await dynamo.send(new ScanCommand({
            TableName: this.tableName
        }))
    }

    async deleteItem(licenseName: string) {
        await dynamo.send(new DeleteCommand({
            TableName: this.tableName,
            Key: {
                licenseName: licenseName
            }
        }))
    }

    async putItem(putList: ExcelEntity) {
        await dynamo.send(new PutCommand({
            TableName: this.tableName,
            Item: putList
        }))
    }

    async getItemByLicenseName(licenseName: string): Promise<ExcelEntity | undefined> {
        const result = await dynamo.send(new GetCommand({
            TableName: this.tableName,
            Key: {
                licenseName: licenseName
            }
        }));
        return result.Item as ExcelEntity | undefined;
    }
}