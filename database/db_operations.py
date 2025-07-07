import pyodbc
from config import Config
from datetime import datetime
import json

class DatabaseOperations:
    def __init__(self):
        self.config = Config()
    
    def get_connection(self):
        return pyodbc.connect(self.config.SSMS_CONNECTION_STRING)
    
    def get_xpath_for_test_case(self, test_case_id, mode):
        """
        Fetch XPath elements and action types for given test case and mode
        Updated to work with mode-specific tables like Bus_TestCases, Train_TestCases, etc.
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            # Construct table name based on mode
            table_name = f"{mode.capitalize()}_TestCases"
            
            query = f"""
            SELECT element_name, xpath_value, action_type, expected_result, step_order
            FROM {table_name}
            WHERE test_case_id = ?
            ORDER BY step_order ASC
            """
            
            cursor.execute(query, (test_case_id,))
            rows = cursor.fetchall()
            
            xpath_data = []
            for row in rows:
                xpath_data.append({
                    'element_name': row[0],
                    'xpath': row[1],
                    'action_type': row[2],
                    'expected_result': row[3],
                    'step_order': row[4]
                })
            
            print(f"✅ Found {len(xpath_data)} XPath elements for {test_case_id} - {mode} from table {table_name}")
            return xpath_data
            
        except Exception as e:
            print(f"❌ Database error: {str(e)}")
            return None
        finally:
            conn.close()
    
    def store_test_result(self, test_result):
        """
        Store test execution results in database
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            query = """
            INSERT INTO test_results 
            (test_id, test_case_id, mode, status, total_steps, passed_steps, 
             failed_steps, execution_time, test_data, result_details, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """
            
            cursor.execute(query, (
                test_result['test_id'],
                test_result['test_case_id'],
                test_result['mode'],
                test_result['status'],
                test_result['total_steps'],
                test_result['passed_steps'],
                test_result['failed_steps'],
                test_result['execution_time'],
                json.dumps(test_result['test_data']),
                json.dumps(test_result['step_results']),
                datetime.now()
            ))
            
            conn.commit()
            
            # Get the inserted ID
            cursor.execute("SELECT @@IDENTITY")
            result_id = cursor.fetchone()[0]
            
            print(f"✅ Test result stored with ID: {result_id}")
            return result_id
            
        except Exception as e:
            print(f"❌ Error storing test result: {str(e)}")
            return None
        finally:
            conn.close()
    
    def get_test_result(self, result_id):
        """
        Retrieve test result by ID
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            query = """
            SELECT test_id, test_case_id, mode, status, total_steps, 
                   passed_steps, failed_steps, execution_time, 
                   test_data, result_details, created_at
            FROM test_results 
            WHERE id = ?
            """
            
            cursor.execute(query, (result_id,))
            row = cursor.fetchone()
            
            if row:
                return {
                    'test_id': row[0],
                    'test_case_id': row[1],
                    'mode': row[2],
                    'status': row[3],
                    'total_steps': row[4],
                    'passed_steps': row[5],
                    'failed_steps': row[6],
                    'execution_time': row[7],
                    'test_data': json.loads(row[8]),
                    'result_details': json.loads(row[9]),
                    'created_at': row[10].isoformat()
                }
            return None
            
        except Exception as e:
            print(f"❌ Error retrieving test result: {str(e)}")
            return None
        finally:
            conn.close()
    
    def get_available_test_cases(self, mode=None):
        """
        Get list of available test cases from mode-specific tables
        """
        conn = self.get_connection()
        cursor = conn.cursor()
        
        try:
            if mode:
                # Query specific mode table
                table_name = f"{mode.capitalize()}_TestCases"
                query = f"""
                SELECT DISTINCT test_case_id, COUNT(*) as step_count
                FROM {table_name}
                GROUP BY test_case_id
                ORDER BY test_case_id
                """
                cursor.execute(query)
                
                rows = cursor.fetchall()
                test_cases = []
                for row in rows:
                    test_cases.append({
                        'test_case_id': row[0],
                        'booking_mode': mode,
                        'step_count': row[1]
                    })
            else:
                # Query all mode tables
                modes = ['flight', 'bus', 'train', 'hotel']
                test_cases = []
                
                for booking_mode in modes:
                    try:
                        table_name = f"{booking_mode.capitalize()}_TestCases"
                        query = f"""
                        SELECT DISTINCT test_case_id, COUNT(*) as step_count
                        FROM {table_name}
                        GROUP BY test_case_id
                        ORDER BY test_case_id
                        """
                        cursor.execute(query)
                        rows = cursor.fetchall()
                        
                        for row in rows:
                            test_cases.append({
                                'test_case_id': row[0],
                                'booking_mode': booking_mode,
                                'step_count': row[1]
                            })
                    except Exception as table_error:
                        print(f"⚠️ Table {table_name} not found or accessible: {str(table_error)}")
                        continue
            
            return test_cases
            
        except Exception as e:
            print(f"❌ Error retrieving test cases: {str(e)}")
            return []
        finally:
            conn.close()
