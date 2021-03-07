/// <reference types="Cypress" />

describe('test suite with mocked articles', ()=> {

    beforeEach(()=> {
        cy.loginToApp()
    })

    it('verify global feed likes count with mocked response', ()=> {
        // intercepting api calls and providing mocked responses
        cy.intercept('GET', '**/articles*', {fixture: 'articles.json'})
        cy.intercept('GET', '**/articles/feed*', {"articles":[],"articlesCount":0})

        cy.contains('Global Feed').click()

        // likes count assertion (cypress)
        cy.get('app-article-list button').then( buttons => {
            cy.wrap(buttons).first().should('contain', '1')
            cy.wrap(buttons).eq(1).should('contain', '5')
        })

        // likes count assertion (chai)
        cy.get('app-article-list button').then( listOfButtons => {
            expect(listOfButtons[0]).to.contain('1')
            expect(listOfButtons[1]).to.contain('5')
        })

        // modifying mock file, intercepting the api call, providing mocked and modified response
        cy.fixture('articles').then( file => {
            const articleSlug = file.articles[1].slug
            cy.intercept('POST', '**/articles/' + articleSlug + '/favorite', file)
        })

        // asserting likes count from the mocked response
        cy.get('app-article-list button')
            .eq(1)
            .click()
            .should('contain', '6')
    })

})