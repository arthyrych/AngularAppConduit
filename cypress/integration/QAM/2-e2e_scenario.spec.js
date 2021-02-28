/// <reference types="Cypress" />

describe('login, create post and mark-unmark as favorite', ()=> {

    const id = Date.now()

    it('login with assertions', ()=> {
        cy.visit('https://react-redux.realworld.io/#/login')
        cy.title().should('eq', 'Conduit')
        cy.location('protocol').should('eq', 'https:')
        cy.get('input[placeholder="Email"]').type('fake-email@gmail.com')
        cy.get('input[placeholder="Password"]').type('fakepass')
        cy.get('form').submit()
        cy.contains('Your Feed', {timeout: 10000}).should('be.visible')
    })

    it('create a post with assertions', ()=> {
        cy.contains('New Post').click()
        cy.hash().should('include', '/editor')
        //cy.location('hash').should('include', '#/editor')
        cy.get('[placeholder="Article Title"]').type('Test article ' + id)
        cy.get('[placeholder="What\'s this article about?"]').type('Test about')
        cy.get('[placeholder="Write your article (in markdown)"]').type('Test content')
        cy.contains('Publish Article').click()
        cy.url().should('include', 'article')
    })

    it('mark-unmark as favorite with assertions', ()=> {
        cy.get('.nav-link').contains('arthyrych').click()
        cy.contains('My Articles').should('be.visible')
        cy.get('.ion-heart').first().click()
        cy.contains('Favorited Articles').click()
        cy.url().should('include', '/favorites')
        cy.get('.ion-heart').first().click()
        cy.reload()
        cy.contains('No articles are here... yet.').should('be.visible')
        // cy.go('back')
        // cy.go(-1)
        // cy.go('forward')
        // cy.go(1)
    })

})