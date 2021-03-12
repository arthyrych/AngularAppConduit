/// <reference types="Cypress" />

describe('test suite with API calls', ()=> {

    beforeEach(() => {
        cy.loginToApp()
    })

    it('post and delete article in global feed', () => {

        // id for the article
        const id = Date.now()

        // content for the new article request
        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "API request from Postman (title) " + id,
                "description": "API request from postman (description)",
                "body": "API request from postman (body)"
            }
        }

        // getting token from our loginToApp command
        cy.get('@token').then( token => {

            // posting a new article using saved token
            cy.request({
                method: 'POST',
                url: Cypress.env('apiUrl') + 'api/articles/',
                headers: {'Authorization': 'Token ' + token},
                body: bodyRequest
            }).then( response => {
                console.log(response)
                expect(response.status).to.equal(200)
            })

            // deleting the article through UI
            cy.contains('Global Feed').click()
            cy.get('.article-preview').first().click()
            cy.get('.article-actions').contains('Delete Article').click()

            // verifying the article was deleted
            cy.request({
                method: 'GET',
                url: Cypress.env('apiUrl') + 'api/articles?limit=10&offset=0',
                headers: {'Authorization': 'Token ' + token}
            }).its('body').then( body => {
                console.log(body)
                expect(body.articles[0].title).not.to.equal('API request from Postman (title) ' + id)
            })
        })

    })

})