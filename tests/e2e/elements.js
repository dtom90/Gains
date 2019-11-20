import { Selector } from 'testcafe'

const title = text => Selector('div.title').withExactText(text)
const blockTitle = text => Selector('div.block-title').withExactText(text)
const blockText = text => Selector('div.block > p').withExactText(text)
const button = text => Selector('a.button').withExactText(text)
const inputGroup = (label, { type, placeholder }) => Selector('li')
  .find('div.item-label').withExactText(label)
  .sibling('div.item-input-wrap')
  .child(`input[type="${type}"]${placeholder ? `[placeholder="${placeholder}"]` : ''}`)
const listItem = text => Selector('div.item-inner').withExactText(text)
const listCell = text => Selector('div.item-cell').withExactText(text)

const doneButton = Selector('div.exercise-block > a.button').withExactText('Done')
const skipRestButton = Selector('div.rest-block > a.button').withExactText('Skip Rest')

const expectHomePage = async t => {
  await t.expect(Selector('div.title-large-text').withText('Gains Tracker').visible).ok()
    .expect(blockTitle('Workouts').visible).ok()
    .expect(button('Circuit').visible).ok()
    .expect(button('HIIT').visible).ok()
    .expect(button('New Workout').visible).ok()
}

async function expectCircuitWorkout (t) {
  await t
    .expect(blockTitle('Exercises:').visible).ok()
    .expect(Selector('li.workout-exercise').count).eql(2)
    .expect(listCell('Push-ups').visible).ok()
    .expect(listCell('Weight: 0 lbs.').visible).ok()
    .expect(listCell('Reps: 1').visible).ok()
    .expect(listItem('Rest: 3 seconds').visible).ok()
    .expect(listCell('Pull-ups').visible).ok()
    .expect(listCell('Weight: 15 lbs.').visible).ok()
    .expect(listCell('Reps: 6').visible).ok()
    .expect(listItem('Rest: 3 seconds').count).eql(2)
    .expect(Selector('p').withExactText('x 2 Rounds').visible).ok()
    .expect(button('Start Workout').visible).ok()
}

async function startCircuitWorkout (t) {
  /**
   * Click the 'Start Workout' button,
   * expect the Active Workout page with the first exercise
   */
  await t
    .click(button('Start Workout'))
    .expect(title('Active Workout: Circuit').visible).ok()
    .expect(Selector('h3').withExactText('Current Round: 1').visible).ok()
    .expect(blockText('Current Exercise: Push-ups').visible).ok()
    .expect(blockText('Target: 1 rep of 0 lbs.').visible).ok()
    .expect(doneButton.visible).ok()
    .expect(blockText('Next Up: 3s Rest').visible).ok()
}

export {
  title,
  blockTitle,
  blockText,
  button,
  inputGroup,
  listItem,
  listCell,
  doneButton,
  skipRestButton,
  expectHomePage,
  expectCircuitWorkout,
  startCircuitWorkout
}
