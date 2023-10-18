from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from bs4 import BeautifulSoup

driver = webdriver.Chrome()  # You may need to specify the path to the chromedriver executable

#Google 2FA credentials
username = 'tsoi.dustin@maranathastudents.org'
password = 'AKMRDEj@26'
verification_code = 'your_verification_code'

driver.get('https://maranathahighschool.myschoolapp.com/app/student#login')

username_field = driver.find_element(By.ID, 'Username')
username_field.send_keys(username)

login_button = driver.find_element(By.ID, 'nextBtn')
login_button.click()

#google_login_button = driver.find_element(By.ID, 'login_button_id')
#google_login_button.click()

google_username_field = driver.find_element(By.ID, 'identifierId')
google_username_field.send_keys(username)

next_button = driver.find_element(By.CLASS_NAME, 'VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b')
next_button.click()

google_password_field = driver.find_element(By.CLASS_NAME, 'whsOnd zHQkBf')
google_password_field.send_keys(password)

login_button = driver.find_element(By.CLASS_NAME, 'VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-k8QpJ VfPpkd-LgbsSe-OWXEXe-dgl2Hf nCP5yc AjY5Oe DuMIQc LQeN7 qIypjc TrZEUc lw1w4b')
login_button.click()

#2FA
try:
  login_button = driver.find_element(By.CLASS_NAME, 'VfPpkd-LgbsSe VfPpkd-LgbsSe-OWXEXe-dgl2Hf ksBjEc lKxP2d LQeN7 uRo0Xe TrZEUc lw1w4b')
  login_button.click()
finally:
  pass

verification_code_field = WebDriverWait(driver, 10).until(
    EC.visibility_of_element_located((By.ID, 'verification_code_field_id')))

verification_code_field.send_keys(verification_code)

verify_button = driver.find_element(By.ID, 'verify_button_id')
verify_button.click()

#Wait for the protected page to load
WebDriverWait(driver, 10).until(EC.url_contains('protected_page_url'))

page_html = driver.page_source
soup = BeautifulSoup(page_html,'html_parser')
soup.find_all('p', attrs={"class": "class_name", "id": "id_name"})

driver.quit()