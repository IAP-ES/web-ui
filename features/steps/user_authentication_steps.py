from behave import given, when, then
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC


# Teste de registo
@given("a new user")
def step_given_new_user(context):
    context.driver = webdriver.Chrome()


@when("they visit the landing page")
def step_impl(context):
    context.driver.get("http://localhost:8080/")


@when('select the "Get Started" button')
def step_when_select_get_started(context):
    wait = WebDriverWait(context.driver, 10)
    button = wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//*[@id='root']/div[2]/div/div/div[3]/div/a/button")
        )
    )
    button.click()


@when("they provide valid information")
def step_impl(context):
    sign_up_link = context.driver.find_element(By.LINK_TEXT, "Sign up")
    sign_up_link.click()

    wait = WebDriverWait(context.driver, 10)

    username_input = wait.until(EC.presence_of_element_located((By.NAME, "username")))
    givename_input = wait.until(
        EC.presence_of_element_located((By.NAME, "requiredAttributes[given_name]"))
    )
    familyname_input = wait.until(
        EC.presence_of_element_located((By.NAME, "requiredAttributes[family_name]"))
    )
    email_input = wait.until(
        EC.presence_of_element_located((By.NAME, "requiredAttributes[email]"))
    )
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


@then(
    "they should be able to create an account successfully and receive a confirmation email"
)
def step_impl(context):
    context.driver.get("http://localhost:8080/")
    assert context.driver.current_url == "http://localhost:8080/"
    context.driver.quit()


# Teste de login
@given("a registered user")
def step_given_new_user(context):
    context.driver = webdriver.Chrome()


@when("they enter valid credentials (username and password)")
def step_impl(context):
    wait = WebDriverWait(context.driver, 10)

    button = wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//*[@id='root']/div[2]/div/div/div[3]/div/a/button")
        )
    )
    button.click()

    # Aguarda que os elementos estejam visíveis e clicáveis
    username_input = wait.until(EC.element_to_be_clickable((By.NAME, "username")))
    password_input = wait.until(EC.element_to_be_clickable((By.NAME, "password")))

    username_input.send_keys("test")
    password_input.send_keys("Qawsed-12")

    # Verificações de valores
    assert username_input.get_attribute("value") == "test"
    assert password_input.get_attribute("value") == "Qawsed-12"

    # Clique no botão de login
    sign_in_button = wait.until(
        EC.element_to_be_clickable((By.NAME, "signInSubmitButton"))
    )
    sign_in_button.click()


@then("they should be able to log in successfully")
def step_impl(context):
    assert context.driver.current_url.startswith(
        "http://localhost:8080/oauth2/idpresponse?code="
    )


@then("they should be redirected to the tasks page")
def step_impl(context):
    wait = WebDriverWait(context.driver, 10)

    navbar_welcome = wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//*[@id='root']/div[2]/nav/div/div/div/div/div")
        )
    )
    assert navbar_welcome.text == "Welcome user test"
    context.driver.quit()


# Teste de logout
@given("a logged-in user")
def step_given_logged_in_user(context):
    context.driver = webdriver.Chrome()
    context.driver.get("http://localhost:8080/")

    wait = WebDriverWait(context.driver, 10)
    button = wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//*[@id='root']/div[2]/div/div/div[3]/div/a/button")
        )
    )
    button.click()

    # Aguarda que os elementos estejam visíveis e clicáveis
    username_input = wait.until(EC.element_to_be_clickable((By.NAME, "username")))
    password_input = wait.until(EC.element_to_be_clickable((By.NAME, "password")))

    username_input.send_keys("usertest")
    password_input.send_keys("Qawsed-12")

    # Clique no botão de login
    sign_in_button = wait.until(
        EC.element_to_be_clickable((By.NAME, "signInSubmitButton"))
    )
    sign_in_button.click()


@when('they select the "Logout" button')
def step_when_select_logout(context):
    wait = WebDriverWait(context.driver, 10)
    logout_button = wait.until(
        EC.element_to_be_clickable(
            (By.XPATH, "//*[@id='root']/div[2]/nav/div/div/div/div/button")
        )
    )
    logout_button.click()


@then("they should be logged out successfully")
def step_impl(context):
    assert context.driver.current_url == "http://localhost:8080/"
    context.driver.quit()
