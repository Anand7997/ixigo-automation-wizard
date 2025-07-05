
from BaseClass import BaseClass
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import (
    NoSuchElementException, 
    TimeoutException, 
    ElementClickInterceptedException
)
import time
from datetime import datetime, timedelta
import re


class IxigoTestClass(BaseClass):
    def __init__(self):
        super().__init__()

    def execute_action(self, action_type, test_data, xpath, element_name):
        """Execute specific action based on action type"""
        try:
            action_type = action_type.upper()

            if action_type == "OPEN_BROWSER":
                self.launch_browser()
                self.driver.get(test_data)
                self.wait_for_spa_ready()

            elif action_type == "CLICK_AND_SELECT":
                if element_name.upper() in ["FROM", "TO", "DESTINATION"]:
                    self.handle_city_selection_fast(test_data, xpath, element_name)
                else:
                    element = self.find_element_with_advanced_wait(xpath)
                    self.perform_robust_click(element)
                    time.sleep(0.3)

            elif action_type == "CLICK_AND_SELECT_DATE":
                self.handle_date_selection_fast(test_data, xpath, element_name)

            elif action_type == "CLICK_QUICK_DATE":
                if (test_data.upper() == "TODAY" or 
                    (test_data.upper() == "TOMORROW" and "bus" in element_name.lower())):
                    self.handle_bus_quick_date_selection(test_data, element_name)
                else:
                    self.handle_quick_date_selection(test_data, element_name)

            elif action_type == "CLICK_BUS_QUICK_DATE":
                self.handle_bus_quick_date_selection(test_data, element_name)

            elif action_type == "CLICK":
                if element_name.upper() == "TRAVELCLASS":
                    self.handle_travel_class_selection_fast(test_data, xpath, element_name)
                elif element_name.upper() == "DONEBUTTON":
                    self.close_travellers_popup_fast(xpath, element_name)
                elif test_data.upper() == "TODAY":
                    self.handle_today_selection(element_name)
                elif test_data.upper() == "TOMORROW" and "bus" in element_name.lower():
                    self.handle_tomorrow_selection_bus(element_name)
                elif test_data.upper() == "TOMORROW":
                    self.handle_tomorrow_selection(element_name)
                elif "day after" in test_data.lower() or test_data.upper() == "DAY-AFTER-TOMORROW":
                    self.handle_day_after_tomorrow_selection(element_name)
                else:
                    click_element = self.find_element_with_advanced_wait(xpath)
                    self.perform_robust_click(click_element)
                    time.sleep(0.3)

            elif action_type == "SELECT_COUNT":
                if element_name.upper() == "ROOMSCOUNT":
                    self.set_count_by_increment("room", int(test_data))
                elif element_name.upper() == "ADULTSCOUNT":
                    self.set_count_by_increment("adult", int(test_data))
                elif element_name.upper() == "CHILDRENCOUNT":
                    children_count = int(test_data)
                    self.set_count_by_increment("children", children_count)
                    if children_count > 0:
                        self.wait_for_child_age_dropdowns(children_count)
                else:
                    self.handle_count_selection_fast(test_data, xpath, element_name)
            
            elif action_type == "CLICK_AND_SELECT_AGE":
                if element_name.upper() == "CHILD 1":
                    self.select_child_age(0, int(test_data))
                elif element_name.upper() == "CHILD 2":
                    self.select_child_age(1, int(test_data))
                elif element_name.upper() == "CHILD 3":
                    self.select_child_age(2, int(test_data))
                else:
                    child_number = re.sub(r'[^0-9]', '', element_name)
                    if child_number:
                        child_index = int(child_number) - 1
                        self.select_child_age(child_index, int(test_data))

            elif action_type == "HANDLE_CHECKBOX":
                self.handle_checkbox_action(test_data, xpath, element_name)

            else:
                print(f"⚠️ Unknown action type: {action_type}")

        except Exception as e:
            print(f"💥 Error executing action '{action_type}': {str(e)}")
            raise

    # Keep all your existing methods from the original class
    def handle_city_selection_fast(self, city_name, xpath, element_name):
        """Fast city selection with minimal waits"""
        try:
            print(f"🏙️ Selecting city: {city_name} for {element_name}")
            
            city_input = self.find_element_with_advanced_wait(xpath)
            self.perform_robust_click(city_input)
            time.sleep(0.3)
            
            self.perform_robust_text_input(city_input, city_name)
            time.sleep(0.8)
            
            auto_complete_selectors = [
                f"//*[contains(text(),'{city_name}')][1]",
                f"//div[contains(@class,'autocomplete')]//*[contains(text(),'{city_name}')]"
            ]
            
            suggestion_clicked = False
            for selector in auto_complete_selectors:
                try:
                    suggestions = self.driver.find_elements(By.XPATH, selector)
                    for suggestion in suggestions:
                        if suggestion.is_displayed() and suggestion.is_enabled():
                            self.perform_robust_click(suggestion)
                            suggestion_clicked = True
                            print(f"✅ City suggestion clicked: {city_name}")
                            break
                    if suggestion_clicked:
                        break
                except Exception:
                    continue
            
            if not suggestion_clicked:
                city_input.send_keys(Keys.ARROW_DOWN, Keys.ENTER)
                print("✅ Used keyboard navigation for city selection")
            
            time.sleep(0.3)

        except Exception as e:
            print(f"❌ Failed to select city: {city_name} - {str(e)}")
            raise

    # Add placeholder methods for missing functionality
    def handle_date_selection_fast(self, date_string, xpath, element_name):
        """Handle fast date selection for calendar inputs"""
        print(f"📅 Selecting date: {date_string} for {element_name}")
        # Your existing date selection logic here
        pass

    def handle_quick_date_selection(self, quick_date_option, element_name):
        """Handle quick date selection"""
        print(f"🚀 Quick date selection: {quick_date_option} for {element_name}")
        # Your existing quick date logic here
        pass

    def handle_bus_quick_date_selection(self, quick_date_option, element_name):
        """Handle bus quick date selection"""
        print(f"🚌 Bus quick date selection: {quick_date_option} for {element_name}")
        # Your existing bus date logic here
        pass

    def handle_today_selection(self, element_name):
        """Handle today selection"""
        print(f"📅 Selecting Today for {element_name}")
        # Your existing today selection logic here
        pass

    def handle_tomorrow_selection(self, element_name):
        """Handle tomorrow selection"""
        print(f"📅 Selecting Tomorrow for {element_name}")
        # Your existing tomorrow selection logic here
        pass

    def handle_tomorrow_selection_bus(self, element_name):
        """Handle tomorrow selection for bus"""
        print(f"🚌 Tomorrow selection for bus: {element_name}")
        # Your existing bus tomorrow logic here
        pass

    def handle_day_after_tomorrow_selection(self, element_name):
        """Handle day after tomorrow selection"""
        print(f"📅 Selecting Day After Tomorrow for {element_name}")
        # Your existing day after tomorrow logic here
        pass

    def handle_travel_class_selection_fast(self, test_data, xpath, element_name):
        """Handle travel class selection"""
        print(f"✈️ Selecting travel class: {test_data}")
        # Your existing travel class logic here
        pass

    def close_travellers_popup_fast(self, xpath, element_name):
        """Close travellers popup"""
        print(f"🔄 Closing travellers popup")
        # Your existing popup close logic here
        pass

    def handle_count_selection_fast(self, test_data, xpath, element_name):
        """Handle count selection"""
        print(f"🔢 Setting count: {test_data} for {element_name}")
        # Your existing count selection logic here
        pass

    def set_count_by_increment(self, count_type, target_count):
        """Set count by increment"""
        print(f"🔢 Setting {count_type} count to {target_count}")
        # Your existing increment logic here
        pass

    def wait_for_child_age_dropdowns(self, children_count):
        """Wait for child age dropdowns"""
        print(f"⏳ Waiting for {children_count} child age dropdowns")
        # Your existing wait logic here
        pass

    def select_child_age(self, child_index, age):
        """Select child age"""
        print(f"👶 Selecting age {age} for child {child_index + 1}")
        # Your existing age selection logic here
        pass

    def handle_checkbox_action(self, test_data, xpath, element_name):
        """Handle checkbox actions"""
        try:
            print(f"🔲 Handling checkbox: {element_name}")
            
            should_be_checked = test_data.upper() in ["TRUE", "1", "YES"]
            checkbox = self.find_checkbox_element(xpath, element_name)
            
            if checkbox is None:
                raise Exception(f"❌ Checkbox element not found: {element_name}")
            
            current_state = checkbox.is_selected()
            print(f"📋 Current: {current_state} | Target: {should_be_checked}")
            
            if current_state != should_be_checked:
                self.driver.execute_script("arguments[0].click();", checkbox)
                time.sleep(0.1)
                
                action_text = "checked" if should_be_checked else "unchecked"
                print(f"✅ {element_name} {action_text}")
            else:
                print(f"✅ {element_name} already in desired state")
            
        except Exception as e:
            print(f"❌ Error with checkbox '{element_name}': {str(e)}")
            raise e

    def find_checkbox_element(self, xpath, element_name):
        """Find checkbox element"""
        if "fc-checkbox" in xpath:
            try:
                return self.driver.find_element(By.ID, "fc-checkbox")
            except Exception:
                pass
        
        try:
            wait = WebDriverWait(self.driver, 3)
            return wait.until(EC.element_to_be_clickable((By.XPATH, xpath)))
        except Exception:
            return None
