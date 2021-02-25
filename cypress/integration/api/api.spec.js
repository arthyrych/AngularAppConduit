describe('BE test suite', ()=> {

    beforeEach(()=> {
        cy.loginToApp()
    })

    it('should log in', ()=> {
        cy.log('Yeaah!')
    })
})