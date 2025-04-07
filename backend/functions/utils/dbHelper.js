'use strict';

/**
 * This file contains utility functions for the High5 backend
 * It provides helper methods for working with DynamoDB and other AWS services
 */

const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

/**
 * Get conversation history from DynamoDB
 * @param {string} conversationId - The ID of the conversation
 * @param {number} limit - Maximum number of messages to retrieve
 * @returns {Promise<Array>} - Array of conversation messages
 */
const getConversationHistory = async (conversationId, limit = 10) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE + '-messages',
    IndexName: 'conversationIdIndex',
    KeyConditionExpression: 'conversationId = :conversationId',
    ExpressionAttributeValues: {
      ':conversationId': conversationId,
    },
    Limit: limit,
    ScanIndexForward: false, // Get the most recent messages first
  };
  
  try {
    const result = await dynamoDb.query(params).promise();
    return result.Items;
  } catch (error) {
    console.error('Error retrieving conversation history:', error);
    throw error;
  }
};

/**
 * Store a message in DynamoDB
 * @param {Object} message - The message object to store
 * @returns {Promise<Object>} - The stored message
 */
const storeMessage = async (message) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE + '-messages',
    Item: message,
  };
  
  try {
    await dynamoDb.put(params).promise();
    return message;
  } catch (error) {
    console.error('Error storing message:', error);
    throw error;
  }
};

/**
 * Store a UI component in DynamoDB
 * @param {Object} component - The UI component object to store
 * @returns {Promise<Object>} - The stored component
 */
const storeUIComponent = async (component) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE + '-ui-components',
    Item: component,
  };
  
  try {
    await dynamoDb.put(params).promise();
    return component;
  } catch (error) {
    console.error('Error storing UI component:', error);
    throw error;
  }
};

/**
 * Get UI components by type from DynamoDB
 * @param {string} type - The type of UI components to retrieve
 * @param {number} limit - Maximum number of components to retrieve
 * @returns {Promise<Array>} - Array of UI components
 */
const getUIComponentsByType = async (type, limit = 10) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE + '-ui-components',
    IndexName: 'typeIndex',
    KeyConditionExpression: 'type = :type',
    ExpressionAttributeValues: {
      ':type': type,
    },
    Limit: limit,
  };
  
  try {
    const result = await dynamoDb.query(params).promise();
    return result.Items;
  } catch (error) {
    console.error('Error retrieving UI components:', error);
    throw error;
  }
};

module.exports = {
  getConversationHistory,
  storeMessage,
  storeUIComponent,
  getUIComponentsByType,
};
