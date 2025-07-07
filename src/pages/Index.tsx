import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import ModeSelector from '@/components/ModeSelector';
import TestDataForm from '@/components/TestDataForm';
import TestResults from '@/components/TestResults';
import { Plane, Bus, Train, Hotel, Play, Database, FileText, AlertCircle } from 'lucide-react';

type BookingMode = 'flight' | 'bus' | 'train' | 'hotel';

interface TestData {
  testCaseId?: string;
  source?: string;
  destination?: string;
  date?: string;
  passengers?: number;
  children?: number;
  infants?: number;
  travelClass?: string;
  checkIn?: string;
  checkOut?: string;
  rooms?: number;
  browserType?: string;
  testType?: string;
}

const Index = () => {
  const [selectedMode, setSelectedMode] = useState<BookingMode | null>(null);
  const [currentStep, setCurrentStep] = useState<'select' | 'configure' | 'execute' | 'results'>('select');
  const [testData, setTestData] = useState<TestData>({});
  const [isExecuting, setIsExecuting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);

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
    setApiError(null);
    setExecutionLogs([]);
    
    // Add initial log
    const addLog = (message: string) => {
      console.log(message);
      setExecutionLogs(prev => [...prev, `[${new Date().toISOString()}] ${message}`]);
    };

    try {
      addLog('🚀 Starting test execution...');
      addLog(`📋 Mode: ${selectedMode}, Test Case: ${testData.testCaseId}`);
      addLog('🔗 Connecting to Flask API...');
      
      // Check if Flask server is running first
      try {
        const healthCheck = await fetch('http://localhost:5000/', {
          method: 'GET',
          timeout: 5000
        });
        
        if (!healthCheck.ok) {
          throw new Error('Flask server not responding properly');
        }
        addLog('✅ Flask server connection successful');
      } catch (healthError) {
        throw new Error('Cannot connect to Flask server. Make sure Python Flask app is running on http://localhost:5000');
      }

      const requestPayload = {
        mode: selectedMode,
        testData: {
          ...testData,
          mode: selectedMode // Ensure mode is included
        }
      };

      addLog('📤 Sending test execution request...');
      console.log('📤 Request payload:', requestPayload);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        addLog('⏰ Request timeout after 120 seconds');
      }, 120000); // 2 minute timeout for test execution
      
      const response = await fetch('http://localhost:5000/api/execute-test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestPayload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      addLog(`📡 API Response Status: ${response.status}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      console.log('📊 Full API Response:', result);
      addLog('📊 Received API response');
      
      if (result.success) {
        addLog('✅ Test execution completed successfully');
        addLog(`📈 Results: ${result.result.passed_steps}/${result.result.total_steps} steps passed`);
        setTestResults(result.result);
        setCurrentStep('results');
      } else {
        addLog('❌ Test execution failed');
        console.error('❌ Test execution failed:', result.error);
        setApiError(result.error || 'Unknown error occurred during test execution');
      }
      
    } catch (error) {
      console.error('❌ API call failed:', error);
      addLog(`❌ Error: ${error.message}`);
      
      if (error.name === 'AbortError') {
        setApiError('Request timeout - Test execution took too long (>2 minutes). Check if Chrome is launching properly.');
      } else if (error.message.includes('fetch') || error.message.includes('connect')) {
        setApiError('Cannot connect to Flask server. Make sure Python Flask app is running: python app.py');
      } else {
        setApiError(`Execution Error: ${error.message}`);
      }
    } finally {
      setIsExecuting(false);
    }
  };

  const resetDashboard = () => {
    setSelectedMode(null);
    setCurrentStep('select');
    setTestData({});
    setIsExecuting(false);
    setTestResults(null);
    setApiError(null);
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
          <div className="space-y-6">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl">Ready to Execute Test</CardTitle>
                <CardDescription>
                  The system will fetch XPath from database and execute the test in Chrome browser
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3 flex items-center">
                    <FileText className="w-4 h-4 mr-2" />
                    Test Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Mode:</span>
                      <Badge variant="outline" className="ml-2 capitalize">{selectedMode}</Badge>
                    </div>
                    <div>
                      <span className="font-medium">Test Case ID:</span>
                      <span className="ml-2">{testData.testCaseId}</span>
                    </div>
                    {testData.source && (
                      <div>
                        <span className="font-medium">Source:</span>
                        <span className="ml-2">{testData.source}</span>
                      </div>
                    )}
                    {testData.destination && (
                      <div>
                        <span className="font-medium">Destination:</span>
                        <span className="ml-2">{testData.destination}</span>
                      </div>
                    )}
                    {testData.date && (
                      <div>
                        <span className="font-medium">Date:</span>
                        <span className="ml-2">{testData.date}</span>
                      </div>
                    )}
                    {testData.passengers && (
                      <div>
                        <span className="font-medium">Adults/Passengers:</span>
                        <span className="ml-2">{testData.passengers}</span>
                      </div>
                    )}
                    {testData.children !== undefined && testData.children > 0 && (
                      <div>
                        <span className="font-medium">Children:</span>
                        <span className="ml-2">{testData.children}</span>
                      </div>
                    )}
                    {testData.infants !== undefined && testData.infants > 0 && (
                      <div>
                        <span className="font-medium">Infants:</span>
                        <span className="ml-2">{testData.infants}</span>
                      </div>
                    )}
                    {testData.travelClass && (
                      <div>
                        <span className="font-medium">Travel Class:</span>
                        <span className="ml-2">{testData.travelClass}</span>
                      </div>
                    )}
                    {testData.checkIn && (
                      <div>
                        <span className="font-medium">Check In:</span>
                        <span className="ml-2">{testData.checkIn}</span>
                      </div>
                    )}
                    {testData.checkOut && (
                      <div>
                        <span className="font-medium">Check Out:</span>
                        <span className="ml-2">{testData.checkOut}</span>
                      </div>
                    )}
                    {testData.rooms && (
                      <div>
                        <span className="font-medium">Rooms:</span>
                        <span className="ml-2">{testData.rooms}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Real-time Execution Logs */}
                {isExecuting && executionLogs.length > 0 && (
                  <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-48 overflow-y-auto">
                    <div className="mb-2 text-white font-semibold">🔄 Live Execution Logs:</div>
                    {executionLogs.map((log, index) => (
                      <div key={index} className="mb-1">{log}</div>
                    ))}
                    {isExecuting && (
                      <div className="flex items-center mt-2">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-400 mr-2" />
                        <span>Executing test...</span>
                      </div>
                    )}
                  </div>
                )}

                {/* API Error Display */}
                {apiError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                      <div className="text-red-600 font-semibold">Execution Error:</div>
                    </div>
                    <div className="text-red-700 text-sm mb-3">{apiError}</div>
                    <div className="bg-red-100 p-3 rounded text-xs text-red-600">
                      <div className="font-semibold mb-1">Troubleshooting Steps:</div>
                      <ul className="list-disc list-inside space-y-1">
                        <li>Make sure Flask server is running: <code className="bg-red-200 px-1 rounded">python app.py</code></li>
                        <li>Check if SSMS database connection is working</li>
                        <li>Verify Chrome browser is installed and accessible</li>
                        <li>Check console logs for detailed error information</li>
                      </ul>
                    </div>
                  </div>
                )}

                <div className="flex space-x-4 justify-center">
                  <Button 
                    variant="outline" 
                    onClick={() => setCurrentStep('configure')}
                    disabled={isExecuting}
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
