
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Database } from 'lucide-react';
import { TestData } from '@/types/testData';

interface TestExecutionSettingsProps {
  formData: TestData;
  onInputChange: (field: keyof TestData, value: string | number) => void;
}

const TestExecutionSettings: React.FC<TestExecutionSettingsProps> = ({ formData, onInputChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Test Execution Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="testType">Test Type</Label>
            <Select 
              value={formData.testType} 
              onValueChange={(value) => onInputChange('testType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select test type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="functional">Functional Testing</SelectItem>
                <SelectItem value="ui">UI Testing</SelectItem>
                <SelectItem value="regression">Regression Testing</SelectItem>
                <SelectItem value="smoke">Smoke Testing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="browser">Browser</Label>
            <Select 
              value={formData.browserType} 
              onValueChange={(value) => onInputChange('browserType', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select browser" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chrome">Chrome</SelectItem>
                <SelectItem value="firefox">Firefox</SelectItem>
                <SelectItem value="edge">Edge</SelectItem>
                <SelectItem value="safari">Safari</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Database Connection</Label>
            <div className="flex items-center space-x-2 p-2 bg-green-50 rounded border">
              <Database className="w-4 h-4 text-green-600" />
              <span className="text-sm text-green-700">SSMS Connected</span>
            </div>
          </div>
        </div>
        
        <div className="bg-yellow-50 p-4 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">Test Execution Flow:</h4>
          <ol className="text-sm text-yellow-700 space-y-1">
            <li>1. Fetch XPath elements from SSMS database for workflow</li>
            <li>2. Execute test steps using Selenium with provided test data</li>
            <li>3. Capture screenshots and logs for each step</li>
            <li>4. Write Pass/Fail results back to SSMS database</li>
            <li>5. Generate comprehensive test report</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  );
};

export default TestExecutionSettings;
