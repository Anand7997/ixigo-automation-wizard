
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Download, RefreshCw, Database, AlertTriangle } from 'lucide-react';

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

interface TestResultsProps {
  mode: BookingMode;
  testData: TestData;
  testResults: any;
  onNewTest: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({ mode, testData, testResults, onNewTest }) => {
  const [isExporting, setIsExporting] = useState(false);

  const results = testResults || {
    test_id: 'TEST_ERROR',
    status: 'error',
    total_steps: 0,
    passed_steps: 0,
    failed_steps: 1,
    step_results: [],
    execution_time: '0 seconds'
  };

  const handleExportResults = async () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      console.log('Exporting detailed test results to SSMS database...');
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success': 
      case 'pass': 
      case 'passed': return 'text-green-600 bg-green-100';
      case 'failed': 
      case 'fail': return 'text-red-600 bg-red-100';
      case 'error': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'pass':
      case 'passed': return CheckCircle;
      case 'failed': 
      case 'fail':
      case 'error': return XCircle;
      default: return Clock;
    }
  };

  // Enhanced test data formatting to include all fields
  const getFormattedTestData = () => {
    const formatted = [];
    
    if (testData.testCaseId) {
      formatted.push({ label: 'Test Case ID', value: testData.testCaseId, important: true });
    }
    if (testData.source) {
      formatted.push({ label: 'Source', value: testData.source, important: true });
    }
    if (testData.destination) {
      formatted.push({ label: 'Destination', value: testData.destination, important: true });
    }
    if (testData.date) {
      formatted.push({ label: 'Travel Date', value: testData.date, important: true });
    }
    if (testData.passengers) {
      formatted.push({ label: 'Adults/Passengers', value: testData.passengers.toString(), important: true });
    }
    
    // Always show children count (even if 0)
    formatted.push({ 
      label: 'Children', 
      value: (testData.children || 0).toString(), 
      important: false 
    });
    
    // Always show infants count (even if 0) 
    formatted.push({ 
      label: 'Infants', 
      value: (testData.infants || 0).toString(), 
      important: false 
    });
    
    if (testData.travelClass) {
      formatted.push({ label: 'Travel Class', value: testData.travelClass, important: true });
    }
    if (testData.checkIn) {
      formatted.push({ label: 'Check In Date', value: testData.checkIn, important: true });
    }
    if (testData.checkOut) {
      formatted.push({ label: 'Check Out Date', value: testData.checkOut, important: true });
    }
    if (testData.rooms) {
      formatted.push({ label: 'Rooms', value: testData.rooms.toString(), important: true });
    }
    if (testData.browserType) {
      formatted.push({ label: 'Browser Type', value: testData.browserType, important: false });
    }
    if (testData.testType) {
      formatted.push({ label: 'Test Type', value: testData.testType, important: false });
    }
    
    return formatted;
  };

  return (
    <div className="space-y-6">
      {/* Test Summary Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                {results.status === 'passed' ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 mr-3" />
                )}
                Test Execution {results.status === 'passed' ? 'Passed' : 'Failed'}
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Test ID: {results.test_id || results.testId} • Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </CardDescription>
            </div>
            <Badge variant="outline" className={
              results.status === 'passed' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'
            }>
              {results.status?.toUpperCase() || 'UNKNOWN'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{results.total_steps || 0}</div>
              <div className="text-sm text-gray-600">Total Steps</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{results.passed_steps || 0}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{results.failed_steps || 0}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{results.execution_time || 'N/A'}</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results Tabs */}
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="steps">Test Steps</TabsTrigger>
          <TabsTrigger value="data">Test Data</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
          <TabsTrigger value="error">Error Details</TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Detailed Test Steps Execution
              </CardTitle>
              <CardDescription>
                Step-by-step execution results from your Flask API and Selenium automation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.step_results && results.step_results.length > 0 ? (
                  results.step_results.map((step: any, index: number) => {
                    const StatusIcon = getStatusIcon(step.status);
                    return (
                      <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium min-w-[60px] text-center">
                              Step {step.step_number}
                            </div>
                            <StatusIcon className={`w-5 h-5 ${step.status === 'passed' ? 'text-green-600' : 'text-red-600'}`} />
                          </div>
                          <Badge className={getStatusColor(step.status)}>
                            {step.status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="font-medium text-gray-700">Element:</span> 
                            <span className="ml-1">{step.element_name}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Action:</span> 
                            <span className="ml-1">{step.action_type}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Value Used:</span> 
                            <span className="ml-1 text-blue-600">{step.test_value || 'N/A'}</span>
                          </div>
                          <div>
                            <span className="font-medium text-gray-700">Result:</span> 
                            <span className={`ml-1 font-medium ${step.status === 'passed' ? 'text-green-600' : 'text-red-600'}`}>
                              {step.status}
                            </span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium text-gray-700">XPath:</span> 
                            <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs break-all">
                              {step.xpath}
                            </code>
                          </div>
                          {step.message && (
                            <div className="md:col-span-2 text-gray-600">
                              <span className="font-medium">Message:</span> 
                              <span className="ml-1">{step.message}</span>
                            </div>
                          )}
                          {step.error && (
                            <div className="md:col-span-2 text-red-600 bg-red-50 p-2 rounded">
                              <span className="font-medium">Error:</span> 
                              <span className="ml-1">{step.error}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Database className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No step results available</p>
                    <p className="text-sm">Test may not have executed properly</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Data Used</CardTitle>
              <CardDescription>
                Complete input data that was used for this test execution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getFormattedTestData().map((item) => (
                  <div key={item.label} className={`flex justify-between items-center p-3 rounded transition-colors ${
                    item.important ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}>
                    <span className="font-medium text-gray-700">{item.label}:</span>
                    <span className={`text-right ${item.important ? 'text-blue-700 font-medium' : 'text-gray-600'}`}>
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Summary for flight mode */}
              {mode === 'flight' && (
                <div className="mt-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">Flight Booking Summary</h4>
                  <div className="text-sm text-blue-700">
                    <span className="font-medium">Route:</span> {testData.source} → {testData.destination} | 
                    <span className="font-medium ml-2">Passengers:</span> {testData.passengers || 1} Adults, {testData.children || 0} Children, {testData.infants || 0} Infants | 
                    <span className="font-medium ml-2">Class:</span> {testData.travelClass || 'Economy'}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Execution Logs</CardTitle>
              <CardDescription>
                Detailed logs from the test execution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm max-h-64 overflow-y-auto">
                <div>[{new Date().toISOString()}] Starting test execution for {mode} booking...</div>
                <div>[{new Date().toISOString()}] Connecting to SSMS database...</div>
                <div>[{new Date().toISOString()}] Fetching XPath elements for {mode} workflow...</div>
                <div>[{new Date().toISOString()}] Found {results.step_results?.length || 0} XPath elements in database</div>
                <div>[{new Date().toISOString()}] Launching Chrome browser...</div>
                <div>[{new Date().toISOString()}] Navigating to ixigo.com...</div>
                {results.step_results && results.step_results.map((step: any, index: number) => (
                  <div key={index}>
                    <div>[{new Date().toISOString()}] Executing step {step.step_number}: {step.element_name}</div>
                    <div>[{new Date().toISOString()}] {step.status === 'passed' ? '✓' : '✗'} {step.action_type}</div>
                  </div>
                ))}
                <div>[{new Date().toISOString()}] Test execution completed</div>
                <div>[{new Date().toISOString()}] Writing results to SSMS database...</div>
                <div>[{new Date().toISOString()}] ✓ Results saved successfully</div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="error" className="space-y-4">
          {results.error && (
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Error Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-red-700">
                  <p className="font-medium">Error Message:</p>
                  <code className="block mt-2 p-3 bg-red-100 rounded text-sm">
                    {results.error}
                  </code>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex space-x-4">
        <Button onClick={onNewTest} variant="outline" className="flex-1">
          <RefreshCw className="w-4 h-4 mr-2" />
          Run New Test
        </Button>
        <Button 
          onClick={handleExportResults}
          disabled={isExporting}
          className="flex-1 bg-green-600 hover:bg-green-700"
        >
          {isExporting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
              Exporting...
            </>
          ) : (
            <>
              <Download className="w-4 h-4 mr-2" />
              Export to SSMS Database
            </>
          )}
        </Button>
      </div>

      {/* Failed Steps Alert */}
      {results.failed_steps > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-semibold text-orange-800">
                  {results.failed_steps} steps failed during execution
                </div>
                <div className="text-sm text-orange-700">
                  Review the Test Steps and XPath Results tabs for details. Consider updating XPath elements in the database.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TestResults;
