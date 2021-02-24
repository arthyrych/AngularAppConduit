describe('create and mark-unmark as favorite', ()=> {

    it('sign in', ()=> {
        cy.visit('https://react-redux.realworld.io/#/login')
        cy.title().should('eq', 'Conduit')
        cy.location('protocol').should('eq', 'https:')
        cy.get('input[type="email"]').type('fake@gmail.com')
        cy.get('input[type="password"]').type('fakepass')
        cy.get('button[type="submit"]').should('be.visible').click()
        cy.contains('Your Feed').should('be.visible')
    })

    it('create a post', ()=> {
        cy.contains('New Post').click()
        cy.hash().should('include', '#/editor')
        // cy.location('hash').should('include', '#/editor')
        cy.get('[placeholder="Article Title"]').type('Test article')
        cy.get('[placeholder="What\'s this article about?"]').type('Test about')
        cy.get('[placeholder="Write your article (in markdown)"]').type('Test content')
        cy.contains('Publish Article').click()
        cy.url().should('include', 'article')
    })

})