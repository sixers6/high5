import React from 'react';

interface ServerComponentProps {
  componentType: string;
  properties: Record<string, any>;
  children?: React.ReactNode;
}

/**
 * ServerComponent is a wrapper component that can be dynamically rendered
 * based on server-generated component definitions.
 * 
 * This component allows the server to define UI components that will be
 * rendered on the client side, enabling truly dynamic UI generation.
 */
const ServerComponent: React.FC<ServerComponentProps> = ({ 
  componentType, 
  properties, 
  children 
}) => {
  // Render different HTML elements based on componentType
  switch (componentType) {
    case 'div':
      return <div {...properties}>{children}</div>;
    case 'span':
      return <span {...properties}>{children}</span>;
    case 'p':
      return <p {...properties}>{children}</p>;
    case 'h1':
      return <h1 {...properties}>{children}</h1>;
    case 'h2':
      return <h2 {...properties}>{children}</h2>;
    case 'h3':
      return <h3 {...properties}>{children}</h3>;
    case 'button':
      return <button {...properties}>{children}</button>;
    case 'input':
      return <input {...properties} />;
    case 'textarea':
      return <textarea {...properties}>{children}</textarea>;
    case 'select':
      return <select {...properties}>{children}</select>;
    case 'option':
      return <option {...properties}>{children}</option>;
    case 'a':
      return <a {...properties}>{children}</a>;
    case 'img':
      return <img {...properties} />;
    case 'ul':
      return <ul {...properties}>{children}</ul>;
    case 'ol':
      return <ol {...properties}>{children}</ol>;
    case 'li':
      return <li {...properties}>{children}</li>;
    case 'table':
      return <table {...properties}>{children}</table>;
    case 'thead':
      return <thead {...properties}>{children}</thead>;
    case 'tbody':
      return <tbody {...properties}>{children}</tbody>;
    case 'tr':
      return <tr {...properties}>{children}</tr>;
    case 'th':
      return <th {...properties}>{children}</th>;
    case 'td':
      return <td {...properties}>{children}</td>;
    case 'form':
      return <form {...properties}>{children}</form>;
    case 'label':
      return <label {...properties}>{children}</label>;
    case 'fieldset':
      return <fieldset {...properties}>{children}</fieldset>;
    case 'legend':
      return <legend {...properties}>{children}</legend>;
    default:
      // For unknown component types, render a div with a warning
      return (
        <div data-unknown-component={componentType} style={{ color: 'red' }}>
          Unknown component type: {componentType}
          {children}
        </div>
      );
  }
};

export default ServerComponent;
