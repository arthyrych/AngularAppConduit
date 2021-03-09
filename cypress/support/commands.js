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

// login through ui using creds
Cypress.Commands.add('loginToAppUi', ()=> {
    cy.visit('/login')
    cy.get('[placeholder="Email"]').type('fake-email@gmail.com')
    cy.get('[placeholder="Password"]').type('fakepass')
    cy.get('form').submit()
})

// login with api call and saving token
Cypress.Commands.add('loginToApp', ()=> {

    // login creads
    const userCreds = {
        "user": {
            "email": "fake-email@gmail.com",
            "password": "fakepass"
        }
    }

    // login api call with creds
    cy.request('POST', 'https://conduit.productionready.io/api/users/login', userCreds)
    .its('body').then( body => {

        // saving token from the response body
        const token = body.user.token

        // creating token alias for using token in tests
        cy.wrap(token).as('token')

        // opening homepage with created token in local storage
        cy.visit('/', {
            onBeforeLoad (win){
                win.localStorage.setItem('jwtToken', token)
            }
        })

    })

})