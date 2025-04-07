'use strict';

const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const uiGenerator = require('../utils/uiGenerator');

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const tableName = process.env.DYNAMODB_TABLE + '-ui-components';

/**
 * Lambda function to dynamically generate UI components
 * This function implements the logic to create interactive UI elements
 * based on the request from the frontend or agent
 */
module.exports.handler = async (event) => {
  try {
    const data = JSON.parse(event.body);
    const { type, parameters, userId } = data;
    
    if (!type) {
      return {
        statusCode: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // Generate UI components based on the request
    const uiComponents = await generateUIComponents(type, parameters);
    
    // Store the generated UI components for future reference
    const componentId = uuidv4();
    const timestamp = new Date().toISOString();
    
    const componentParams = {
      TableName: tableName,
      Item: {
        id: componentId,
        type,
        userId: userId || 'anonymous',
        parameters,
        components: uiComponents,
        timestamp,
      },
    };
    
    await dynamoDb.put(componentParams).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({
        componentId,
        type,
        components: uiComponents,
        timestamp,
      }),
    };
  } catch (error) {
    console.error('Error generating UI components:', error);
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ error: 'Could not generate UI components' }),
    };
  }
};

/**
 * Generate UI components based on the requested type and parameters
 * This function dynamically creates UI components that can be rendered on the frontend
 */
async function generateUIComponents(type, parameters = {}) {
  // Use the enhanced UI generator utilities
  switch (type) {
    case 'form':
      // Use server-rendered form for enhanced capabilities
      return uiGenerator.createServerRenderedForm(
        parameters.fields || ['name', 'email', 'message'],
        {
          title: parameters.title || 'Dynamic Form',
          submitLabel: parameters.submitLabel || 'Submit'
        }
      );
    
    case 'dashboard':
      // Use server-rendered dashboard for enhanced capabilities
      return uiGenerator.createServerRenderedDashboard(
        parameters.cards || [
          {
            title: 'Summary',
            content: 'This is a dynamically generated dashboard card.'
          },
          {
            type: 'chart',
            chartType: 'bar',
            title: 'Data Visualization',
            data: {
              labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
              datasets: [
                {
                  label: 'Sample Data',
                  data: [12, 19, 3, 5, 2],
                },
              ],
            }
          }
        ],
        {
          title: parameters.title || 'Dashboard'
        }
      );
    
    case 'chart':
      return uiGenerator.createServerRenderedUI({
        type: 'div',
        props: {
          className: 'dynamic-chart',
        },
        children: [
          {
            type: 'h3',
            props: {
              className: 'text-lg font-medium mb-4',
            },
            children: parameters.title || 'Chart'
          },
          {
            type: 'div',
            props: {
              className: 'h-60 bg-gray-100 rounded-lg flex items-center justify-center',
            },
            children: {
              type: 'p',
              props: {
                className: 'text-gray-500',
              },
              children: `${parameters.chartType || 'Bar'} Chart Visualization (Placeholder)`
            }
          },
          {
            type: 'div',
            props: {
              className: 'mt-4',
            },
            children: [
              {
                type: 'h4',
                props: {
                  className: 'text-sm font-medium mb-2',
                },
                children: 'Data'
              },
              {
                type: 'pre',
                props: {
                  className: 'bg-gray-50 p-2 rounded text-xs overflow-auto',
                },
                children: JSON.stringify(parameters.data || {
                  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
                  datasets: [
                    {
                      label: 'Sample Data',
                      data: [12, 19, 3, 5, 2],
                    },
                  ],
                }, null, 2)
              }
            ]
          }
        ]
      });
    
    case 'table':
      const headers = parameters.headers || ['Name', 'Email', 'Role'];
      const rows = parameters.rows || [
        ['John Doe', 'john@example.com', 'Admin'],
        ['Jane Smith', 'jane@example.com', 'User'],
      ];
      
      // Create table header cells
      const headerCells = headers.map(header => ({
        type: 'th',
        props: {
          scope: 'col',
          className: 'px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider',
        },
        children: header
      }));
      
      // Create table rows
      const tableRows = rows.map(row => {
        const cells = row.map(cell => ({
          type: 'td',
          props: {
            className: 'px-6 py-4 whitespace-nowrap text-sm text-gray-500',
          },
          children: cell
        }));
        
        return {
          type: 'tr',
          props: {},
          children: cells
        };
      });
      
      return uiGenerator.createServerRenderedUI({
        type: 'div',
        props: {
          className: 'dynamic-table',
        },
        children: [
          {
            type: 'h3',
            props: {
              className: 'text-lg font-medium mb-4',
            },
            children: parameters.title || 'Data Table'
          },
          {
            type: 'div',
            props: {
              className: 'overflow-x-auto',
            },
            children: {
              type: 'table',
              props: {
                className: 'min-w-full divide-y divide-gray-200',
              },
              children: [
                {
                  type: 'thead',
                  props: {
                    className: 'bg-gray-50',
                  },
                  children: {
                    type: 'tr',
                    props: {},
                    children: headerCells
                  }
                },
                {
                  type: 'tbody',
                  props: {
                    className: 'bg-white divide-y divide-gray-200',
                  },
                  children: tableRows
                }
              ]
            }
          }
        ]
      });
    
    default:
      return uiGenerator.createServerRenderedUI({
        type: 'div',
        props: {
          className: 'p-4 border border-gray-200 rounded-lg',
        },
        children: {
          type: 'p',
          props: {
            className: 'text-gray-500',
          },
          children: `I don't know how to generate UI components of type "${type}" yet.`
        }
      });
  }
}
