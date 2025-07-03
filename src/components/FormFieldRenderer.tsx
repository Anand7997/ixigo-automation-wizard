
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FormField, SelectField, InputField, TestData } from '@/types/testData';

interface FormFieldRendererProps {
  field: FormField;
  formData: TestData;
  onInputChange: (field: keyof TestData, value: string | number) => void;
}

const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({ field, formData, onInputChange }) => {
  return (
    <div key={field.key} className="space-y-2">
      <Label htmlFor={field.key} className="flex items-center text-sm font-medium">
        <field.icon className="w-4 h-4 mr-2 text-gray-500" />
        {field.label}
      </Label>
      
      {field.type === 'select' ? (
        <Select 
          value={formData[field.key as keyof TestData]?.toString() || ''} 
          onValueChange={(value) => onInputChange(field.key as keyof TestData, value)}
        >
          <SelectTrigger>
            <SelectValue placeholder={`Select ${field.label.toLowerCase()}`} />
          </SelectTrigger>
          <SelectContent>
            {(field as SelectField).options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          id={field.key}
          type={field.type}
          placeholder={(field as InputField).placeholder}
          value={formData[field.key as keyof TestData] || ''}
          onChange={(e) => onInputChange(
            field.key as keyof TestData, 
            field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
          )}
          className="w-full"
          min={field.type === 'number' ? 0 : undefined}
          max={field.type === 'number' ? 10 : undefined}
        />
      )}
      
      {field.description && (
        <p className="text-xs text-gray-500">{field.description}</p>
      )}
      
      {(field.key === 'source' || field.key === 'destination') && (
        <div className="text-xs text-gray-500">
          <span className="font-medium">Popular destinations:</span>
          <div className="flex flex-wrap gap-1 mt-1">
            {['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'].map((city, index, arr) => (
              <button
                key={city}
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => onInputChange(field.key as keyof TestData, city)}
              >
                {city}{index < arr.length - 1 ? ',' : ''}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FormFieldRenderer;
