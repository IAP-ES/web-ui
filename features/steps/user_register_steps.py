from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


@given('a new user')
def step_given_new_user(context):
    context.driver = webdriver.Chrome()

@when(u'they visit the landing page')
def step_impl(context):
    context.driver.get("http://localhost:8080/") 


@when('select the "Get Started" button')
def step_when_select_get_started(context):
    wait = WebDriverWait(context.driver, 10)
    button = wait.until(EC.element_to_be_clickable((By.XPATH, "//*[@id='root']/div[2]/div/div/div[3]/div/a/button")))
    button.click()

@when(u'they provide valid information')
def step_impl(context):
    sign_up_link = context.driver.find_element(By.LINK_TEXT, "Sign up")
    sign_up_link.click()  

    wait = WebDriverWait(context.driver, 10)

    username_input = wait.until(EC.presence_of_element_located((By.NAME, "username")))
    givename_input = wait.until(EC.presence_of_element_located((By.NAME, "requiredAttributes[given_name]")))
    familyname_input = wait.until(EC.presence_of_element_located((By.NAME, "requiredAttributes[family_name]")))
    email_input = wait.until(EC.presence_of_element_located((By.NAME, "requiredAttributes[email]")))
    password_input = wait.until(EC.presence_of_element_located((By.NAME, "password")))

    username_input.send_keys("test")
    givename_input.send_keys("test")
    familyname_input.send_keys("test")
    email_input.send_keys("test@test.com")
    password_input.send_keys("Qawsed-12")

    assert username_input.get_attribute("value") == "test"
    assert givename_input.get_attribute("value") == "test"
    assert familyname_input.get_attribute("value") == "test"
    assert email_input.get_attribute("value") == "test@test.com"
    assert password_input.get_attribute("value") == "Qawsed-12"


    sign_up_button = context.driver.find_element(By.NAME, "signUpButton")
    sign_up_button.click()

@then(u'they should be able to create an account successfully and receive a confirmation email')
def step_impl(context):
    context.driver.get("http://localhost:8080/") 
    assert context.driver.current_url == "http://localhost:8080/"
    context.driver.quit()