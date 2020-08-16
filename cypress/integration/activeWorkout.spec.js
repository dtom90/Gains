describe('Active Workout', () => {
  beforeEach(() => {
    cy.visit('/')
    
    cy.get('a.button')
      .contains('Circuit')
      .click()
    
    cy.get('.navbar .title-large')
      .contains('Circuit')
      .should('be.visible')
    
    cy.get('.button')
      .contains('Start Workout')
      .click('bottom')
    
    cy.get('.navbar .title-large')
      .contains('Circuit')
      .should('be.visible')
    
    cy.get('.exercise-block').contains('Now:').should('be.visible')
    cy.get('.exercise-block').contains('Push-ups').should('be.visible')
    cy.get('.exercise-block').contains('1 rep').should('be.visible')
    cy.get('.exercise-block .button').contains('Done').should('be.visible')
    
    cy.get('.toolbar-bottom').contains('Round 1 of 2')
    cy.get('.toolbar-bottom').contains('Progress: 0 %')
  })
  
  it('should allow modification of lbs. and reps with custom values', () => {
    cy.get('.exercise-block .button').contains('Done').click()
    
    cy.get('.exercise-block.bg-color-green').contains('Completed:').should('be.visible')
    cy.get('.exercise-block.bg-color-green').contains('Push-ups').should('be.visible')
    
    cy.get('.exercise-block.bg-color-green .item-input-wrap')
      .siblings('.item-label').contains('lbs.').should('be.visible')
      .parent('.item-label').siblings('.item-input-wrap').find('input').should('have.value', 0)
      .parents('.item-input').should('not.have.class', 'item-input-focused')
    
    cy.get('.exercise-block.bg-color-green .item-input-wrap')
      .siblings('.item-label').contains('reps').should('be.visible')
      .parent('.item-label').siblings('.item-input-wrap').find('input').should('have.value', 1)
      .parents('.item-input').should('have.class', 'item-input-focused')
    
    cy.get('.button').contains('Enter').should('be.visible')
    
    cy.get('.sheet-modal.picker .picker-item').contains('1').should('be.visible')
    cy.get('.sheet-modal.picker .picker-item').contains('2').should('be.visible')
    cy.get('.sheet-modal.picker .picker-item').contains('3').should('be.visible')
    cy.get('.sheet-modal.picker .picker-item').contains('4')
    cy.get('.sheet-modal.picker .picker-item').contains('5')
    
    cy.get('.sheet-modal.picker .picker-item').contains('5').click()
    
    cy.get('.exercise-block.bg-color-green .item-input-wrap')
      .siblings('.item-label').contains('reps').should('be.visible')
      .parent('.item-label').siblings('.item-input-wrap').find('input').should('have.value', 5)
    
    cy.get('.exercise-block.bg-color-green .item-input-wrap')
      .siblings('.item-label').contains('lbs.').should('be.visible')
      .parent('.item-label').siblings('.item-input-wrap').find('input').click()
      .parents('.item-input').should('have.class', 'item-input-focused')
    
    cy.get('.exercise-block.bg-color-green .item-input-wrap')
      .siblings('.item-label').contains('reps').should('be.visible')
      .parent('.item-label').siblings('.item-input-wrap').find('input')
      .parents('.item-input').should('not.have.class', 'item-input-focused')
    
    cy.get('.sheet-modal.picker .picker-item').contains('+/- 5').should('be.visible')
    cy.get('.sheet-modal.picker .picker-item').contains('+/- 1').should('be.visible')
    cy.get('.sheet-modal.picker .picker-item').contains('0').should('be.visible')
    cy.get('.sheet-modal.picker .picker-item').contains('5').should('be.visible')
    cy.get('.sheet-modal.picker .picker-item').contains('10').should('be.visible')
    
    cy.get('.sheet-modal.picker .picker-item').contains('10').click()
    
    cy.get('.exercise-block.bg-color-green .item-input-wrap')
      .siblings('.item-label').contains('lbs.').should('be.visible')
      .parent('.item-label').siblings('.item-input-wrap').find('input').should('have.value', 10)
    
    cy.get('.exercise-block .button').contains('Enter').click()
    
    cy.get('.exercise-block').contains('Completed:').should('be.visible')
    cy.get('.exercise-block').contains('Push-ups').should('be.visible')
    cy.get('.exercise-block').contains('10 lbs. × 5 reps').should('be.visible')
    
    cy.get('.rest-block').contains(/Rest: \d{1,2}/).should('be.visible')
    cy.get('.rest-block').contains('Next:').should('be.visible')
    cy.get('.rest-block').contains('Pull-ups').should('be.visible')
    cy.get('.rest-block').contains('15 lbs. × 6 reps').should('be.visible')
  })
  
  it('should count down seconds during rest', () => {
    cy.get('.exercise-block .button').contains('Done').click()
    cy.get('.exercise-block .button').contains('Enter').click()
    cy.get('.rest-block .button').contains('Skip Rest').click()
    
    cy.get('.exercise-block .button').contains('Done').click()
    cy.get('.exercise-block .button').contains('Enter').click()
    
    cy.get('.rest-block').contains('Rest: 3').should('be.visible')
    cy.get('.rest-block').contains('Rest: 2').should('be.visible')
    cy.get('.rest-block').contains('Rest: 1').should('be.visible')
    
    cy.get('.exercise-block').contains('Now:').should('be.visible')
    cy.get('.exercise-block').contains('Push-ups').should('be.visible')
    cy.get('.exercise-block').contains('1 rep').should('be.visible')
    cy.get('.exercise-block .button').contains('Done').should('be.visible')
  })
  
  it('should allow skipping rest', () => {
    cy.get('.exercise-block .button').contains('Done').click()
    cy.get('.exercise-block .button').contains('Enter').click()
    
    cy.get('.rest-block').contains('Rest: 30').should('be.visible')
    cy.get('.rest-block .button').contains('Skip Rest').click()
    
    cy.get('.exercise-block').contains('Now:').should('be.visible')
    cy.get('.exercise-block').contains('Pull-ups').should('be.visible')
    cy.get('.exercise-block').contains('15 lbs.').should('be.visible')
    cy.get('.exercise-block').contains('6 reps').should('be.visible')
    cy.get('.exercise-block .button').contains('Done').should('be.visible')
  })
  
  it.only('should display finished workout', () => {
    cy.get('.exercise-block .button').contains('Done').click()
    cy.get('.exercise-block .button').contains('Enter').click()
    cy.get('.rest-block .button').contains('Skip Rest').click()
    
    cy.get('.exercise-block .button').contains('Done').click()
    cy.get('.exercise-block .button').contains('Enter').click()
    cy.get('.rest-block .button').contains('Skip Rest').click()
    
    cy.get('.exercise-block .button').contains('Done').click()
    cy.get('.exercise-block .button').contains('Enter').click()
    cy.get('.rest-block .button').contains('Skip Rest').click()
    
    cy.get('.exercise-block .button').contains('Done').click()
    cy.get('.exercise-block .button').contains('Enter').click()
    
    cy.get('.button').contains('Finish Workout').should('be.visible')
    cy.get('.exercise-block').contains('Completed:').should('be.visible')
    cy.get('.exercise-block').contains('Pull-ups').should('be.visible')
    cy.get('.exercise-block').contains('15 lbs. × 6 reps').should('be.visible')
    
    cy.get('.button').contains('Finish Workout').click()
    
    cy.get('.block-title').contains('Last Workout:').should('be.visible')
      .parent('.block').find('p').contains(/\d{1,2}\/\d{1,2}\/\d{4}, \d{1,2}:\d{2}:\d{2} [AP]M/).should('be.visible')
      .parents('.block').find('li').contains('Push-ups Round 1 1 rep')
      .parents('.block').find('li').contains('Pull-ups Round 1 15 lbs. × 6 reps')
      .parents('.block').find('li').contains('Push-ups Round 2 1 rep')
      .parents('.block').find('li').contains('Pull-ups Round 2 15 lbs. × 6 reps')
  })
})
