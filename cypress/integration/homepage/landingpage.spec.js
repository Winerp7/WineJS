describe('The Home Page', () => {
  // runs once before all tests in the block
  before(() => {
    // nuke test db and load sample data
    cy.exec('npm run nuke && npm run sample');
  });

  it('should log in using cy.request', () => {
    cy.login();
  });

  it('should login visually', () => {
    // Visit homepage
    cy.visit('/');
    // Open the login modal
    cy.contains('Log in').click();
    // Enter credentials in the modal
    cy.get('#sign-in-username')
      .type(Cypress.env('TEST_EMAIL'))
      .should('have.value', Cypress.env('TEST_EMAIL'));

    cy.get('#sign-in-password')
      .type(Cypress.env('TEST_PASS'))
      .should('have.value', Cypress.env('TEST_PASS'));

    // Click sign in
    cy.get('#formLoginBtn').click();
    // Checks cookie is set upon login
    cy.getCookies().should('have.length', 1);

    // Should be on a new URL which includes '/dashboard'
    cy.url().should('include', '/dashboard');
  });

  // TODO: Test logout visually


  it.skip('should register user', () => {
    // Visit homepage
    cy.visit('/');
    // Open the register modal
    cy.get('#signUpBtn').click();
    // Enter credentials in the modal
    cy.get('#register-name')
      .type('Temporary User')
      .should('have.value', 'Temporary User');

    cy.get('#register-email')
      .type('temporary@email.com')
      .should('have.value', 'temporary@email.com');

    cy.get('#register-password')
      .type('temppass')
      .should('have.value', 'temppass');

    cy.get('#register-password-confirm')
      .type('temppass')
      .should('have.value', 'temppass');

    // Click register
    cy.get('#registerBtn').click();

    // Should be redirected to '/dashboard'
    cy.url().should('include', '/dashboard');

    // remove the registered user to not interfer with other test
    cy.exec('npm run nuke && npm run sample');
  });


  // TODO: test register and login secondary modals


});
