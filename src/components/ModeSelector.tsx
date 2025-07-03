
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plane, Bus, Train, Hotel, ArrowRight } from 'lucide-react';

type BookingMode = 'flight' | 'bus' | 'train' | 'hotel';

interface ModeSelectorProps {
  onModeSelect: (mode: BookingMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect }) => {
  const modes = [
    {
      id: 'flight' as BookingMode,
      title: 'Flight Booking',
      description: 'Test flight search and booking functionality',
      icon: Plane,
      color: 'bg-blue-500',
      features: ['Multi-city search', 'Date selection', 'Passenger details', 'Price comparison']
    },
    {
      id: 'bus' as BookingMode,
      title: 'Bus Booking',
      description: 'Test bus ticket booking and seat selection',
      icon: Bus,
      color: 'bg-green-500',
      features: ['Route search', 'Seat selection', 'Boarding points', 'Cancellation policy']
    },
    {
      id: 'train' as BookingMode,
      title: 'Train Booking',
      description: 'Test train ticket booking with PNR generation',
      icon: Train,
      color: 'bg-purple-500',
      features: ['Station search', 'Class selection', 'Berth preference', 'Tatkal booking']
    },
    {
      id: 'hotel' as BookingMode,
      title: 'Hotel Booking',
      description: 'Test hotel search and room booking',
      icon: Hotel,
      color: 'bg-orange-500',
      features: ['Location search', 'Check-in/out dates', 'Room types', 'Amenities filter']
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {modes.map((mode) => (
        <Card key={mode.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
          <CardHeader className="text-center pb-4">
            <div className={`w-16 h-16 ${mode.color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
              <mode.icon className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-lg">{mode.title}</CardTitle>
            <CardDescription className="text-sm">
              {mode.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-2 mb-4">
              <h4 className="font-semibold text-sm text-gray-700">Test Features:</h4>
              <ul className="text-xs text-gray-600 space-y-1">
                {mode.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <Button 
              className="w-full group-hover:bg-primary/90 transition-colors"
              onClick={() => onModeSelect(mode.id)}
            >
              Select {mode.title.split(' ')[0]}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModeSelector;
