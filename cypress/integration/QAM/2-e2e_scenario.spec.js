/// <reference types="Cypress" />

describe('create and mark-unmark as favorite', ()=> {

    it('login with assertions', ()=> {
        cy.visit('/login')
        cy.title().should('eq', 'Conduit')
        cy.location('protocol').should('eq', 'http:')
        cy.get('input[type="text"]').type('fake-email@gmail.com')
        cy.get('input[type="password"]').type('fakepass')
        cy.get('button[type="submit"]').should('be.visible').click()
        cy.contains('Your Feed').should('be.visible')
    })

    it('create a post', ()=> {
        cy.contains(' New Article ').click()
        cy.url().should('include', '/editor')
        //cy.location('hash').should('include', '#/editor')
        cy.get('[placeholder="Article Title"]').type('Test article')
        cy.get('[placeholder="What\'s this article about?"]').type('Test about')
        cy.get('[placeholder="Write your article (in markdown)"]').type('Test content')
        cy.contains('Publish Article').click()
        cy.url().should('include', 'article')
    })



})