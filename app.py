
from flask import Flask, request, jsonify
from flask_cors import CORS
from database.db_operations import DatabaseOperations
from selenium_automation.selenium_executor import SeleniumExecutor
import json
from datetime import datetime
import traceback

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])  # Your React app URL

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({
        "message": "Ixigo Test Automation API is running", 
        "status": "healthy",
        "timestamp": datetime.now().isoformat()
    })

@app.route('/api/execute-test', methods=['POST'])
def execute_test():
    try:
        # Get request data
        request_data = request.get_json()
        print(f"📥 Received test request: {json.dumps(request_data, indent=2)}")
        
        # Extract test data
        mode = request_data.get('mode')
        test_data = request_data.get('testData', {})
        test_case_id = test_data.get('testCaseId')
        
        if not mode or not test_case_id:
            return jsonify({
                "success": False, 
                "error": "Missing required fields: mode and testCaseId"
            }), 400
        
        print(f"🚀 Executing test for mode: {mode}, test_case_id: {test_case_id}")
        
        # Initialize database operations
        db_ops = DatabaseOperations()
        
        # Get XPath data from database
        xpath_data = db_ops.get_xpath_for_test_case(test_case_id, mode)
        
        if not xpath_data:
            return jsonify({
                "success": False, 
                "error": f"No XPath data found for test case '{test_case_id}' and mode '{mode}'"
            }), 404
        
        print(f"📊 Found {len(xpath_data)} test steps in database")
        
        # Add mode to test_data for URL construction
        test_data['mode'] = mode
        
        # Initialize Selenium executor
        selenium_executor = SeleniumExecutor()
        
        # Execute test with combined data
        test_result = selenium_executor.execute_test(
            mode=mode,
            test_data=test_data,
            xpath_data=xpath_data
        )
        
        # Store results in database
        result_id = db_ops.store_test_result(test_result)
        if result_id:
            test_result['result_id'] = result_id
        
        print(f"✅ Test execution completed - Status: {test_result['status']}")
        
        return jsonify({
            "success": True,
            "result": test_result
        })
        
    except Exception as e:
        error_msg = str(e)
        error_trace = traceback.format_exc()
        
        print(f"❌ Error executing test: {error_msg}")
        print(f"🔍 Full traceback: {error_trace}")
        
        return jsonify({
            "success": False,
            "error": error_msg,
            "details": error_trace if app.debug else "Enable debug mode for detailed error info"
        }), 500

@app.route('/api/test-result/<result_id>', methods=['GET'])
def get_test_result(result_id):
    try:
        db_ops = DatabaseOperations()
        result = db_ops.get_test_result(result_id)
        
        if result:
            return jsonify({"success": True, "result": result})
        else:
            return jsonify({"success": False, "error": "Test result not found"}), 404
            
    except Exception as e:
        print(f"❌ Error retrieving test result: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/test-cases', methods=['GET'])
def get_test_cases():
    """Get available test cases"""
    try:
        mode = request.args.get('mode', None)
        db_ops = DatabaseOperations()
        test_cases = db_ops.get_available_test_cases(mode)
        
        return jsonify({
            "success": True,
            "test_cases": test_cases
        })
        
    except Exception as e:
        print(f"❌ Error retrieving test cases: {str(e)}")
        return jsonify({"success": False, "error": str(e)}), 500

@app.route('/api/health', methods=['GET'])
def detailed_health_check():
    """Detailed health check including database connectivity"""
    try:
        # Test database connection
        db_ops = DatabaseOperations()
        conn = db_ops.get_connection()
        conn.close()
        
        return jsonify({
            "status": "healthy",
            "database": "connected",
            "selenium": "ready",
            "timestamp": datetime.now().isoformat()
        })
        
    except Exception as e:
        return jsonify({
            "status": "unhealthy",
            "database": "error",
            "error": str(e),
            "timestamp": datetime.now().isoformat()
        }), 500

if __name__ == '__main__':
    print("🚀 Starting Ixigo Test Automation API...")
    print("📊 Database: SSMS Integration")
    print("🌐 CORS: Enabled for React Frontend")
    print("🔧 Selenium: Ready for test execution")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
