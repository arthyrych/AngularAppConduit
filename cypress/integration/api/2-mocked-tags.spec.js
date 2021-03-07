/// <reference types="Cypress" />

describe('test suite with mocked tags', ()=> {

    beforeEach(()=> {
        cy.loginToApp()
    })

    it('return and assert mocked tags', ()=> {
        // intercepting the api call, providing mocked response, asserting ui info was changed to the mocked one
        cy.intercept('GET', '**/tags', {fixture: 'tags.json'})
        cy.get('.tag-list')
            .should('contain', 'cypress')
            .and('contain', 'automation')
            .and('contain', 'test')
    })

})