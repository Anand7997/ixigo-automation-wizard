import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, MapPin, Settings, Database } from 'lucide-react';

type BookingMode = 'flight' | 'bus' | 'train' | 'hotel';

interface TestData {
  source?: string;
  destination?: string;
  date?: string;
  returnDate?: string;
  passengers?: number;
  children?: number;
  infants?: number;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  travelClass?: string;
  testCaseId?: string;
  browserType?: string;
  testType?: string;
}

interface BaseField {
  key: string;
  label: string;
  type: string;
  icon: React.ComponentType<any>;
  description: string;
}

interface SelectField extends BaseField {
  type: 'select';
  options: string[];
}

interface InputField extends BaseField {
  type: 'text' | 'date' | 'number';
  placeholder?: string;
}

type FormField = SelectField | InputField;

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

  const getFieldsForMode = (): FormField[] => {
    const commonFields: FormField[] = [
      { key: 'testCaseId', label: 'Test Case ID', type: 'text', icon: Database, placeholder: `${mode.toUpperCase().substring(0, 2)}-001`, description: 'Unique identifier for this test case' }
    ];

    switch (mode) {
      case 'flight':
        return [
          ...commonFields,
          { key: 'source', label: 'From (Departure City)', type: 'text', icon: MapPin, placeholder: 'New Delhi', description: 'Enter departure city' },
          { key: 'destination', label: 'To (Arrival City)', type: 'text', icon: MapPin, placeholder: 'Hyderabad', description: 'Enter destination city' },
          { key: 'date', label: 'Departure Date', type: 'date', icon: CalendarDays, description: 'Select departure date' },
          { key: 'returnDate', label: 'Return Date (Optional)', type: 'date', icon: CalendarDays, description: 'Select return date for round trip' },
          { key: 'passengers', label: 'Adults', type: 'number', icon: Users, placeholder: '1', description: 'Number of adult passengers' },
          { key: 'children', label: 'Children', type: 'number', icon: Users, placeholder: '0', description: 'Number of children (2-11 years)' },
          { key: 'infants', label: 'Infants', type: 'number', icon: Users, placeholder: '0', description: 'Number of infants (under 2 years)' },
          { key: 'travelClass', label: 'Travel Class', type: 'select', icon: Settings, options: ['Economy', 'Premium Economy', 'Business', 'First Class'], description: 'Select travel class' }
        ];
      case 'hotel':
        return [
          ...commonFields,
          { key: 'destination', label: 'Hotel Location', type: 'text', icon: MapPin, placeholder: 'Hyderabad', description: 'Enter city or hotel name' },
          { key: 'checkIn', label: 'Check-in Date', type: 'date', icon: CalendarDays, description: 'Select check-in date' },
          { key: 'checkOut', label: 'Check-out Date', type: 'date', icon: CalendarDays, description: 'Select check-out date' },
          { key: 'rooms', label: 'Number of Rooms', type: 'number', icon: Users, placeholder: '1', description: 'Number of rooms required' },
          { key: 'passengers', label: 'Adults', type: 'number', icon: Users, placeholder: '2', description: 'Number of adult guests' },
          { key: 'children', label: 'Children', type: 'number', icon: Users, placeholder: '0', description: 'Number of children' }
        ];
      case 'train':
        return [
          ...commonFields,
          { key: 'source', label: 'From Station', type: 'text', icon: MapPin, placeholder: 'New Delhi', description: 'Enter departure station' },
          { key: 'destination', label: 'To Station', type: 'text', icon: MapPin, placeholder: 'Hyderabad', description: 'Enter destination station' },
          { key: 'date', label: 'Journey Date', type: 'date', icon: CalendarDays, description: 'Select journey date' },
          { key: 'travelClass', label: 'Class', type: 'select', icon: Settings, options: ['Sleeper', '3A', '2A', '1A', 'CC', 'EC'], description: 'Select travel class' }
        ];
      case 'bus':
        return [
          ...commonFields,
          { key: 'source', label: 'From City', type: 'text', icon: MapPin, placeholder: 'New Delhi', description: 'Enter departure city' },
          { key: 'destination', label: 'To City', type: 'text', icon: MapPin, placeholder: 'Hyderabad', description: 'Enter destination city' },
          { key: 'date', label: 'Journey Date', type: 'date', icon: CalendarDays, description: 'Select journey date' },
          { key: 'passengers', label: 'Passengers', type: 'number', icon: Users, placeholder: '1', description: 'Number of passengers' }
        ];
      default:
        return commonFields;
    }
  };

  const popularDestinations = {
    flight: {
      cities: ['New Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad'],
      description: 'Popular flight routes'
    },
    bus: {
      cities: ['Delhi', 'Mumbai', 'Pune', 'Bangalore', 'Ahmedabad', 'Jaipur', 'Hyderabad', 'Chennai'],
      description: 'Popular bus routes'
    },
    train: {
      cities: ['New Delhi', 'Mumbai Central', 'Chennai Central', 'Howrah', 'Bangalore City', 'Pune', 'Hyderabad'],
      description: 'Major railway stations'
    },
    hotel: {
      cities: ['Goa', 'Mumbai', 'Delhi', 'Bangalore', 'Jaipur', 'Kerala', 'Hyderabad', 'Udaipur'],
      description: 'Popular hotel destinations'
    }
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
        {getFieldsForMode().map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key} className="flex items-center text-sm font-medium">
              <field.icon className="w-4 h-4 mr-2 text-gray-500" />
              {field.label}
            </Label>
            
            {field.type === 'select' ? (
              <Select 
                value={formData[field.key as keyof TestData]?.toString() || ''} 
                onValueChange={(value) => handleInputChange(field.key as keyof TestData, value)}
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
                onChange={(e) => handleInputChange(
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
                      onClick={() => handleInputChange(field.key as keyof TestData, city)}
                    >
                      {city}{index < arr.length - 1 ? ',' : ''}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Test Execution Configuration */}
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
                onValueChange={(value) => handleInputChange('testType', value)}
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
                onValueChange={(value) => handleInputChange('browserType', value)}
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
              <li>1. Fetch XPath elements from SSMS database for {mode} workflow</li>
              <li>2. Execute test steps using Selenium with provided test data</li>
              <li>3. Capture screenshots and logs for each step</li>
              <li>4. Write Pass/Fail results back to SSMS database</li>
              <li>5. Generate comprehensive test report</li>
            </ol>
          </div>
        </CardContent>
      </Card>

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
