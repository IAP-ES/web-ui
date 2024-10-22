Feature: User Authentication

  Scenario: Register with Credentials
    Given a new user
    When they visit the landing page
    And select the "Get Started" button
    When they provide valid information
    Then they should be able to create an account successfully and receive a confirmation email

  Scenario: Login with Credentials
    Given a registered user
    When they visit the landing page
    And select the "Get Started" button
    When they enter valid credentials (username and password)
    Then they should be able to log in successfully
    And they should be redirected to the tasks page
  
  Scenario: Logout from Account
    Given a logged-in user
    When they select the "Logout" button
    Then they should be logged out successfully