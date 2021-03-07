/// <reference types="Cypress" />

describe('request-response test suite', ()=> {

    beforeEach(()=> {
        cy.loginToApp()
    })

    it('intercept, verify request and response', ()=> {

        // intercepting the api call, saving the call as an alias (global variable)

        //cy.intercept('POST', '**/articles').as('postArticles')
        cy.intercept({method: 'POST', path: '**/articles'}).as('postArticles')

        // creating a new article through ui
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title!')
        cy.get('[formcontrolname="description"]').type('This is a description!')
        cy.get('[formcontrolname="body"]').type('This is content!')
        cy.contains(' Publish Article ').click()

        // waiting for the response, taking the response as an object, making assertions for request and response
        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr => {
            console.log(xhr)
            expect(xhr.request.body.article.body).to.equal('This is content!')
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.response.body.article.description).to.equal('This is a description!')
        })
       
    })

    it('intercept, modify, verify request and response', ()=> {

        // intercepting the api call, modifying it, saving the call as an alias (global variable)
        cy.intercept({method: 'POST', path: '**/articles'}, (req) => {
            req.body.article.title = 'This is intercepted and modified title'
            req.body.article.description = 'This is interecepted and modified description'
        }).as('postArticles')

        // creating a new article through ui
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title created through UI!')
        cy.get('[formcontrolname="description"]').type('This is a discription created through UI!')
        cy.get('[formcontrolname="body"]').type('This is content created through UI!')
        cy.contains('Publish Article').click()

        // waiting for the response, taking the response as an object, making assertions for request and response
        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr => {

            console.log(xhr)

            // asserting request
            expect(xhr.request.body.article.title).to.equal('This is intercepted and modified title')
            expect(xhr.request.body.article.description).to.equal('This is interecepted and modified description')
            expect(xhr.request.body.article.body).to.equal('This is content created through UI!')

            // asserting response
            expect(xhr.response.statusCode).to.equal(200)
            expect(xhr.response.body.article.title).to.equal('This is intercepted and modified title')
            expect(xhr.response.body.article.description).to.equal('This is interecepted and modified description')
            expect(xhr.response.body.article.body).to.equal('This is content created through UI!')
        })
       
    })

})