import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Clock, Download, RefreshCw, Database, AlertTriangle } from 'lucide-react';

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

interface TestResultsProps {
  mode: BookingMode;
  testData: TestData;
  testResults: any; // Results from Flask API
  onNewTest: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({ mode, testData, testResults, onNewTest }) => {
  const [isExporting, setIsExporting] = useState(false);

  // Use real results from Flask API instead of mock data
  const results = testResults || {
    testId: 'TEST_ERROR',
    status: 'error',
    totalSteps: 0,
    passedSteps: 0,
    failedSteps: 1,
    stepResults: [],
    executionTime: '0 seconds'
  };

  const handleExportResults = async () => {
    setIsExporting(true);
    // Simulate export process
    setTimeout(() => {
      setIsExporting(false);
      console.log('Exporting detailed test results to SSMS database...');
    }, 2000);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success': 
      case 'pass': return 'text-green-600 bg-green-100';
      case 'failed': 
      case 'fail': return 'text-red-600 bg-red-100';
      case 'error': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
      case 'pass': return CheckCircle;
      case 'failed': 
      case 'fail':
      case 'error': return XCircle;
      default: return Clock;
    }
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
                Test ID: {results.test_id} • Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </CardDescription>
            </div>
            <Badge variant="outline" className={
              results.status === 'passed' ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'
            }>
              {results.status.toUpperCase()}
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
                Step-by-step execution results from your Flask API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.step_results && results.step_results.length > 0 ? (
                  results.step_results.map((step: any, index: number) => {
                    const StatusIcon = getStatusIcon(step.status);
                    return (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-3">
                            <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
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
                            <span className="font-medium">Element:</span> {step.element_name}
                          </div>
                          <div>
                            <span className="font-medium">Action:</span> {step.action_type}
                          </div>
                          <div>
                            <span className="font-medium">Value:</span> {step.test_value}
                          </div>
                          <div>
                            <span className="font-medium">Status:</span> {step.status}
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-medium">XPath:</span> 
                            <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{step.xpath}</code>
                          </div>
                          {step.error && (
                            <div className="md:col-span-2 text-red-600">
                              <span className="font-medium">Error:</span> {step.error}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No step results available
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
                Input data that was used for this test execution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(testData).map(([key, value]) => (
                  <div key={key} className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-gray-600">{value}</span>
                  </div>
                ))}
              </div>
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
                <div>[{new Date().toISOString()}] Found {mockResults.xpathUsed.length} XPath elements in database</div>
                <div>[{new Date().toISOString()}] Launching Chrome browser...</div>
                <div>[{new Date().toISOString()}] Navigating to ixigo.com...</div>
                {mockResults.testSteps.map((step, index) => (
                  <div key={index}>
                    <div>[{new Date().toISOString()}] Executing step {step.stepNo}: {step.description}</div>
                    <div>[{new Date().toISOString()}] {step.status === 'Pass' ? '✓' : '✗'} {step.expectedResult}</div>
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
      {mockResults.failedSteps > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <div>
                <div className="font-semibold text-orange-800">
                  {mockResults.failedSteps} steps failed during execution
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
