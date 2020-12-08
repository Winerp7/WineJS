/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// Importing the Required Modules
const fs = require('fs');

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  console.log("Her er jeg, jeg er vild med dig :)):):):9:9");
  console.log(process.env.TEST_NAME);
  config.env.TEST_NAME = 'Bente Bent'
  config.env.TEST_EMAIL = 'cypress@test.com';
  config.env.TEST_PASS = 'test123';

  // read the variables.env file
  /*
  var envFileArr = fs.readFileSync(`${process.cwd()}/variables.env`, 'utf8').split('\n');

  // get all variables that is related to 'test'
  const envs = []
  envFileArr.forEach((env) => {
    if (env.startsWith('TEST')) {
      // Split by '=' and only take the part on the right side of '='
      envs.push(env.split('=')[1])
    }
  })

  config.env.TEST_NAME = envs[0];
  config.env.TEST_EMAIL = envs[1];
  config.env.TEST_PASS = envs[2];
  */
  return config
}
