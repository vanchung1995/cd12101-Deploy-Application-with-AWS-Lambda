import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { createLogger } from '../utils/logger.mjs'
import AWSXRay from 'aws-xray-sdk-core'

export class TodoRepository {

    constructor(todoTable=process.env.TODO_TABLE, todoIndex=process.env.USER_ID_INDEX) {
        this.logger = createLogger('todoRepository')

        this.todoTable = todoTable
        this.todoIndex = todoIndex

        // this.dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
        const dynamoDb = AWSXRay.captureAWSv3Client(new DynamoDB())
        this.dynamoDbClient = DynamoDBDocument.from(dynamoDb)
    }

    async getAll(userId) {
        this.logger.info('Get all todos!')
        const result = await this.dynamoDbClient.query({
            TableName: this.todoTable,
            IndexName: this.todoIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        })

        const items = result.Items
        return items
    }
    
    async get(todoId) {
        this.logger.info('Get todo with id: ' + todoId)
        const params = {
            TableName: this.todoTable,
            Key: {
                todoId: todoId
            }
        }
        const result = await this.dynamoDbClient.get(params)
        this.logger.info('result: '+JSON.stringify(result.Item))
        if (!result.Item) {
            throw new Error('No todo with id: ' + todoId);
        }
        return result.Item
    }
    
    async insert(todoEntity) {
        this.logger.info('Add new todo')

        return await this.dynamoDbClient.put({
            TableName: this.todoTable,
            Item: todoEntity
        })
    }
    
    async update(todoId, todoEntity) {
        this.logger.info('Update todo id: '+todoId)
        this.logger.info('todoEntity: '+JSON.stringify(todoEntity))

        const toDo = await this.get(todoId)
        const updateCommand = {
            TableName: this.todoTable,
            Key: {
                todoId: todoId
            },
            UpdateExpression: "set #nameAttr = :name, dueDate = :dueDate, done=:done, attachmentUrl=:attachmentUrl",
            ExpressionAttributeNames: {
                "#nameAttr": "name"
            },
            ExpressionAttributeValues: {
                ":name": todoEntity.name ?? toDo.name,
                ":dueDate": todoEntity.dueDate ?? toDo.dueDate,
                ":done": typeof todoEntity.done !== 'undefined' ? todoEntity.done : toDo.done,
                ":attachmentUrl": todoEntity.attachmentUrl ?? toDo.attachmentUrl ?? ''
            }
        };
        return await this.dynamoDbClient.update(updateCommand)
    }
    
    async remove(todoId) {
        this.logger.info('Delete todo id: '+todoId)
        await this.get(todoId)
        const deleteCommand = { 
            TableName: this.todoTable, 
            Key: {
                todoId: todoId
            } 
        }
        return await this.dynamoDbClient.delete(deleteCommand)
    }
}
