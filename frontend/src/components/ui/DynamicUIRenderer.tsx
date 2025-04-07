import React from 'react';
import Button from './Button';
import Input from './Input';
import Textarea from './Textarea';
import Card from './Card';
import ServerRenderedUI from './ServerRenderedUI';

interface DynamicUIRendererProps {
  components: any;
  onSubmit?: (data: any) => void;
}

const DynamicUIRenderer: React.FC<DynamicUIRendererProps> = ({ components, onSubmit }) => {
  const [formData, setFormData] = React.useState<Record<string, any>>({});

  const handleInputChange = (name: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleServerUIEvent = (eventType: string, data: any) => {
    if (eventType === 'submit' && onSubmit) {
      onSubmit(data.state || data);
    }
  };

  // If components is null or undefined, return nothing
  if (!components) {
    return null;
  }

  // Check if this is a server-rendered UI definition
  if (components.renderType === 'server-rendered') {
    return (
      <ServerRenderedUI 
        definition={components.definition} 
        onEvent={handleServerUIEvent} 
      />
    );
  }

  // Render based on component type
  switch (components.type) {
    case 'form':
      return (
        <div className="dynamic-form">
          <h3 className="text-lg font-medium mb-4">Dynamic Form</h3>
          <form onSubmit={handleSubmit}>
            {components.components.map((component: any, index: number) => {
              switch (component.type) {
                case 'input':
                  return (
                    <div key={index} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {component.label}
                        {component.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <Input
                        type="text"
                        placeholder={component.placeholder}
                        value={formData[component.name] || ''}
                        onChange={(e) => handleInputChange(component.name, e.target.value)}
                        required={component.required}
                      />
                    </div>
                  );
                case 'textarea':
                  return (
                    <div key={index} className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {component.label}
                        {component.required && <span className="text-red-500 ml-1">*</span>}
                      </label>
                      <Textarea
                        placeholder={component.placeholder}
                        value={formData[component.name] || ''}
                        onChange={(e) => handleInputChange(component.name, e.target.value)}
                        required={component.required}
                      />
                    </div>
                  );
                case 'button':
                  if (component.action === 'submit') {
                    return (
                      <div key={index} className="mt-6">
                        <Button type="submit" variant={component.variant || 'primary'}>
                          {component.label || 'Submit'}
                        </Button>
                      </div>
                    );
                  }
                  return null;
                default:
                  return null;
              }
            })}
          </form>
        </div>
      );

    case 'dashboard':
      return (
        <div className="dynamic-dashboard">
          <h3 className="text-lg font-medium mb-4">Dashboard</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {components.components.map((component: any, index: number) => {
              if (component.type === 'card') {
                return (
                  <Card key={index} className="h-full">
                    <h4 className="text-md font-medium mb-2">{component.title}</h4>
                    <p>{component.content}</p>
                  </Card>
                );
              }
              if (component.type === 'chart') {
                return (
                  <Card key={index} className="h-full">
                    <h4 className="text-md font-medium mb-2">{component.title}</h4>
                    <div className="h-40 bg-gray-100 flex items-center justify-center">
                      <p className="text-gray-500">Chart Visualization (Placeholder)</p>
                    </div>
                  </Card>
                );
              }
              return null;
            })}
          </div>
        </div>
      );

    case 'chart':
      return (
        <div className="dynamic-chart">
          <h3 className="text-lg font-medium mb-4">{components.title || 'Chart'}</h3>
          <div className="h-60 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">
              {components.chartType} Chart Visualization (Placeholder)
            </p>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Data</h4>
            <pre className="bg-gray-50 p-2 rounded text-xs overflow-auto">
              {JSON.stringify(components.data, null, 2)}
            </pre>
          </div>
        </div>
      );

    case 'table':
      return (
        <div className="dynamic-table">
          <h3 className="text-lg font-medium mb-4">Data Table</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {components.headers.map((header: string, index: number) => (
                    <th
                      key={index}
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {components.rows.map((row: string[], rowIndex: number) => (
                  <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                      <td
                        key={cellIndex}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                      >
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );

    default:
      return (
        <div className="p-4 border border-gray-200 rounded-lg">
          <p className="text-gray-500">
            Unknown component type: {components.type}
          </p>
        </div>
      );
  }
};

export default DynamicUIRenderer;
