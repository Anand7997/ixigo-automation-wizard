
import { CalendarDays, Users, MapPin, Settings, Database } from 'lucide-react';
import { FormField, BookingMode } from '@/types/testData';

export const getFieldsForMode = (mode: BookingMode): FormField[] => {
  const commonFields: FormField[] = [
    { 
      key: 'testCaseId', 
      label: 'Test Case ID', 
      type: 'text', 
      icon: Database, 
      placeholder: `${mode.toUpperCase().substring(0, 2)}-001`, 
      description: 'Unique identifier for this test case' 
    }
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
