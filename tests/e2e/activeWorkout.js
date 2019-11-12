import { Selector } from 'testcafe'

import {
  title, blockTitle, blockText, button, inputGroup, listItem,
  doneButton, skipRestButton,
  expectHomePage, expectCircuitWorkout, startCircuitWorkout
} from './elements'

const hostname = 'localhost'
const port = process.env.PORT || '8080'
const page = `http://${hostname}:${port}`

fixture(`Active Workout`)
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
    .expect(blockText('Rest: 3').visible).ok()
    .expect(skipRestButton.visible).ok()
    .expect(blockText('Completed Exercise: Push-ups').visible).ok()
    .expect(blockText('Target: 1 rep of 0 lbs.').visible).ok()
    .expect(inputGroup('Weight', { type: 'number' }).visible).ok()
    .expect(inputGroup('Reps', { type: 'number' }).visible).ok()
    .expect(inputGroup('Weight', { type: 'number' }).value).eql('0')
    .expect(inputGroup('Reps', { type: 'number' }).value).eql('1')
    //
    // Modify the weight and reps with custom values
    .typeText(inputGroup('Weight', { type: 'number' }), '5', { replace: true })
    .typeText(inputGroup('Reps', { type: 'number' }), '10', { replace: true })
    .click(button('Submit'))
    .expect(Selector('div.input-info').withExactText('Set numbers updated!').visible).ok()
    //
    // Skip the rest, expect the next workout to be active
    .click(skipRestButton)
    .expect(blockText('Current Exercise: Pull-ups').visible).ok()
    .expect(blockText('Target: 6 reps of 15 lbs.').visible).ok()
    .expect(doneButton.visible).ok()
    .expect(blockText('Next Up: 3s Rest').visible).ok()
    //
    // Click 'Done', leave default weight & rep values
    .click(doneButton)
    .expect(blockText('Rest: 3').visible).ok()
    .expect(skipRestButton.visible).ok()
    .expect(blockText('Completed Exercise: Pull-ups').visible).ok()
    .expect(blockText('Target: 6 reps of 15 lbs.').visible).ok()
    .expect(inputGroup('Weight', { type: 'number' }).value).eql('15')
    .expect(inputGroup('Reps', { type: 'number' }).value).eql('6')
    .expect(Selector('div.input-info').withExactText('Set numbers updated!').exists).notOk()
    .click(skipRestButton)
    //
    // Continue until the end of the exercise
    .expect(blockText('Current Exercise: Push-ups').visible).ok()
    .click(doneButton)
    .expect(blockText('Rest: 3').visible).ok()
    .expect(blockText('Completed Exercise: Push-ups').visible).ok()
    .expect(inputGroup('Weight', { type: 'number' }).value).eql('0')
    .expect(inputGroup('Reps', { type: 'number' }).value).eql('1')
    .click(skipRestButton)
    .expect(blockText('Current Exercise: Pull-ups').visible).ok()
    .click(doneButton)
    .expect(blockText('Completed Exercise: Pull-ups').visible).ok()
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
    .expect(skipRestButton.visible).ok()
    .expect(blockText('Rest: 3').visible).ok()
    .expect(blockText('Rest: 2').visible).ok()
    .expect(blockText('Rest: 1').visible).ok()
    .expect(blockText('Rest: 0').visible).ok()
    .expect(Selector('div.rest-block > a.button').withExactText('Proceed to next exercise').visible).ok()
})
