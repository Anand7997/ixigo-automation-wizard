
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarDays, Users, MapPin } from 'lucide-react';

type BookingMode = 'flight' | 'bus' | 'train' | 'hotel';

interface TestData {
  source?: string;
  destination?: string;
  date?: string;
  passengers?: number;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
}

interface TestDataFormProps {
  mode: BookingMode;
  onSubmit: (data: TestData) => void;
  onBack: () => void;
}

const TestDataForm: React.FC<TestDataFormProps> = ({ mode, onSubmit, onBack }) => {
  const [formData, setFormData] = useState<TestData>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleInputChange = (field: keyof TestData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getFieldsForMode = () => {
    switch (mode) {
      case 'flight':
      case 'bus':
      case 'train':
        return [
          { key: 'source', label: 'From', type: 'text', icon: MapPin, placeholder: 'Enter departure city' },
          { key: 'destination', label: 'To', type: 'text', icon: MapPin, placeholder: 'Enter destination city' },
          { key: 'date', label: 'Travel Date', type: 'date', icon: CalendarDays },
          { key: 'passengers', label: 'Passengers', type: 'number', icon: Users, placeholder: '1' }
        ];
      case 'hotel':
        return [
          { key: 'destination', label: 'Location', type: 'text', icon: MapPin, placeholder: 'Enter city or hotel name' },
          { key: 'checkIn', label: 'Check-in Date', type: 'date', icon: CalendarDays },
          { key: 'checkOut', label: 'Check-out Date', type: 'date', icon: CalendarDays },
          { key: 'rooms', label: 'Rooms', type: 'number', icon: Users, placeholder: '1' }
        ];
      default:
        return [];
    }
  };

  const popularDestinations = {
    flight: ['Delhi', 'Mumbai', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad'],
    bus: ['Delhi', 'Mumbai', 'Pune', 'Bangalore', 'Ahmedabad', 'Jaipur'],
    train: ['New Delhi', 'Mumbai Central', 'Chennai Central', 'Howrah', 'Bangalore City', 'Pune'],
    hotel: ['Goa', 'Mumbai', 'Delhi', 'Bangalore', 'Jaipur', 'Kerala']
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {getFieldsForMode().map((field) => (
          <div key={field.key} className="space-y-2">
            <Label htmlFor={field.key} className="flex items-center text-sm font-medium">
              <field.icon className="w-4 h-4 mr-2 text-gray-500" />
              {field.label}
            </Label>
            {field.key === 'source' || field.key === 'destination' ? (
              <div className="space-y-2">
                <Input
                  id={field.key}
                  type={field.type}
                  placeholder={field.placeholder}
                  value={formData[field.key as keyof TestData] || ''}
                  onChange={(e) => handleInputChange(field.key as keyof TestData, e.target.value)}
                  className="w-full"
                />
                <div className="text-xs text-gray-500">
                  Popular: {popularDestinations[mode].map((dest, index) => (
                    <button
                      key={dest}
                      type="button"
                      className="text-blue-600 hover:underline mr-2"
                      onClick={() => handleInputChange(field.key as keyof TestData, dest)}
                    >
                      {dest}{index < popularDestinations[mode].length - 1 ? ',' : ''}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <Input
                id={field.key}
                type={field.type}
                placeholder={field.placeholder}
                value={formData[field.key as keyof TestData] || ''}
                onChange={(e) => handleInputChange(
                  field.key as keyof TestData, 
                  field.type === 'number' ? parseInt(e.target.value) || 0 : e.target.value
                )}
                className="w-full"
                min={field.type === 'number' ? 1 : undefined}
                max={field.type === 'number' ? 10 : undefined}
              />
            )}
          </div>
        ))}
      </div>

      {/* Additional Configuration */}
      <Card className="bg-gray-50">
        <CardContent className="pt-6">
          <h3 className="font-semibold mb-4">Test Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="testType">Test Type</Label>
              <Select defaultValue="functional">
                <SelectTrigger>
                  <SelectValue placeholder="Select test type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="functional">Functional Testing</SelectItem>
                  <SelectItem value="ui">UI Testing</SelectItem>
                  <SelectItem value="performance">Performance Testing</SelectItem>
                  <SelectItem value="regression">Regression Testing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="browser">Browser</Label>
              <Select defaultValue="chrome">
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
          </div>
        </CardContent>
      </Card>

      <div className="flex space-x-4 pt-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back to Mode Selection
        </Button>
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          Configure Test & Continue
        </Button>
      </div>
    </form>
  );
};

export default TestDataForm;
