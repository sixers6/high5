import React from 'react';
import ServerComponent from './ServerComponent';

interface ServerRenderedUIProps {
  definition: any;
  onEvent?: (eventType: string, data: any) => void;
}

/**
 * ServerRenderedUI is a component that renders a complete UI tree
 * based on a server-generated definition.
 * 
 * This component recursively processes the definition and renders
 * the appropriate components, handling events and state.
 */
const ServerRenderedUI: React.FC<ServerRenderedUIProps> = ({ 
  definition, 
  onEvent 
}) => {
  const [localState, setLocalState] = React.useState<Record<string, any>>({});

  // Process the component definition and render it
  const renderComponent = (def: any): React.ReactNode => {
    if (!def) return null;

    // Handle text nodes
    if (typeof def === 'string') {
      return def;
    }

    // Handle arrays of components
    if (Array.isArray(def)) {
      return def.map((item, index) => (
        <React.Fragment key={index}>
          {renderComponent(item)}
        </React.Fragment>
      ));
    }

    // Extract component properties
    const { 
      type, 
      props = {}, 
      children, 
      events = {},
      stateBindings = {} 
    } = def;

    // Process properties, applying state bindings
    const processedProps = { ...props };
    
    // Apply state bindings to props
    Object.entries(stateBindings).forEach(([propName, statePath]) => {
      if (typeof statePath === 'string') {
        // Simple state binding
        processedProps[propName] = localState[statePath];
      }
    });

    // Process events
    const processedEvents: Record<string, any> = {};
    
    Object.entries(events).forEach(([eventName, eventHandler]) => {
      if (typeof eventHandler === 'object') {
        const { action, stateUpdates, data, emitEvent } = eventHandler as any;
        
        processedEvents[eventName] = (e: any) => {
          // Prevent default for form submissions
          if (eventName === 'onSubmit') {
            e.preventDefault();
          }
          
          // Update local state if needed
          if (stateUpdates) {
            setLocalState(prev => ({
              ...prev,
              ...stateUpdates
            }));
          }
          
          // Emit event to parent if needed
          if (emitEvent && onEvent) {
            onEvent(emitEvent, {
              ...data,
              event: e,
              state: localState
            });
          }
        };
      }
    });

    // Combine processed props and events
    const finalProps = {
      ...processedProps,
      ...processedEvents
    };

    // Render the component with its children
    return (
      <ServerComponent
        componentType={type}
        properties={finalProps}
      >
        {children && renderComponent(children)}
      </ServerComponent>
    );
  };

  return <>{renderComponent(definition)}</>;
};

export default ServerRenderedUI;
