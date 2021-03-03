/// <reference types="Cypress" />

describe('request-response test suite', ()=> {

    beforeEach(()=> {
        cy.loginToApp()
    })

    it('verify request and response', ()=> {

        // starting Cypress server, listening for the api call, saving the call as an alias (global variable)
        cy.server()
        cy.route('POST', '**/articles').as('postArticles')

        // creating a new article through ui
        cy.contains('New Article').click()
        cy.get('[formcontrolname="title"]').type('This is a title!')
        cy.get('[formcontrolname="description"]').type('This is an article about!')
        cy.get('[formcontrolname="body"]').type('This is content!')
        cy.contains(' Publish Article ').click()

        // waiting for the response, taking the response as an object, asserting what we need
        cy.wait('@postArticles')
        cy.get('@postArticles').then( xhr => {
            console.log(xhr)
            expect(xhr.status).to.equal(200)
            expect(xhr.request.body.article.body).to.equal('This is content!')
            expect(xhr.response.body.article.description).to.equal('This is an article about!')
        })
       
    })

})