describe('Home Page', () => {
  it('Shows the home page', () => {
    cy.visit('/')
    
    cy.get('.navbar .title').contains('GainsTrack').should('be.visible')
    cy.contains('Workouts').should('be.visible')
    cy.get('.button').contains('New Workout').should('be.visible')
    
    cy.get('.button > .icon').contains('menu').click()
    cy.contains('Data').should('be.visible')
    cy.get('.button').contains('View Local Data').should('be.visible')
  })
})
