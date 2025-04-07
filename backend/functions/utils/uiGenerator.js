'use strict';

/**
 * This file contains utility functions for generating dynamic UI components
 * It provides helper methods for creating UI definitions that can be rendered on the client
 */

/**
 * Create a form UI definition with the specified fields
 * @param {Array} fields - Array of field definitions or field names
 * @param {Object} options - Additional form options
 * @returns {Object} - Form UI definition
 */
const createFormUI = (fields, options = {}) => {
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
    label: options.submitLabel || 'Submit',
    action: 'submit',
    variant: 'primary',
  });
  
  return {
    type: 'form',
    components,
  };
};

/**
 * Create a server-rendered UI definition
 * This allows for more complex UI components with full control over the rendering
 * @param {Object} definition - The UI definition object
 * @returns {Object} - Server-rendered UI definition
 */
const createServerRenderedUI = (definition) => {
  return {
    renderType: 'server-rendered',
    definition,
  };
};

/**
 * Create a form using the server-rendered approach
 * This provides more flexibility than the standard form components
 * @param {Array} fields - Array of field definitions
 * @param {Object} options - Additional form options
 * @returns {Object} - Server-rendered form definition
 */
const createServerRenderedForm = (fields, options = {}) => {
  const formChildren = [];
  
  // Add form fields
  fields.forEach(field => {
    const fieldId = `field-${field.name || field}`;
    const fieldName = field.name || field;
    const fieldLabel = field.label || (typeof field === 'string' 
      ? field.charAt(0).toUpperCase() + field.slice(1)
      : fieldName.charAt(0).toUpperCase() + fieldName.slice(1));
    const fieldRequired = field.required || false;
    
    // Create label
    formChildren.push({
      type: 'label',
      props: {
        htmlFor: fieldId,
        className: 'block text-sm font-medium text-gray-700 mb-1',
      },
      children: [
        fieldLabel,
        fieldRequired ? {
          type: 'span',
          props: {
            className: 'text-red-500 ml-1',
          },
          children: '*'
        } : null
      ].filter(Boolean)
    });
    
    // Create input field
    const fieldType = field.type || 'text';
    if (fieldType === 'textarea') {
      formChildren.push({
        type: 'textarea',
        props: {
          id: fieldId,
          name: fieldName,
          placeholder: field.placeholder || `Enter your ${fieldName}`,
          required: fieldRequired,
          className: 'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100 resize-y',
          rows: field.rows || 4,
        },
        events: {
          onChange: {
            action: 'updateState',
            stateUpdates: {
              [fieldName]: '{{event.target.value}}'
            }
          }
        },
        stateBindings: {
          value: fieldName
        }
      });
    } else if (fieldType === 'select') {
      const options = field.options || [];
      const optionElements = options.map(option => {
        const value = typeof option === 'string' ? option : option.value;
        const label = typeof option === 'string' ? option : option.label || option.value;
        
        return {
          type: 'option',
          props: {
            value
          },
          children: label
        };
      });
      
      formChildren.push({
        type: 'select',
        props: {
          id: fieldId,
          name: fieldName,
          required: fieldRequired,
          className: 'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100',
        },
        children: optionElements,
        events: {
          onChange: {
            action: 'updateState',
            stateUpdates: {
              [fieldName]: '{{event.target.value}}'
            }
          }
        },
        stateBindings: {
          value: fieldName
        }
      });
    } else {
      formChildren.push({
        type: 'input',
        props: {
          id: fieldId,
          type: fieldType,
          name: fieldName,
          placeholder: field.placeholder || `Enter your ${fieldName}`,
          required: fieldRequired,
          className: 'w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:bg-gray-100',
        },
        events: {
          onChange: {
            action: 'updateState',
            stateUpdates: {
              [fieldName]: '{{event.target.value}}'
            }
          }
        },
        stateBindings: {
          value: fieldName
        }
      });
    }
    
    // Add spacing
    formChildren.push({
      type: 'div',
      props: {
        className: 'mb-4'
      }
    });
  });
  
  // Add submit button
  formChildren.push({
    type: 'button',
    props: {
      type: 'submit',
      className: 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 bg-blue-600 text-white hover:bg-blue-700 h-10 px-4 py-2',
    },
    children: options.submitLabel || 'Submit',
    events: {
      onClick: {
        action: 'submit',
        emitEvent: 'submit',
        data: {}
      }
    }
  });
  
  // Create the form definition
  const formDefinition = {
    type: 'form',
    props: {
      className: 'space-y-4',
    },
    events: {
      onSubmit: {
        action: 'preventDefault'
      }
    },
    children: formChildren
  };
  
  // Wrap in a container
  const containerDefinition = {
    type: 'div',
    props: {
      className: 'dynamic-form bg-white p-6 rounded-lg border border-gray-200',
    },
    children: [
      {
        type: 'h3',
        props: {
          className: 'text-lg font-medium mb-4',
        },
        children: options.title || 'Dynamic Form'
      },
      formDefinition
    ]
  };
  
  return createServerRenderedUI(containerDefinition);
};

/**
 * Create a dashboard UI definition
 * @param {Array} cards - Array of card definitions
 * @param {Object} options - Additional dashboard options
 * @returns {Object} - Dashboard UI definition
 */
const createDashboardUI = (cards, options = {}) => {
  const components = cards.map(card => {
    if (card.type === 'chart') {
      return {
        type: 'chart',
        chartType: card.chartType || 'bar',
        title: card.title,
        data: card.data,
      };
    }
    
    return {
      type: 'card',
      title: card.title,
      content: card.content,
    };
  });
  
  return {
    type: 'dashboard',
    components,
  };
};

/**
 * Create a server-rendered dashboard UI definition
 * @param {Array} cards - Array of card definitions
 * @param {Object} options - Additional dashboard options
 * @returns {Object} - Server-rendered dashboard definition
 */
const createServerRenderedDashboard = (cards, options = {}) => {
  const cardElements = cards.map(card => {
    let cardContent;
    
    if (card.type === 'chart') {
      cardContent = [
        {
          type: 'h4',
          props: {
            className: 'text-md font-medium mb-2',
          },
          children: card.title
        },
        {
          type: 'div',
          props: {
            className: 'h-40 bg-gray-100 flex items-center justify-center',
          },
          children: {
            type: 'p',
            props: {
              className: 'text-gray-500',
            },
            children: `${card.chartType || 'Bar'} Chart Visualization (Placeholder)`
          }
        }
      ];
    } else {
      cardContent = [
        {
          type: 'h4',
          props: {
            className: 'text-md font-medium mb-2',
          },
          children: card.title
        },
        {
          type: 'p',
          props: {},
          children: card.content
        }
      ];
    }
    
    return {
      type: 'div',
      props: {
        className: 'bg-white rounded-lg border border-gray-200 shadow-sm p-6 h-full',
      },
      children: cardContent
    };
  });
  
  // Create the dashboard definition
  const dashboardDefinition = {
    type: 'div',
    props: {
      className: 'dynamic-dashboard',
    },
    children: [
      {
        type: 'h3',
        props: {
          className: 'text-lg font-medium mb-4',
        },
        children: options.title || 'Dashboard'
      },
      {
        type: 'div',
        props: {
          className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
        },
        children: cardElements
      }
    ]
  };
  
  return createServerRenderedUI(dashboardDefinition);
};

module.exports = {
  createFormUI,
  createDashboardUI,
  createServerRenderedUI,
  createServerRenderedForm,
  createServerRenderedDashboard,
};
