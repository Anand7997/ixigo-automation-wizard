
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';
import { BookingMode, TestData } from '@/types/testData';
import { getFieldsForMode } from '@/utils/testFormFields';
import TestExecutionSettings from './TestExecutionSettings';
import FormFieldRenderer from './FormFieldRenderer';

interface TestDataFormProps {
  mode: BookingMode;
  onSubmit: (data: TestData) => void;
  onBack: () => void;
}

const TestDataForm: React.FC<TestDataFormProps> = ({ mode, onSubmit, onBack }) => {
  const [formData, setFormData] = useState<TestData>({
    testCaseId: `${mode.toUpperCase().substring(0, 2)}-001`,
    browserType: 'chrome',
    testType: 'functional'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof TestData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Test Configuration Header */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-lg flex items-center">
            <Database className="w-5 h-5 mr-2 text-blue-600" />
            Excel-Based Test Configuration
          </CardTitle>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">TC_ID: {formData.testCaseId}</Badge>
            <Badge variant="outline">Mode: {mode.toUpperCase()}</Badge>
            <Badge variant="outline">XPath: Database Driven</Badge>
          </div>
        </CardHeader>
      </Card>

      {/* Dynamic Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getFieldsForMode(mode).map((field) => (
          <FormFieldRenderer
            key={field.key}
            field={field}
            formData={formData}
            onInputChange={handleInputChange}
          />
        ))}
      </div>

      {/* Test Execution Configuration */}
      <TestExecutionSettings 
        formData={formData}
        onInputChange={handleInputChange}
      />

      <div className="flex space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back to Mode Selection
        </Button>
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          Execute Test with Database XPath
        </Button>
      </div>
    </form>
  );
};

export default TestDataForm;
