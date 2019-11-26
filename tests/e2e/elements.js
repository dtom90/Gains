import { Selector } from 'testcafe'

const title = text => Selector('div.title').withExactText(text)
const blockTitle = text => Selector('div.block-title').withExactText(text)
const blockText = text => Selector('div.block > p').withExactText(text)
const blockDiv = text => Selector('div.block div').withExactText(text)
const button = text => Selector('a.button').withExactText(text)
const inputGroup = (label, { type, placeholder }) => Selector('li')
  .find('div.item-label').withText(label)
  .sibling('div.item-input-wrap')
  .child(`input[type="${type}"]${placeholder ? `[placeholder="${placeholder}"]` : ''}`)
const listItem = text => Selector('div.item-inner').withExactText(text)
const listCell = text => Selector('div.item-cell').withExactText(text)

const doneButton = Selector('div.exercise-block > a.button').withExactText('Done')
const enterButton = Selector('div.exercise-block > a.button').withExactText('Enter')
const skipRestButton = Selector('div.rest-block > a.button').withExactText('Skip Rest')

const expectHomePage = async t => {
  await t.expect(Selector('div.title-large-text').withText('Gains Tracker').visible).ok()
    .expect(blockTitle('Workouts').visible).ok()
    .expect(button('Circuit').visible).ok()
    .expect(button('HIIT').visible).ok()
    .expect(button('New Workout').visible).ok()
}

async function expectCircuitWorkout (t) {
  const targetText = i => Selector('.target-numbers').nth(i).innerText
  const targetText0 = await targetText(0)
  const targetText1 = await targetText(1)
  await t
    .expect(blockTitle('Exercises:').visible).ok()
    .expect(Selector('li.workout-exercise').count).eql(2)
    .expect(listCell('Push-ups').visible).ok()
    .expect(listCell('Target:').nth(0).visible).ok()
    .expect(targetText0.replace(/\s/g, ' ')).eql('0 lbs. × 1 rep')
    .expect(listCell('0 lbs. × 1 reps').visible).ok()
    .expect(listItem('Rest: 3 seconds').visible).ok()
    .expect(listCell('Pull-ups').visible).ok()
    .expect(listCell('Target:').nth(1).visible).ok()
    .expect(targetText1.replace(/\s/g, ' ')).eql('15 lbs. × 6 reps')
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
    .expect(blockDiv('Circuit').visible).ok()
    .expect(blockDiv('Round 1 of 2').visible).ok()
    .expect(blockText('Now:').visible).ok()
    .expect(blockText('Push-ups').visible).ok()
    .expect(blockDiv('1 rep').visible).ok()
    .expect(blockDiv('0 lbs.').visible).ok()
    .expect(doneButton.visible).ok()
}

export {
  title,
  blockTitle,
  blockText,
  blockDiv,
  button,
  inputGroup,
  listItem,
  listCell,
  doneButton,
  enterButton,
  skipRestButton,
  expectHomePage,
  expectCircuitWorkout,
  startCircuitWorkout
}
