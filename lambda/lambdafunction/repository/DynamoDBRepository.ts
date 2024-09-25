import {DeleteCommand, GetCommand, PutCommand, QueryCommand, ScanCommand} from "@aws-sdk/lib-dynamodb";
import {dynamo} from "../config/dynamodbConfig";
import {TableName} from "../model/TableInterface";

export interface DynamoDBRepository {
    scanParams<T>():Promise<T[]>
    deleteItemByPrimaryKey(deleteRequestByPrimaryKey: DesignatedForPrimaryKey)
    putItem<T>(putList: T)
    getItemByPrimaryKey<T>(getItemByPrimaryKey: DesignatedForPrimaryKey): Promise<T | undefined>
    queryItemsByPrimaryKey<T>(queryItemsByPrimaryKey: DesignatedForPrimaryKey): Promise<T[]> // 新しいメソッド
}

export class DefaultDynamoDBRepository implements DynamoDBRepository{
    constructor(
        private tableName:TableName
    ) {}
    async scanParams<T>(): Promise<T[]> {
        const result = await dynamo.send(new ScanCommand({
            TableName: this.tableName
        }))
        return result.Items as T[]
    }

    async deleteItemByPrimaryKey(deleteRequestByPrimaryKey: DesignatedForPrimaryKey) {
        const {primaryKeyName, primaryKeyValue} = deleteRequestByPrimaryKey
        const Key = {}
        Key[primaryKeyName] = primaryKeyValue
        await dynamo.send(new DeleteCommand({
            TableName: this.tableName,
            Key
        }))
    }

    async putItem<T>(putList: T) {
        await dynamo.send(new PutCommand({
            TableName: this.tableName,
            Item: putList
        }))
    }

    async getItemByPrimaryKey<T>(getItemByPrimaryKey: DesignatedForPrimaryKey): Promise<T | undefined> {
        const {primaryKeyName, primaryKeyValue} = getItemByPrimaryKey
        const Key = {}
        Key[primaryKeyName] = primaryKeyValue
        const result = await dynamo.send(new GetCommand({
            TableName: this.tableName,
            Key
        }))
        return (result.Item )as T | undefined;
    }

    async queryItemsByPrimaryKey<T>(queryItemsByPrimaryKey: DesignatedForPrimaryKey): Promise<T[]> {
        const {primaryKeyName, primaryKeyValue} = queryItemsByPrimaryKey
        const KeyConditionExpression = `#${primaryKeyName} = :${primaryKeyName}`
        const ExpressionAttributeNames = {}
        const ExpressionAttributeValues= {}
        ExpressionAttributeNames[`#${primaryKeyName}`] = primaryKeyName
        ExpressionAttributeValues[`:${primaryKeyName}`] = primaryKeyValue
        const result = await dynamo.send(new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        }))
        return result.Items as T[]
    }
}

export interface DesignatedForPrimaryKey {
    primaryKeyName: string
    primaryKeyValue: string
}