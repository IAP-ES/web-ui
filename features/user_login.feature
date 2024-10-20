Feature: User Login

  Scenario: Login with Credentials
    Given a registered user
    When they visit the landing page
    And select the "Get Started" button
    When they enter valid credentials (username and password)
    Then they should be able to log in successfully
    And they should be redirected to the tasks page