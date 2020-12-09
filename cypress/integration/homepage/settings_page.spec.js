describe('The Settings Page', () => {
  // runs once before all tests in the block
  before(() => {
    // nuke test db and load sample data
    cy.exec('npm run nuke && npm run sample');
    // Need to login before each test to have access to /settings url
    cy.login();
  });

  beforeEach(() => {
    // Keep using the cookies from first time we login
    // so we don't have to login before each test
    Cypress.Cookies.preserveOnce('connect.sid', 'csrftoken')
    // visit settings page, as all test in this file is about settings
    cy.visit('/settings');
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
      .should('have.value', newEmail)
  });

  it('should change password', () => {
    const newEmail = 'test@test.com';

  });

});
