describe('login', ()=> {

    it('sign in', ()=> {
        cy.visit('https://react-redux.realworld.io/#/login')
        cy.get('input[type="email"]').type('fake@gmail.com')
        cy.get('input[type="password"]').type('fakepass')
        cy.get('button[type="submit"]').should('be.visible').click()
    })

})
