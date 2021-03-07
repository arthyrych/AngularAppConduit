/// <reference types="Cypress" />

describe('test suite with intercept method instead server and route', ()=> {

    beforeEach(()=> {
        cy.loginToApp()
    })

    it('1 intercepting and modifying the request and response', ()=> {

        // cy.intercept('POST', '**/articles', (req) => {
        //     req.body.article.description = 'This is the intercepted request description'
        // }).as('postArticles')

        cy.intercept('POST', '**/articles', (req) => {
            req.reply( res => {
                expect(res.body.article.description).to.equal('This is an article about!')
                res.body.article.description = 'This is the intercepted request description'
            })
        }).as('postArticles')

        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title!')
        cy.get('[formcontrolname="description"]').type('This is an article about!')
        cy.get('[formcontrolname="body"]').type('This is content!')
        cy.contains(' Publish Article ').click()

        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr => {
            console.log(xhr)
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is content!')
            expect(xhr.response.body.article.description).to.equal('This is the intercepted request description')
        })
       
    })


    it('2 return mocked tags', ()=> {
        cy.intercept({method: 'GET', path: 'tags'}, {fixture: 'tags.json'})
        cy.get('.tag-list').should('contain', 'cypress').and('contain', 'automation').and('contain', 'test')
    })


    it('3 verify global feed likes count', ()=> {
        cy.intercept('GET', '**/articles*', {fixture: 'articles.json'})
        cy.intercept('GET', '**/articles/feed*', {"articles":[],"articlesCount":0})

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
            cy.intercept('POST', '**/articles/' + articleSlug + '/favorite', file)
        })

        cy.get('app-article-list button').eq(1).click().should('contain', '6')
    })

})