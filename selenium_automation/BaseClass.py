
import time
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import (
    NoSuchElementException, 
    TimeoutException, 
    StaleElementReferenceException,
    ElementClickInterceptedException
)
from webdriver_manager.chrome import ChromeDriverManager
import openpyxl
from openpyxl.styles import Font
from openpyxl.utils import get_column_letter


class BaseClass:
    def __init__(self):
        self.driver = None
        self.wait = None
        self.fluent_wait = None
        self.actions = None

    def launch_browser(self):
        """Initialize WebDriver with optimized settings"""
        try:
            # Chrome options for optimized performance
            chrome_options = Options()
            chrome_options.add_argument("--no-sandbox")
            chrome_options.add_argument("--disable-dev-shm-usage")
            chrome_options.add_argument("--disable-blink-features=AutomationControlled")
            chrome_options.add_argument("--remote-allow-origins=*")
            chrome_options.add_experimental_option("excludeSwitches", ["enable-automation"])
            chrome_options.add_experimental_option('useAutomationExtension', False)
            
            # Use WebDriverManager to automatically handle ChromeDriver
            service = Service(ChromeDriverManager().install())
            self.driver = webdriver.Chrome(service=service, options=chrome_options)
            
            # Remove webdriver property
            self.driver.execute_script("Object.defineProperty(navigator, 'webdriver', {get: () => undefined})")
            
            # Configure timeouts
            self.driver.maximize_window()
            self.driver.implicitly_wait(5)
            self.driver.set_page_load_timeout(60)
            
            # Initialize wait objects
            self.wait = WebDriverWait(self.driver, 30)
            self.fluent_wait = WebDriverWait(self.driver, 45, poll_frequency=0.5, 
            ignored_exceptions=[NoSuchElementException, TimeoutException, StaleElementReferenceException])
            
            self.actions = ActionChains(self.driver)
            
            print("✓ Browser launched successfully")
            
        except Exception as e:
            print(f"✗ Error launching browser: {str(e)}")
            raise RuntimeError(f"Failed to launch browser: {str(e)}")

    def find_element_with_advanced_wait(self, xpath_with_alternatives):
        """Find element with multiple XPath options and advanced waiting strategies"""
        if not xpath_with_alternatives or not xpath_with_alternatives.strip():
            raise RuntimeError("XPath is null or empty")
        
        xpaths = [xpath.strip() for xpath in xpath_with_alternatives.split('|')]
        
        for xpath in xpaths:
            try:
                # Try clickable first
                element = self.wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
                if element.is_displayed() and element.is_enabled():
                    return element
            except Exception:
                try:
                    # Try visible
                    element = self.wait.until(EC.visibility_of_element_located((By.XPATH, xpath)))
                    return element
                except Exception:
                    try:
                        # Try fluent wait
                        def find_element(driver):
                            try:
                                el = driver.find_element(By.XPATH, xpath)
                                return el if el and el.is_displayed() else None
                            except Exception:
                                return None
                        
                        element = self.fluent_wait.until(find_element)
                        if element:
                            return element
                    except Exception:
                        continue
        
        raise RuntimeError(f"Element not found with any XPath: {xpath_with_alternatives}")

    def wait_for_spa_ready(self):
        """Wait for SPA to be ready"""
        try:
            self.wait.until(lambda driver: driver.execute_script("return document.readyState") == "complete")
            time.sleep(1)
        except Exception:
            print("SPA ready wait completed")

    def perform_robust_click(self, element):
        """Enhanced click with fallback strategies"""
        for attempt in range(1, 4):
            try:
                self.scroll_to_element(element)
                time.sleep(0.2)
                
                if attempt == 1:
                    element.click()
                elif attempt == 2:
                    self.driver.execute_script("arguments[0].click();", element)
                elif attempt == 3:
                    self.actions.move_to_element(element).click().perform()
                
                print(f"✓ Click successful on attempt {attempt}")
                return
                
            except Exception as e:
                if attempt == 3:
                    raise RuntimeError(f"All click attempts failed: {str(e)}")
                time.sleep(0.3)

    def scroll_to_element(self, element):
        """Scroll to element"""
        try:
            self.driver.execute_script(
                "arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", 
                element
            )
            time.sleep(0.3)
        except Exception:
            print("Could not scroll to element")

    def highlight_element(self, element):
        """Highlight element for debugging"""
        try:
            self.driver.execute_script("arguments[0].style.border='3px solid red';", element)
            time.sleep(0.3)
            self.driver.execute_script("arguments[0].style.border='';", element)
        except Exception:
            pass  # Ignore highlighting errors

    def perform_robust_text_input(self, element, text):
        """Enhanced text input for SPAs"""
        try:
            self.clear_input_field(element)
            time.sleep(0.2)
            
            # Type with realistic speed
            for char in text:
                element.send_keys(char)
                time.sleep(0.05)
            
            # Trigger change events
            self.driver.execute_script("""
                arguments[0].dispatchEvent(new Event('input', {bubbles: true}));
                arguments[0].dispatchEvent(new Event('change', {bubbles: true}));
            """, element)
            time.sleep(0.3)
            
        except Exception:
            # Fallback: Direct JavaScript input
            self.driver.execute_script("""
                arguments[0].value = arguments[1];
                arguments[0].dispatchEvent(new Event('input', {bubbles: true}));
                arguments[0].dispatchEvent(new Event('change', {bubbles: true}));
            """, element, text)

    def clear_input_field(self, element):
        """Clear input field completely"""
        try:
            element.clear()
            element.send_keys(Keys.CONTROL + "a")
            element.send_keys(Keys.DELETE)
            self.driver.execute_script("arguments[0].value = '';", element)
        except Exception:
            print("Could not clear input field")

    def get_cell_value_as_string(self, cell):
        """Get cell value as string (handles different cell types)"""
        if cell is None or cell.value is None:
            return ""
        
        cell_value = cell.value
        
        # Handle different data types
        if isinstance(cell_value, str):
            return cell_value.strip()
        elif isinstance(cell_value, (int, float)):
            # Return as integer string if it's a whole number
            return str(int(cell_value)) if cell_value == int(cell_value) else str(cell_value)
        elif isinstance(cell_value, bool):
            return str(cell_value)
        else:
            return str(cell_value)

    def print_test_step_info(self, tc_id, step_no, description, action_type, values, element_name):
        """Print test step information"""
        print("\n" + "=" * 60)
        print(f"🔄 Test Case: {tc_id} | Step: {step_no}")
        print(f"📋 {description}")
        print(f"⚡ Action: {action_type} | Element: {element_name}")
        if values and values.upper() != "N/A":
            print(f"💾 Data: {values}")
        print("=" * 60)

    def close_browser(self):
        """Close browser"""
        try:
            if self.driver:
                self.driver.quit()
                print("✓ Browser closed successfully")
        except Exception as e:
            print(f"✗ Error closing browser: {str(e)}")

    def navigate_to_url(self, url):
        """Navigate to specified URL"""
        try:
            self.driver.get(url)
            self.wait_for_spa_ready()
            print(f"✓ Navigated to: {url}")
        except Exception as e:
            print(f"✗ Error navigating to URL: {str(e)}")
            raise

    def get_current_url(self):
        """Get current URL"""
        return self.driver.current_url

    def get_page_title(self):
        """Get page title"""
        return self.driver.title
