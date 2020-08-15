import { Selector } from 'testcafe'

import {
  title, blockTitle, blockText, blockDiv, button, inputGroup, listItem,
  doneButton, enterButton, skipRestButton,
  expectHomePage, expectCircuitWorkout, startCircuitWorkout
} from './elements'

const hostname = 'localhost'
const port = process.env.PORT || '8080'
const page = `http://${hostname}:${port}`

fixture('Active Workout')
  .page(page)
  .beforeEach(expectHomePage)

test('Start Circuit workout', async t => {
  await t
  //
  // Navigate to the Circuit workout and expect the correct sequence
    .click(button('Circuit'))
    .expect(title('Workout: Circuit').visible).ok()
  expectCircuitWorkout(t)
  //
  // Start the workout
  startCircuitWorkout(t)
  await t
    //
    // Click 'Done', expect the reps input to be filled with the target value
    .click(doneButton)
    .expect(blockText('Rest: 3').visible).notOk()
    .expect(skipRestButton.visible).notOk()
    .expect(blockText('Completed:').visible).ok()
    .expect(blockText('Push-ups').visible).ok()
    .expect(inputGroup('lbs.', { type: 'text' }).visible).ok()
    .expect(inputGroup('reps', { type: 'text' }).visible).ok()
    .expect(inputGroup('lbs.', { type: 'text' }).value).eql('0')
    .expect(inputGroup('reps', { type: 'text' }).value).eql('1')
    //
    // Modify the weight and reps with custom values
    .click(inputGroup('reps', { type: 'text' }))
    .expect(Selector('.picker-sheet').visible).ok()
    .click(Selector('.picker-item').withExactText('3'))
    .click(Selector('.picker-item').withExactText('5'))
    .click(Selector('.picker-item').withExactText('7'))
    .click(Selector('.picker-item').withExactText('9'))
    .click(Selector('.picker-item').withExactText('10'))
    .click(inputGroup('lbs.', { type: 'text' }))
    .expect(Selector('.picker-sheet').visible).ok()
    .expect(Selector('.picker-item').withExactText('+/- 5').visible).ok()
    .expect(Selector('.picker-item').withExactText('+/- 1').visible).ok()
    .click(Selector('.picker-item').withExactText('5'))
    .click(button('Enter'))
    .expect(Selector('div.input-info').withExactText('Set numbers updated!').visible).ok()
    //
    // Skip the rest, expect the next workout to be active
    .click(skipRestButton)
    .expect(blockText('Now:').visible).ok()
    .expect(blockText('Pull-ups').visible).ok()
    .expect(blockDiv('6 reps').visible).ok()
    .expect(blockDiv('15 lbs.').visible).ok()
    .expect(doneButton.visible).ok()
    //
    // Click 'Done', leave default weight & rep values
    .click(doneButton)
    .expect(blockText('Rest: 3').visible).ok()
    .expect(skipRestButton.visible).ok()
    .expect(blockText('Completed:').visible).ok()
    .expect(blockText('Pull-ups').visible).ok()
    .expect(inputGroup('lbs.', { type: 'text' }).value).eql('15')
    .expect(inputGroup('reps', { type: 'text' }).value).eql('6')
    .expect(Selector('div.input-info').withExactText('Set numbers updated!').exists).notOk()
    .click(skipRestButton)
    //
    // Continue until the end of the exercise
    .expect(blockText('Now:').visible).ok()
    .expect(blockText('Push-ups').visible).ok()
    .click(doneButton)
    .expect(blockText('Rest: 3').visible).ok()
    .expect(blockText('Completed:').visible).ok()
    .expect(blockText('Push-ups').visible).ok()
    .expect(inputGroup('lbs.', { type: 'text' }).value).eql('0')
    .expect(inputGroup('reps', { type: 'text' }).value).eql('1')
    .click(skipRestButton)
    .expect(blockText('Now:').visible).ok()
    .expect(blockText('Pull-ups').visible).ok()
    .click(doneButton)
    .expect(blockText('Completed:').visible).ok()
    .expect(blockText('Pull-ups').visible).ok()
    .expect(Selector('p').withText(/Total Workout Time: [0-9]+ seconds/).visible).ok()
    .click(button('Finish Workout'))
    //
    // Expect the workout screen with the last exercise
    .expect(blockTitle('Last Workout:').visible).ok()
    .expect(listItem('Push-ups: 5 lbs. x 10 reps').visible).ok()
    .expect(listItem('Pull-ups: 15 lbs. x 6 reps').visible).ok()
    .expect(listItem('Push-ups: 0 lbs. x 1 rep').visible).ok()
    .expect(listItem('Pull-ups: 15 lbs. x 6 reps').visible).ok()
})

test('Rest countdown', async t => {
  await t
  //
  // Navigate to the Circuit workout and expect the correct sequence
    .click(button('Circuit'))
    .expect(title('Workout: Circuit').visible).ok()
  expectCircuitWorkout(t)
  //
  // Start the workout
  startCircuitWorkout(t)
  await t
  //
  // Click 'Done', expect the reps input to be filled with the target value
    .click(doneButton)
    .click(enterButton)
    .expect(skipRestButton.visible).ok()
    .expect(blockText('Rest: 3').visible).ok()
    .expect(blockText('Rest: 2').visible).ok()
    .expect(blockText('Rest: 1').visible).ok()
    .expect(blockText('Rest: 0').visible).ok()
    .expect(Selector('div.rest-block > a.button').withExactText('Proceed to next exercise').visible).ok()
})
