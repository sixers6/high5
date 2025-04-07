import { v4 as uuidv4 } from 'uuid';

// In a real application, these would be environment variables
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.example.com';

/**
 * API service for communicating with the High5 backend
 */
class ApiService {
  /**
   * Send a message to the agent backend
   * @param {string} message - The message content
   * @param {string} conversationId - The conversation ID
   * @param {string} userId - The user ID (optional)
   * @returns {Promise<Object>} - The agent's response
   */
  static async sendMessage(message, conversationId, userId = 'anonymous') {
    try {
      // In development/demo mode, simulate API response
      if (process.env.NODE_ENV === 'development' || !API_BASE_URL.includes('api.example.com')) {
        return this.simulateMessageResponse(message, conversationId);
      }

      const response = await fetch(`${API_BASE_URL}/agent/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          conversationId,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  /**
   * Generate UI components
   * @param {string} type - The type of UI to generate
   * @param {Object} parameters - Parameters for UI generation
   * @param {string} userId - The user ID (optional)
   * @returns {Promise<Object>} - The generated UI components
   */
  static async generateUI(type, parameters, userId = 'anonymous') {
    try {
      // In development/demo mode, simulate API response
      if (process.env.NODE_ENV === 'development' || !API_BASE_URL.includes('api.example.com')) {
        return this.simulateUIGeneration(type, parameters);
      }

      const response = await fetch(`${API_BASE_URL}/ui/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          parameters,
          userId,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error generating UI:', error);
      throw error;
    }
  }

  /**
   * Simulate a message response for development/demo purposes
   * @private
   */
  static simulateMessageResponse(message, conversationId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let content = '';
        let metadata = {};

        if (message.toLowerCase().includes('hello') || message.toLowerCase().includes('hi')) {
          content = "Hello! I'm High5, your AI assistant. How can I help you today?";
        } else if (message.toLowerCase().includes('help')) {
          content = "I can help you with various tasks. Just let me know what you need!";
        } else if (message.toLowerCase().includes('ui') || message.toLowerCase().includes('interface')) {
          content = "I can generate UI components dynamically based on your needs. Would you like me to create a form, dashboard, chart, or table?";
          metadata = {
            suggestedAction: 'generateUI',
            parameters: {
              type: 'form',
              fields: ['name', 'email', 'message']
            }
          };
        } else if (message.toLowerCase().includes('form')) {
          content = "I'll create a form for you. What fields would you like to include?";
          metadata = {
            suggestedAction: 'generateUI',
            parameters: {
              type: 'form',
              fields: ['name', 'email', 'message']
            }
          };
        } else if (message.toLowerCase().includes('dashboard')) {
          content = "I'll generate a dashboard for you with some sample data.";
          metadata = {
            suggestedAction: 'generateUI',
            parameters: {
              type: 'dashboard'
            }
          };
        } else if (message.toLowerCase().includes('chart')) {
          content = "I'll create a chart visualization for you.";
          metadata = {
            suggestedAction: 'generateUI',
            parameters: {
              type: 'chart',
              chartType: 'bar'
            }
          };
        } else if (message.toLowerCase().includes('table')) {
          content = "I'll generate a data table for you.";
          metadata = {
            suggestedAction: 'generateUI',
            parameters: {
              type: 'table'
            }
          };
        } else {
          content = `I've processed your message: "${message}". In a full implementation, I would use an LLM or other AI service to generate a more contextual response.`;
        }

        resolve({
          messageId: uuidv4(),
          content,
          metadata,
          timestamp: new Date().toISOString(),
        });
      }, 1000);
    });
  }

  /**
   * Simulate UI generation for development/demo purposes
   * @private
   */
  static simulateUIGeneration(type, parameters) {
    return new Promise((resolve) => {
      setTimeout(() => {
        let components = {};

        switch (type) {
          case 'form':
            components = this.generateFormComponents(parameters.fields || ['name', 'email', 'message']);
            break;
          case 'dashboard':
            components = this.generateDashboardComponents(parameters);
            break;
          case 'chart':
            components = this.generateChartComponents(parameters);
            break;
          case 'table':
            components = this.generateTableComponents(parameters);
            break;
          default:
            components = {
              type: 'message',
              content: `I don't know how to generate UI components of type "${type}" yet.`,
            };
        }

        resolve({
          componentId: uuidv4(),
          type,
          components,
          timestamp: new Date().toISOString(),
        });
      }, 800);
    });
  }

  /**
   * Generate form components for simulation
   * @private
   */
  static generateFormComponents(fields) {
    const components = [];
    
    fields.forEach(field => {
      let component = {};
      
      if (typeof field === 'string') {
        // Simple field name
        component = {
          type: 'input',
          name: field,
          label: field.charAt(0).toUpperCase() + field.slice(1),
          placeholder: `Enter your ${field}`,
        };
      } else {
        // Field with custom properties
        component = {
          type: field.type || 'input',
          name: field.name,
          label: field.label || field.name.charAt(0).toUpperCase() + field.name.slice(1),
          placeholder: field.placeholder || `Enter your ${field.name}`,
          required: field.required || false,
          options: field.options || [],
        };
      }
      
      components.push(component);
    });
    
    // Add submit button
    components.push({
      type: 'button',
      label: 'Submit',
      action: 'submit',
      variant: 'primary',
    });
    
    return {
      type: 'form',
      components,
    };
  }

  /**
   * Generate dashboard components for simulation
   * @private
   */
  static generateDashboardComponents(parameters) {
    return {
      type: 'dashboard',
      components: [
        {
          type: 'card',
          title: 'Summary',
          content: 'This is a dynamically generated dashboard card.',
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
          },
        },
      ],
    };
  }

  /**
   * Generate chart components for simulation
   * @private
   */
  static generateChartComponents(parameters) {
    return {
      type: 'chart',
      chartType: parameters.chartType || 'bar',
      title: parameters.title || 'Data Visualization',
      data: parameters.data || {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Sample Data',
            data: [12, 19, 3, 5, 2],
          },
        ],
      },
    };
  }

  /**
   * Generate table components for simulation
   * @private
   */
  static generateTableComponents(parameters) {
    return {
      type: 'table',
      headers: parameters.headers || ['Name', 'Email', 'Role'],
      rows: parameters.rows || [
        ['John Doe', 'john@example.com', 'Admin'],
        ['Jane Smith', 'jane@example.com', 'User'],
      ],
    };
  }
}

export default ApiService;
