import { DynamoDB } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { createLogger } from '../utils/logger.mjs'

export class TodoRepository {

    constructor(todoTable=process.env.TODO_TABLE, todoIndex=process.env.TODO_INDEX) {
        this.logger = createLogger('todoRepository')

        this.todoTable = todoTable
        this.todoIndex = todoIndex

        this.dynamoDbClient = DynamoDBDocument.from(new DynamoDB())
    }

    async getAll() {
        this.logger.info('Get all todos!')
        const scanCommand = {
            TableName: this.todoTable
        }
        const result = await this.dynamoDbClient.scan(scanCommand)
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
                ":name": todoEntity.name || toDo.name,
                ":dueDate": todoEntity.dueDate || toDo.dueDate,
                ":done": todoEntity.done || toDo.done,
                ":attachmentUrl": todoEntity.attachmentUrl || toDo.attachmentUrl || ''
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
