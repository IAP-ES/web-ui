Feature: User Registration

  Scenario: Register with Credentials
    Given a new user
    When they visit the landing page
    And select the "Get Started" button
    When they provide valid information
    Then they should be able to create an account successfully and receive a confirmation email