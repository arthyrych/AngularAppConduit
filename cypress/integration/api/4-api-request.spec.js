/// <reference types="Cypress" />

describe('test suite with API calls', ()=> {

    it('post and delete article in global feed', () => {

        // id for the article
        const id = Date.now()

        // user creds for the login request
        const userCreds = {
            "user": {
                "email": "fake-email@gmail.com",
                "password": "fakepass"
            }
        }

        // content for the new article request
        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "API request from Postman (title) " + id,
                "description": "API request from postman (description)",
                "body": "API request from postman (body)"
            }
        }

        // sending login request with user creds, getting and saving token
        cy.request('POST', 'https://conduit.productionready.io/api/users/login', userCreds)
        .its('body').then( body => {
            const token = body.user.token

            // posting a new article
            cy.request({
                method: 'POST',
                url: 'https://conduit.productionready.io/api/articles/',
                headers: {'Authorization': 'Token ' + token},
                body: bodyRequest
            }).then( response => {
                console.log(response)
                expect(response.status).to.equal(200)
            })

            // deleting the article through UI
            cy.loginToApp()
            cy.contains('Global Feed').click()
            cy.get('.article-preview').first().click()
            cy.get('.article-actions').contains('Delete Article').click()

            // verifying the article was deleted
            cy.request({
                method: 'GET',
                url: 'https://conduit.productionready.io/api/articles?limit=10&offset=0',
                headers: {'Authorization': 'Token ' + token}
            }).its('body').then( body => {
                console.log(body)
                expect(body.articles[0].title).not.to.equal('API request from Postman (title) ' + id)
            })
        })

    })

})