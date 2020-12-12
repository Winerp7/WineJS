describe('The Settings Page', () => {
  // runs once before all tests in the block sup
  before(() => {
    // nuke test db and load sample data
    cy.exec('npm run nuke && npm run sample');
    cy.wait(5000)
    // Need to login before each test to have access to /settings url
    cy.login();
    cy.wait(3000)
  });

  beforeEach(() => {
    // Keep using the cookies from first time we login
    // so we don't have to login before each test
    Cypress.Cookies.preserveOnce('connect.sid', 'csrftoken');
    // visit settings page, as all test in this file is about settings
    cy.visit('/settings');
    cy.wait(3000)
  });

  it('should change name', () => {
    const newName = 'Bent Gutten';
    // Check the name is equal to the one we used at login
    // And then change the name to 'Bent Gutten'
    cy.get('[test-cy=setting-name]')
      .click()
      .get('[test-cy=setting-name-input]')
      .should('have.value', Cypress.env('TEST_NAME'))
      .clear() // Clears the input field, ready to type a new name
      .type(newName)
      .should('have.value', newName)
      .get('[test-cy=save-name-btn]')
      .click();

    // Check the new entered name is the one
    // shown in settings after changing it
    cy.get('[test-cy=setting-name]')
      .click()
      .get('[test-cy=setting-name-input]')
      .should('have.value', newName);
  });

  it('should change email', () => {
    const newEmail = 'test@test.com';
    // Check the email is equal to the one we used at login
    // And then change the email to 'test@test.com'
    cy.get('[test-cy=setting-email]')
      .click()
      .get('[test-cy=setting-old-email-input]')
      .should('have.value', Cypress.env('TEST_EMAIL'))
      .get('[test-cy=setting-new-email-input]')
      .type(newEmail)
      .get('[test-cy=save-email-btn]')
      .click();

    // Check the new entered email is the one
    // shown in settings after changing it
    cy.get('[test-cy=setting-email]')
      .click()
      .get('[test-cy=setting-old-email-input]')
      .should('have.value', newEmail);
  });

  // this test is dependent on the change email test
  it('should change password', () => {
    const email = 'test@test.com';
    const password = 'newpass';

    // Change password
    cy.get('[test-cy=setting-password]')
      .click()
      .get('[test-cy=setting-curr-pass]')
      .type(Cypress.env('TEST_PASS'))
      .get('[test-cy=setting-new-pass]')
      .type(password)
      .get('[test-cy=setting-new-pass-repeat]')
      .type(password)
      .get('[test-cy=save-pass-btn]')
      .click();

    // Log out
    cy.visit('/logout');
    // Login with new password

    // clear cookies because we preserve the cookies
    // from first time we login in the beginning
    cy.clearCookies();
    // send login request without having to do it visually
    cy.request({
      method: 'POST',
      url: '/login',
      form: true,
      body: {
        email,
        password,
      },
    });

    // if the cookie is there we should be logged in
    cy.getCookie('connect.sid').should('exist');
  });
});
