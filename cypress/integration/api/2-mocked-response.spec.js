/// <reference types="Cypress" />

describe('test suite with mocked responses', ()=> {

    beforeEach(()=> {
        cy.server()
        cy.loginToApp()
    })

    it('return mocked tags', ()=> {
        cy.route('GET', '**/tags', 'fixture:tags.json')
        cy.get('.tag-list').should('contain', 'cypress').and('contain', 'automation').and('contain', 'test')
    })

    it('verify global feed likes count', ()=> {
        cy.route('GET', '**/articles*', 'fixture:articles.json')
        cy.route('GET', '**/articles/feed*', '{"articles":[],"articlesCount":0}')

        cy.contains('Global Feed').click()

        // cypress assertion
        cy.get('app-article-list button').then( buttons => {
            cy.wrap(buttons).first().should('contain', '1')
            cy.wrap(buttons).eq(1).should('contain', '5')
        })

        // chai assertion
        cy.get('app-article-list button').then( listOfButtons => {
            expect(listOfButtons[0]).to.contain('1')
            expect(listOfButtons[1]).to.contain('5')
        })

        cy.fixture('articles').then( file => {
            const articleSlug = file.articles[1].slug
            cy.route('POST', '**/articles/' + articleSlug + '/favorite', file)
        })

        cy.get('app-article-list button').eq(1).click().should('contain', '6')
    })

})