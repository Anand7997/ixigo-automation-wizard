import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModeSelector from '@/components/ModeSelector';
import TestDataForm from '@/components/TestDataForm';
import TestResults from '@/components/TestResults';
import { Plane, Bus, Train, Hotel, Play, Database, FileText } from 'lucide-react';

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

const Index = () => {
  const [selectedMode, setSelectedMode] = useState<BookingMode | null>(null);
  const [currentStep, setCurrentStep] = useState<'select' | 'configure' | 'execute' | 'results'>('select');
  const [testData, setTestData] = useState<TestData>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState(null);

  const getModeIcon = (mode: BookingMode) => {
    const icons = {
      flight: Plane,
      bus: Bus,
      train: Train,
      hotel: Hotel
    };
    return icons[mode];
  };

  const handleModeSelect = (mode: BookingMode) => {
    setSelectedMode(mode);
    setCurrentStep('configure');
  };

  const handleTestDataSubmit = (data: TestData) => {
    setTestData(data);
    setCurrentStep('execute');
  };

  const handleExecuteTest = async () => {
    setIsExecuting(true);
    
    try {
      console.log('🚀 Calling Flask API with:', { 
        mode: selectedMode, 
        testData: testData 
      });
      
      const response = await fetch('http://localhost:5000/api/execute-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mode: selectedMode,
          testData: testData
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ Test execution successful:', result.result);
        setTestResults(result.result);
        setCurrentStep('results');
      } else {
        console.error('❌ Test execution failed:', result.error);
        alert(`Test execution failed: ${result.error}`);
      }
      
    } catch (error) {
      console.error('❌ API call failed:', error);
      alert(`Failed to connect to test automation server: ${error.message}`);
    } finally {
      setIsExecuting(false);
    }
  };

  const resetDashboard = () => {
    setSelectedMode(null);
    setCurrentStep('select');
    setTestData({});
    setIsExecuting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Ixigo Test Automation Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Data-driven testing platform for travel booking automation
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {['select', 'configure', 'execute', 'results'].map((step, index) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  currentStep === step ? 'bg-blue-600 text-white' : 
                  ['select', 'configure', 'execute', 'results'].indexOf(currentStep) > index ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {index + 1}
                </div>
                <span className="ml-2 text-sm font-medium capitalize">{step}</span>
                {index < 3 && <div className="w-8 h-0.5 bg-gray-300 ml-4" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content based on current step */}
        {currentStep === 'select' && (
          <div>
            <Card className="mb-6">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Select Booking Mode</CardTitle>
                <CardDescription>
                  Choose the type of booking you want to test on Ixigo
                </CardDescription>
              </CardHeader>
            </Card>
            <ModeSelector onModeSelect={handleModeSelect} />
          </div>
        )}

        {currentStep === 'configure' && selectedMode && (
          <div>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  {React.createElement(getModeIcon(selectedMode), { className: "w-6 h-6 text-blue-600" })}
                  <div>
                    <CardTitle className="capitalize">{selectedMode} Test Configuration</CardTitle>
                    <CardDescription>
                      Enter test data that will be used to fetch XPath from database
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <TestDataForm 
                  mode={selectedMode} 
                  onSubmit={handleTestDataSubmit}
                  onBack={() => setCurrentStep('select')}
                />
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'execute' && (
          <div>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Ready to Execute Test</CardTitle>
                <CardDescription>
                  The system will fetch XPath from database and execute the test
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Test Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Mode:</span>
                      <Badge variant="outline" className="ml-2 capitalize">{selectedMode}</Badge>
                    </div>
                    {Object.entries(testData).map(([key, value]) => (
                      <div key={key}>
                        <span className="font-medium capitalize">{key}:</span>
                        <span className="ml-2">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('configure')}
                  >
                    Back to Configure
                  </Button>
                  <Button 
                    onClick={handleExecuteTest}
                    disabled={isExecuting}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {isExecuting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Executing Test...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 mr-2" />
                        Execute Test
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 'results' && testResults && (
          <div>
            <TestResults 
              mode={selectedMode!}
              testData={testData}
              testResults={testResults}
              onNewTest={resetDashboard}
            />
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pt-8 border-t border-gray-200">
          <p className="text-gray-500 text-sm">
            Connected to SSMS Database • Python Backend Integration
          </p>
          <div className="flex justify-center items-center mt-2 space-x-4">
            <Badge variant="outline" className="flex items-center">
              <Database className="w-3 h-3 mr-1" />
              Database Connected
            </Badge>
            <Badge variant="outline" className="flex items-center">
              <FileText className="w-3 h-3 mr-1" />
              XPath Repository Ready
            </Badge>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
