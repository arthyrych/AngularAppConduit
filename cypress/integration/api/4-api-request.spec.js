/// <reference types="Cypress" />

describe('test suite with API calls', ()=> {

    it('delete post test', () => {

        // user creds for login
        const userCreds = {
            "user": {
                "email": "fake-email@gmail.com",
                "password": "fakepass"
            }
        }

        // content for the new article
        const bodyRequest = {
            "article": {
                "tagList": [],
                "title": "API request from Postman",
                "description": "API testing",
                "body": "ANGULAR is very good"
            }
        }

        // sending login request and getting token
        cy.request('POST', 'https://conduit.productionready.io/api/users/login', userCreds)
        .its('body').then( body => {
            const token = body.user.token

            // posting a new article
            cy.request({
                url: 'https://conduit.productionready.io/api/articles/',
                headers: {'Authorization': 'Token ' + token},
                method: 'POST',
                body: bodyRequest
            }).then( response => {
                expect(response.status).to.equal(200)
            })

            // deleting the article through UI
            cy.loginToApp()
            cy.contains('Global Feed').click()
            cy.get('.article-preview').first().click()
            cy.get('.article-actions').contains('Delete Article').click()

            // verifying the article was deleted
            cy.request({
                url: 'https://conduit.productionready.io/api/articles?limit=10&offset=0',
                headers: {'Authorization': 'Token ' + token},
                method: 'GET'
            }).its('body').then( body => {
                expect(body.articles[0].title).not.to.equal('API request from Postman')
            })
        })

    })

})