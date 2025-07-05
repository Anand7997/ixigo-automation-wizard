
import sys
import os
from datetime import datetime
import time
import json

# Add the current directory to Python path to import your classes
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import your existing classes
from BaseClass import BaseClass
from IxigoTestClass import IxigoTestClass

class SeleniumExecutor:
    def __init__(self):
        self.ixigo_test = None
    
    def execute_test(self, mode, test_data, xpath_data):
        """
        Execute test using your existing Selenium classes with database data
        """
        start_time = datetime.now()
        
        try:
            # Initialize your IxigoTestClass
            self.ixigo_test = IxigoTestClass()
            
            # Initialize result structure
            test_result = {
                'test_id': f"{mode.upper()}_{test_data['testCaseId']}_{int(time.time())}",
                'test_case_id': test_data['testCaseId'],
                'mode': mode,
                'status': 'in_progress',
                'total_steps': len(xpath_data),
                'passed_steps': 0,
                'failed_steps': 0,
                'execution_time': None,
                'test_data': test_data,
                'step_results': [],
                'screenshots': []
            }
            
            print(f"🚀 Starting test execution for {mode} with {len(xpath_data)} steps")
            
            # Execute each step from database
            for i, step in enumerate(xpath_data):
                step_result = self.execute_database_step(step, test_data, i + 1)
                test_result['step_results'].append(step_result)
                
                if step_result['status'] == 'passed':
                    test_result['passed_steps'] += 1
                else:
                    test_result['failed_steps'] += 1
                
                # Add small delay between steps
                time.sleep(0.5)
            
            # Determine overall test status
            if test_result['failed_steps'] == 0:
                test_result['status'] = 'passed'
            else:
                test_result['status'] = 'failed'
            
            end_time = datetime.now()
            test_result['execution_time'] = str(end_time - start_time)
            
            print(f"✅ Test execution completed - Status: {test_result['status']}")
            return test_result
            
        except Exception as e:
            print(f"❌ Test execution failed: {str(e)}")
            test_result = {
                'test_id': f"{mode.upper()}_{test_data.get('testCaseId', 'UNKNOWN')}_{int(time.time())}",
                'test_case_id': test_data.get('testCaseId', 'UNKNOWN'),
                'mode': mode,
                'status': 'error',
                'total_steps': len(xpath_data) if xpath_data else 0,
                'passed_steps': 0,
                'failed_steps': len(xpath_data) if xpath_data else 1,
                'execution_time': str(datetime.now() - start_time),
                'test_data': test_data,
                'step_results': [],
                'error': str(e)
            }
            return test_result
            
        finally:
            # Always clean up
            if self.ixigo_test and hasattr(self.ixigo_test, 'driver') and self.ixigo_test.driver:
                try:
                    self.ixigo_test.close_browser()
                except Exception:
                    pass
    
    def execute_database_step(self, step_info, test_data, step_number):
        """
        Execute individual test step using database data with your existing methods
        """
        try:
            element_name = step_info['element_name']
            xpath = step_info['xpath']
            action_type = step_info['action_type']
            expected_result = step_info.get('expected_result', '')
            
            print(f"🔄 Step {step_number}: {action_type} on {element_name}")
            
            # Get the test value based on element name and test data
            test_value = self.get_test_value(element_name, test_data, action_type)
            
            # Use your existing execute_action method
            self.ixigo_test.execute_action(action_type, test_value, xpath, element_name)
            
            return {
                'step_number': step_number,
                'element_name': element_name,
                'action_type': action_type,
                'xpath': xpath,
                'test_value': test_value,
                'expected_result': expected_result,
                'status': 'passed',
                'message': f'Successfully executed {action_type} on {element_name}'
            }
            
        except Exception as e:
            error_msg = str(e)
            print(f"❌ Step {step_number} failed: {error_msg}")
            
            return {
                'step_number': step_number,
                'element_name': step_info['element_name'],
                'action_type': step_info['action_type'],
                'xpath': step_info['xpath'],
                'test_value': self.get_test_value(step_info['element_name'], test_data, step_info['action_type']),
                'expected_result': step_info.get('expected_result', ''),
                'status': 'failed',
                'error': error_msg
            }
    
    def get_test_value(self, element_name, test_data, action_type):
        """
        Map element names to test data values based on your existing logic
        """
        element_lower = element_name.lower()
        
        # Handle browser launch
        if action_type == 'OPEN_BROWSER':
            return f"https://www.ixigo.com/{test_data.get('mode', 'flights')}s"
        
        # Handle city selections
        if element_lower in ['from', 'source']:
            return test_data.get('source', 'New Delhi')
        elif element_lower in ['to', 'destination']:
            return test_data.get('destination', 'Mumbai')
        
        # Handle date selections
        elif element_lower in ['date', 'departure', 'departuredate']:
            return test_data.get('date', 'Tomorrow')
        elif element_lower in ['returndate', 'return']:
            return test_data.get('returnDate', '')
        elif element_lower in ['checkin', 'checkindate']:
            return test_data.get('checkIn', 'Today')
        elif element_lower in ['checkout', 'checkoutdate']:
            return test_data.get('checkOut', 'Tomorrow')
        
        # Handle passenger/guest counts
        elif element_lower in ['passengers', 'adults', 'adultscount']:
            return str(test_data.get('passengers', 1))
        elif element_lower in ['children', 'childrencount']:
            return str(test_data.get('children', 0))
        elif element_lower in ['infants', 'infantscount']:
            return str(test_data.get('infants', 0))
        elif element_lower in ['rooms', 'roomscount']:
            return str(test_data.get('rooms', 1))
        
        # Handle travel class
        elif element_lower in ['travelclass', 'class']:
            return test_data.get('travelClass', 'Economy')
        
        # Handle quick date selections
        elif 'today' in element_lower:
            return 'Today'
        elif 'tomorrow' in element_lower:
            return 'Tomorrow'
        elif 'dayafter' in element_lower or 'day after' in element_lower:
            return 'Day-After-Tomorrow'
        
        # Handle checkboxes
        elif 'checkbox' in element_lower:
            return 'TRUE'  # Default to check
        
        # Default return
        return 'N/A'
