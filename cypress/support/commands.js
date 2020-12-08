// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

/**
 * Logs the user by making API call to POST /login.
 * Make sure "cypress.json" + CYPRESS_ environment variables
 * have username and password values set.
 */
Cypress.Commands.add('login', () => {
  const email = Cypress.env('TEST_EMAIL')
  const password = Cypress.env('TEST_PASS')

  // it is ok for the email to be visible in the Command Log
  expect(email, 'email was set').to.be.a('string').and.not.be.empty
  // but the password value should not be shown
  if (typeof password !== 'string' || !password) {
    throw new Error('Missing password value, set using CYPRESS_password=...')
  }

  cy.request({
    method: 'POST',
    url: '/login',
    form: true,
    body: {
      email,
      password
    }
  })
  cy.getCookie('connect.sid').should('exist')
})
