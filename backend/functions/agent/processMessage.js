'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE + '-messages';

/**
 * Lambda function to process messages from the High5 frontend
 * This function implements the agentic logic to process user messages
 * and generate appropriate responses
 */
module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const { message, conversationId, userId } = data;
    
    if (!message || !conversationId) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Store the incoming message
    const timestamp = new Date().toISOString();
    const messageId = uuidv4();
    
    const userMessageParams = {
      TableName: tableName,
      Item: {
        id: messageId,
        conversationId,
        userId: userId || 'anonymous',
        content: message,
        sender: 'user',
        timestamp,
      },
    };
    
    await dynamoDb.put(userMessageParams).promise();
    
    // Process the message with agentic logic
    const response = await processMessageWithAgent(message, conversationId);
    
    // Store the agent's response
    const agentMessageId = uuidv4();
    const agentMessageParams = {
      TableName: tableName,
      Item: {
        id: agentMessageId,
        conversationId,
        userId: userId || 'anonymous',
        content: response.content,
        sender: 'agent',
        timestamp: new Date().toISOString(),
        metadata: response.metadata || {},
      },
    };
    
    await dynamoDb.put(agentMessageParams).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        messageId: agentMessageId,
        content: response.content,
        metadata: response.metadata || {},
        timestamp: agentMessageParams.Item.timestamp,
      }),
    };
  } catch (error) {
    console.error('Error processing message:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'Could not process message' }),
    };
  }
};

/**
 * Process the message using agentic logic
 * This is where the core AI/agent functionality would be implemented
 * For now, we're using a simple simulation
 */
async function processMessageWithAgent(message, conversationId) {
  // In a real implementation, this would connect to an LLM API or other AI service
  // For this demo, we'll simulate the agent's response
  
  // Get conversation history for context
  const historyParams = {
    TableName: tableName,
    IndexName: 'conversationIdIndex',
    KeyConditionExpression: 'conversationId = :conversationId',
    ExpressionAttributeValues: {
      ':conversationId': conversationId,
    },
    Limit: 10, // Get the last 10 messages for context
    ScanIndexForward: false, // Get the most recent messages first
  };
  
  const history = await dynamoDb.query(historyParams).promise();
  
  // Simple response logic based on the message content
  let content = '';
  let metadata = {};
  
  if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
    content = "Hello! I'm High5, your AI assistant. How can I help you today?";
  } else if (message.toLowerCase().includes('help')) {
    content = "I can help you with various tasks. Just let me know what you need!";
  } else if (message.toLowerCase().includes('ui') || message.toLowerCase().includes('interface')) {
    content = "I can generate UI components dynamically based on your needs. Would you like me to create something specific?";
    metadata = {
      suggestedAction: 'generateUI',
      parameters: {
        type: 'form',
        fields: ['name', 'email', 'message']
      }
    };
  } else {
    content = `I've processed your message: "${message}". In a full implementation, I would use an LLM or other AI service to generate a more contextual response.`;
  }
  
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  return {
    content,
    metadata
  };
}
