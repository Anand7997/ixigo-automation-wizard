
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
  onNewTest: () => void;
}

const TestResults: React.FC<TestResultsProps> = ({ mode, testData, onNewTest }) => {
  const [isExporting, setIsExporting] = useState(false);

  // Mock test results - in real implementation, this would come from your Python backend
  const mockResults = {
    testId: 'TEST_' + Date.now(),
    status: 'completed',
    startTime: new Date().toISOString(),
    endTime: new Date(Date.now() + 45000).toISOString(),
    duration: '45 seconds',
    totalSteps: 12,
    passedSteps: 10,
    failedSteps: 2,
    testSteps: [
      { stepNo: 1, description: 'Open Browser and Navigate to Ixigo', elementName: 'Browser', actionType: 'OPEN_BROWSER', xpath: 'N/A', values: `https://www.ixigo.com/${mode}s`, expectedResult: `Browser should open and navigate to Ixigo ${mode}s page`, status: 'Pass' },
      { stepNo: 2, description: 'Enter departure city', elementName: 'From', actionType: 'CLICK_AND_SELECT', xpath: "//*[contains(text(), 'From')]", values: testData.source || 'New Delhi', expectedResult: 'From station should be entered', status: 'Pass' },
      { stepNo: 3, description: 'Enter destination city', elementName: 'To', actionType: 'CLICK_AND_SELECT', xpath: "//label[contains(text(),'To')]/following::input[1]", values: testData.destination || 'Hyderabad', expectedResult: 'To station should be entered', status: 'Pass' },
      { stepNo: 4, description: 'Select departure date', elementName: 'Departure', actionType: 'CLICK_AND_SELECT_DATE', xpath: "//*[contains(@data-testid, 'departure')]", values: testData.date || 'Thu, 03 Jul', expectedResult: 'Date picker should open and date should be selected', status: 'Pass' },
      { stepNo: 5, description: 'Select passengers/guests', elementName: 'PassengerCount', actionType: 'SELECT_COUNT', xpath: "//p[contains(text(), 'Adults')]", values: testData.passengers?.toString() || '2', expectedResult: 'Passenger count should be set', status: 'Pass' },
      { stepNo: 6, description: 'Click Search button', elementName: 'SearchButton', actionType: 'CLICK', xpath: "//button[contains(text(), 'Search')]", values: 'N/A', expectedResult: 'Search should be initiated', status: 'Failed' }
    ],
    xpathUsed: [
      { element: 'Browser Navigation', xpath: 'N/A', status: 'success', actionType: 'OPEN_BROWSER' },
      { element: 'From Input', xpath: "//*[contains(text(), 'From')]", status: 'success', actionType: 'CLICK_AND_SELECT' },
      { element: 'To Input', xpath: "//label[contains(text(),'To')]/following::input[1]", status: 'success', actionType: 'CLICK_AND_SELECT' },
      { element: 'Date Picker', xpath: "//*[contains(@data-testid, 'departure')]", status: 'success', actionType: 'CLICK_AND_SELECT_DATE' },
      { element: 'Passenger Section', xpath: "//p[contains(text(), 'Travellers & Class')]", status: 'success', actionType: 'CLICK' },
      { element: 'Adult Count', xpath: "//p[contains(text(), 'Adults')]", status: 'success', actionType: 'SELECT_COUNT' },
      { element: 'Search Button', xpath: "//button[contains(text(), 'Search')]", status: 'failed', actionType: 'CLICK' }
    ],
    screenshots: [
      { step: 'Home Page', status: 'captured' },
      { step: 'Search Form', status: 'captured' },
      { step: 'Date Selection', status: 'captured' },
      { step: 'Search Results', status: 'error' }
    ]
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
                <CheckCircle className="w-6 h-6 text-green-600 mr-3" />
                Test Execution Complete
              </CardTitle>
              <CardDescription className="text-lg mt-2">
                Test ID: {mockResults.testId} • Mode: {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-green-600 border-green-600">
              {mockResults.status.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{mockResults.totalSteps}</div>
              <div className="text-sm text-gray-600">Total Steps</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{mockResults.passedSteps}</div>
              <div className="text-sm text-gray-600">Passed</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">{mockResults.failedSteps}</div>
              <div className="text-sm text-gray-600">Failed</div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-600">{mockResults.duration}</div>
              <div className="text-sm text-gray-600">Duration</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Results Tabs */}
      <Tabs defaultValue="steps" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="steps">Test Steps</TabsTrigger>
          <TabsTrigger value="xpath">XPath Results</TabsTrigger>
          <TabsTrigger value="screenshots">Screenshots</TabsTrigger>
          <TabsTrigger value="data">Test Data</TabsTrigger>
          <TabsTrigger value="logs">Execution Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="steps" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                Detailed Test Steps Execution
              </CardTitle>
              <CardDescription>
                Step-by-step execution results matching your Excel test cases
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockResults.testSteps.map((step, index) => {
                  const StatusIcon = getStatusIcon(step.status);
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                            Step {step.stepNo}
                          </div>
                          <StatusIcon className={`w-5 h-5 ${step.status.toLowerCase() === 'pass' ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <Badge className={getStatusColor(step.status)}>
                          {step.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="font-medium">Description:</span> {step.description}
                        </div>
                        <div>
                          <span className="font-medium">Element:</span> {step.elementName}
                        </div>
                        <div>
                          <span className="font-medium">Action:</span> {step.actionType}
                        </div>
                        <div>
                          <span className="font-medium">Value:</span> {step.values}
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">XPath:</span> 
                          <code className="ml-2 bg-gray-100 px-2 py-1 rounded text-xs">{step.xpath}</code>
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-medium">Expected Result:</span> {step.expectedResult}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="xpath" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="w-5 h-5 mr-2" />
                XPath Execution Results
              </CardTitle>
              <CardDescription>
                XPath elements fetched from database and their execution status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockResults.xpathUsed.map((xpath, index) => {
                  const StatusIcon = getStatusIcon(xpath.status);
                  return (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <StatusIcon className={`w-5 h-5 ${xpath.status === 'success' ? 'text-green-600' : 'text-red-600'}`} />
                        <div>
                          <div className="font-medium">{xpath.element}</div>
                          <div className="text-sm text-gray-600 font-mono">{xpath.xpath}</div>
                          <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-1 inline-block">
                            {xpath.actionType}
                          </div>
                        </div>
                      </div>
                      <Badge className={getStatusColor(xpath.status)}>
                        {xpath.status}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="screenshots" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Screenshots</CardTitle>
              <CardDescription>
                Screenshots captured during test execution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockResults.screenshots.map((screenshot, index) => (
                  <div key={index} className="border rounded-lg p-4 text-center">
                    <div className="w-full h-32 bg-gray-100 rounded mb-3 flex items-center justify-center">
                      <span className="text-gray-500">Screenshot Preview</span>
                    </div>
                    <div className="font-medium">{screenshot.step}</div>
                    <Badge className={getStatusColor(screenshot.status)}>
                      {screenshot.status}
                    </Badge>
                  </div>
                ))}
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
