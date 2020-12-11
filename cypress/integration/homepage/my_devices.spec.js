describe('The My Devices Page', () => {
  // runs once before all tests in the block :)
  before(() => {
    cy.exec('npm run nuke && npm run sample');
    cy.login();
  });

  beforeEach(() => {
    // Keep using the cookies from first time we login
    // so we don't have to login before each test
    Cypress.Cookies.preserveOnce('connect.sid', 'csrftoken');
    // visit nodes page, as all test in this file is about nodes
    cy.visit('/nodes', { timeout: 30000 });

  });

  it.skip('should check there is a Master node', () => {
    cy.contains('Master node')
  });

  it.skip('should edit of Slave node with nodeID SomeNodeID2', () => {
    // Properties of the node we test
    const name = 'SomeNode2'
    const nodeID = 'SomeNodeID2'
    const status = 'Offline'

    // Checks that all the properties match
    // if so click the edit button
    cy.get(`[test-cy=node-name-${name}]`)
      .get(`[test-cy=nodeID-${nodeID}]`)
      .get(`[test-cy=node-status-${status}]`)
      .get(`[test-cy=edit-node-btn-${nodeID}]`)
      .click()

    // edit node information

      //.get('[test-cy=node-name]')
      //.should('have.value', 'SomeNode2')

  });


});
