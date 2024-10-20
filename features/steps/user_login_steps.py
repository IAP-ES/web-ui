from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


@given('a registered user')
def step_given_new_user(context):
    context.driver = webdriver.Chrome()

@when(u'they enter valid credentials (username and password)')
def step_impl(context):
    wait = WebDriverWait(context.driver, 10)

    # Aguarda que os elementos estejam visíveis e clicáveis
    username_input = wait.until(EC.element_to_be_clickable((By.NAME, "username")))
    password_input = wait.until(EC.element_to_be_clickable((By.NAME, "password")))

    username_input.send_keys("test")
    password_input.send_keys("Qawsed-12")
    
    # Verificações de valores
    assert username_input.get_attribute("value") == "test"
    assert password_input.get_attribute("value") == "Qawsed-12"

    # Clique no botão de login
    sign_in_button = wait.until(EC.element_to_be_clickable((By.NAME, "signInSubmitButton")))
    sign_in_button.click()

@then(u'they should be able to log in successfully')
def step_impl(context):
    assert context.driver.current_url.startswith("http://localhost:8080/oauth2/idpresponse?code=")
    

@then(u'they should be redirected to the tasks page')
def step_impl(context):
    wait = WebDriverWait(context.driver, 10)

    navbar_welcome = wait.until(EC.element_to_be_clickable((By.XPATH, "//*[@id='root']/div[2]/nav/div/div/div/div/div")))
    assert navbar_welcome.text == "Welcome user test"
    context.driver.quit()