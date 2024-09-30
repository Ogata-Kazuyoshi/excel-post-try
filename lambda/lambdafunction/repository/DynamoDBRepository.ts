import {DeleteCommand, GetCommand, PutCommand, QueryCommand, ScanCommand, UpdateCommand} from "@aws-sdk/lib-dynamodb";
import {dynamo} from "../config/dynamodbConfig";
import {TableName} from "../model/TableInterface";
import {UpdateItemCommandOutput} from "@aws-sdk/client-dynamodb";

export interface DynamoDBRepository {
    scanParams<T>():Promise<T[]>
    deleteItemByPartitionKey(deleteRequestByPartitionKey: DesignatedForPartitionKey)
    putItem<T>(putList: T)
    updateOneColumnByPartitionKey(updateRequestByPartitionKey: UpdateOneColumnByPartitionKey): Promise<UpdateItemCommandOutput>
    updateMultiColumnByPartitionKey(updateMultiRequestByPartitionKey: UpdateMultiColumnByPartitionKey): Promise<UpdateItemCommandOutput>
    getItemByPartitionKey<T>(getItemByPartitionKey: DesignatedForPartitionKey): Promise<T | undefined>
    queryItemsByPartitionKey<T>(queryItemsByPartitionKey: DesignatedForPartitionKey): Promise<T[]>
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

    async deleteItemByPartitionKey(deleteRequestByPartitionKey: DesignatedForPartitionKey) {
        const {partitionKeyName, partitionKeyValue} = deleteRequestByPartitionKey
        const Key = {}
        Key[partitionKeyName] = partitionKeyValue
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

    async getItemByPartitionKey<T>(getItemByPartitionKey: DesignatedForPartitionKey): Promise<T | undefined> {
        const {partitionKeyName, partitionKeyValue} = getItemByPartitionKey
        const Key = {}
        Key[partitionKeyName] = partitionKeyValue
        const result = await dynamo.send(new GetCommand({
            TableName: this.tableName,
            Key
        }))
        return (result.Item )as T | undefined;
    }

    async queryItemsByPartitionKey<T>(queryItemsByPartitionKey: DesignatedForPartitionKey): Promise<T[]> {
        const {partitionKeyName, partitionKeyValue} = queryItemsByPartitionKey
        const KeyConditionExpression = `#${partitionKeyName} = :${partitionKeyName}`
        const ExpressionAttributeNames = {}
        const ExpressionAttributeValues= {}
        ExpressionAttributeNames[`#${partitionKeyName}`] = partitionKeyName
        ExpressionAttributeValues[`:${partitionKeyName}`] = partitionKeyValue
        const result = await dynamo.send(new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression,
            ExpressionAttributeNames,
            ExpressionAttributeValues
        }))
        return result.Items as T[]
    }

    async updateOneColumnByPartitionKey(updateRequestByPartitionKey: UpdateOneColumnByPartitionKey): Promise<UpdateItemCommandOutput> {
        const Key = {}
        Key[updateRequestByPartitionKey.partitionKeyName] = updateRequestByPartitionKey.partitionKeyValue
        const UpdateExpression = `SET ${updateRequestByPartitionKey.updateColumnKey} = :new${updateRequestByPartitionKey.updateColumnKey}Value`
        const ExpressionAttributeValues = {}
        ExpressionAttributeValues[`:new${updateRequestByPartitionKey.updateColumnKey}Value`] = updateRequestByPartitionKey.updateColumnValue

        return await dynamo.send(new UpdateCommand({
            TableName: this.tableName,
            Key,
            UpdateExpression,
            ExpressionAttributeValues,
            ReturnValues: 'UPDATED_NEW'
        }))
    }

    async updateMultiColumnByPartitionKey(updateMultiRequestByPartitionKey: UpdateMultiColumnByPartitionKey): Promise<UpdateItemCommandOutput> {
        const Key = {}
        Key[updateMultiRequestByPartitionKey.partitionKeyName] = updateMultiRequestByPartitionKey.partitionKeyValue

        const updateExpressions = updateMultiRequestByPartitionKey.updateColumns.map(
            (column) => `${column.updateColumnKey} = :${column.updateColumnKey}Value`
        )
        const UpdateExpression = `SET ${updateExpressions.join(', ')}`

        const ExpressionAttributeValues = {}
        updateMultiRequestByPartitionKey.updateColumns.forEach((column) => {
            ExpressionAttributeValues[`:${column.updateColumnKey}Value`] = column.updateColumnValue
        })

        return await dynamo.send(new UpdateCommand({
            TableName: this.tableName,
            Key,
            UpdateExpression,
            ExpressionAttributeValues,
            ReturnValues: 'UPDATED_NEW'
        }))
    }
}

export interface DesignatedForPartitionKey {
    partitionKeyName: string
    partitionKeyValue: string
}
export interface UpdateOneColumnByPartitionKey {
    partitionKeyName: string
    partitionKeyValue: string
    updateColumnKey: string
    updateColumnValue: string
}

export interface UpdateMultiColumnByPartitionKey {
    partitionKeyName: string
    partitionKeyValue: string
    updateColumns: ColumnDetail[]
}

export interface ColumnDetail {
    updateColumnKey: string
    updateColumnValue: string
}