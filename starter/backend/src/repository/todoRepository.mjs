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
              id: todoId
            }
        }
        // const result = await this.dynamoDbClient.query({
        //     TableName: this.todoTable,
        //     IndexName: this.todoIndex,
        //     KeyConditionExpression: 'todoId = :todoId',
        //     ExpressionAttributeValues: {
        //         ':todoId': todoId
        //     }
        // })
        const result = await this.dynamoDbClient.get(params)
        if (result.Count === 0) {
            throw new Error('No todo with id: ' + todoId)
        }
        return result
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
        const toDo = await get(todoId)
        const updateCommand = {
            TableName: this.todoTable,
            Key: {
                "id": todoId
            },
            UpdateExpression: "set name = :name, dueDate = :dueDate, done=:done",
            ExpressionAttributeValues: {
                "name": todoEntity.name | toDo.name,
                ":dueDate": todoEntity.dueDate | toDo.dueDate,
                ":done": todoEntity.done | toDo.done
            }
        };
        return await this.dynamoDbClient.update(updateCommand)
    }
    
    async remove(todoId) {
        this.logger.info('Delete todo id: '+todoId)
        const deleteCommand = { 
            TableName: this.todoTable, 
            Key: {
                id: todoId
            } 
        }
        return await this.dynamoDbClient.delete(deleteCommand)
    }
}
