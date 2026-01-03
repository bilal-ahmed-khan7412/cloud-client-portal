import json
import boto3
import uuid
from decimal import Decimal

# Helper class to convert DynamoDB Decimal types to JSON
class DecimalEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('Clients')

def lambda_handler(event, context):
    print("Event:", event)
    
    http_method = event.get('httpMethod')
    path = event.get('path')
    
    headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,DELETE'
    }
    
    try:
        if http_method == 'OPTIONS':
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps({'message': 'CORS OK'})
            }

        if http_method == 'GET':
            # List all clients
            response = table.scan()
            items = response.get('Items', [])
            return {
                'statusCode': 200,
                'headers': headers,
                'body': json.dumps(items, cls=DecimalEncoder)
            }
            
        elif http_method == 'POST':
            # Add new client
            body = json.loads(event.get('body', '{}'))
            client_id = str(uuid.uuid4())
            item = {
                'clientId': client_id,
                'name': body.get('name'),
                'email': body.get('email'),
                'phone': body.get('phone', ''),
                'company': body.get('company', ''),
                'status': 'Active'
            }
            table.put_item(Item=item)
            return {
                'statusCode': 201,
                'headers': headers,
                'body': json.dumps(item)
            }
            
        elif http_method == 'DELETE':
            # Delete client (Expect /clients/{id})
            # Naive parsing for now, assuming ID is passed in pathParameters
            path_params = event.get('pathParameters')
            if path_params and 'id' in path_params:
                client_id = path_params['id']
                table.delete_item(Key={'clientId': client_id})
                return {
                    'statusCode': 200,
                    'headers': headers,
                    'body': json.dumps({'message': 'Client deleted'})
                }
            
        return {
            'statusCode': 400,
            'headers': headers,
            'body': json.dumps({'message': 'Unsupported method'})
        }
        
    except Exception as e:
        print(e)
        return {
            'statusCode': 500,
            'headers': headers,
            'body': json.dumps({'error': str(e)})
        }
