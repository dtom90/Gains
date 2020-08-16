describe('New Workout', () => {
  it('Should Create a Workout', () => {
    cy.visit('http://localhost:8080/')
    
    cy.get('a.button')
      .contains('New Workout')
      .click()
    
    cy.get('.navbar .title')
      .contains('New Workout')
      .should('be.visible')
    
    cy.get('.item-input .item-label').contains('Name')
      .siblings('.item-input-wrap').find('input[type="text"]')
      .as('nameInput')
      .should('have.attr', 'placeholder', 'Workout Name')
      .should('be.visible')
    
    cy.get('.item-input .item-label').contains('Exercise 1')
      .siblings('.item-input-wrap').find('input[type="text"]')
      .as('exercise1Input')
      .should('have.attr', 'placeholder', 'Exercise Name')
      .should('be.visible')
    
    cy.get('.item-input .item-label').contains('Rounds')
      .siblings('.item-input-wrap').find('input[type="number"]')
      .as('roundsInput')
      .should('be.visible')
    
    cy.get('@nameInput').type('My Workout')
    
    cy.get('input').should('have.length', 3)
    
    cy.get('@exercise1Input').type('Push-Ups')
    
    cy.get('input').should('have.length', 6)
    
    cy.get('.item-input .item-label').contains('Target weight:')
      .siblings('.item-input-wrap').find('input[type="number"]')
      .should('be.visible')
      .should('have.value', 0)
    
    cy.get('.item-input .item-label').contains('Target reps:')
      .siblings('.item-input-wrap').find('input[type="number"]')
      .should('be.visible')
      .should('have.value', 1)
    
    cy.get('.item-input .item-label').contains('Exercise 2')
      .siblings('.item-input-wrap').find('input[type="text"]')
      .as('exercise2Input')
      .should('have.attr', 'placeholder', 'Exercise Name')
      .should('be.visible')
    
    cy.get('@exercise2Input').type('Pull-Ups')
    
    cy.get('input').should('have.length', 10)
    
    cy.get('.item-input .item-label').contains('Rest:')
      .siblings('.item-input-wrap').find('input[type="number"]')
      .as('restInput')
      .should('be.visible')
      .should('have.value', 30)
    
    cy.get('@exercise2Input').parents('li')
      .find('.item-input .item-label').contains('Target weight:')
      .siblings('.item-input-wrap').find('input[type="number"]')
      .as('exercise2weight')
      .should('be.visible')
      .should('have.value', 0)
    
    cy.get('@exercise2Input').parents('li')
      .find('.item-input .item-label').contains('Target reps:')
      .siblings('.item-input-wrap').find('input[type="number"]')
      .as('exercise2reps')
      .should('be.visible')
      .should('have.value', 1)
    
    cy.get('.item-input .item-label').contains('Exercise 3')
      .siblings('.item-input-wrap').find('input[type="text"]')
      .should('have.attr', 'placeholder', 'Exercise Name')
      .should('be.visible')
    
    cy.get('@restInput')
      .type('{selectall}60')
      .should('have.value', 60)
    
    cy.get('@exercise2weight')
      .type('{selectall}15')
      .should('have.value', 15)
    
    cy.get('@exercise2reps')
      .type('{selectall}6')
      .should('have.value', 6)
    
    cy.get('@roundsInput')
      .type('{selectall}3')
      .should('have.value', 3)
    
    cy.get('.button').contains('Create Workout').click()
  })
})
