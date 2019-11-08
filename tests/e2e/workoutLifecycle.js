import { Selector } from 'testcafe'

import {
  title, blockTitle, blockText, button, inputGroup, listItem,
  doneButton, skipRestButton,
  expectCircuitWorkout, startCircuitWorkout
} from './elements'

const hostname = 'localhost'
const port = process.env.PORT || '8080'
const page = `http://${hostname}:${port}`

fixture(`Testing Gains`)
  .page(page)
  .beforeEach(async t => {
    await t.expect(Selector('div.title-large-text').withText('Gainzz').visible).ok()
      .expect(blockTitle('Workouts').visible).ok()
      .expect(button('Circuit').visible).ok()
      .expect(button('HIIT').visible).ok()
      .expect(button('New Workout').visible).ok()
  })

test('Create a workout', async t => {
  const workoutNameInput = inputGroup('Name', { type: 'text', placeholder: 'Workout Name' })
  const exerciseNameInput = i => inputGroup('Exercise ' + i, { type: 'text', placeholder: 'Exercise Name' })
  const targetWeightInput = inputGroup('Target weight:', { type: 'number' })
  const targetRepsInput = inputGroup('Target reps:', { type: 'number' })
  const restInput = inputGroup('Rest:', { type: 'number' })
  const roundsInput = inputGroup('Rounds', { type: 'number' })

  await t
    //
    // Open the New Workout page, expect the right content
    .click(button('New Workout'))
    .expect(title('New Workout').visible).ok()
    .expect(workoutNameInput.visible).ok()
    .expect(exerciseNameInput('1').visible).ok()
    .expect(roundsInput.visible).ok()
    .expect(roundsInput.value).eql('1')
    //
    // Type in the workout name
    .typeText(workoutNameInput, 'My Workout')
    //
    // Type the first exercise name, expect target weight, reps and new exercise field to appear
    .expect(targetWeightInput.exists).notOk()
    .expect(targetRepsInput.exists).notOk()
    .expect(exerciseNameInput('2').exists).notOk()
    .typeText(exerciseNameInput('1'), 'Push-ups')
    .expect(targetWeightInput.visible).ok()
    .expect(targetRepsInput.visible).ok()
    .expect(targetWeightInput.value).eql('0')
    .expect(targetRepsInput.value).eql('1')
    .expect(exerciseNameInput('2').visible).ok()
    //
    // Type the second exercise name
    .expect(restInput.exists).notOk()
    .expect(targetWeightInput.nth(1).exists).notOk()
    .expect(targetRepsInput.nth(1).exists).notOk()
    .typeText(exerciseNameInput('2'), 'Pull-ups')
    .expect(restInput.visible).ok()
    .expect(restInput.value).eql('30')
    .expect(targetWeightInput.nth(1).visible).ok()
    .expect(targetRepsInput.nth(1).visible).ok()
    .expect(targetWeightInput.value).eql('0')
    .expect(targetRepsInput.value).eql('1')
    //
    // Modify the rest period between exercises
    .typeText(restInput, '3', { replace: true })
    .expect(restInput.value).eql('3')
    //
    // Modify the second exercise weight and reps
    .typeText(targetWeightInput.nth(1), '15', { replace: true })
    .typeText(targetRepsInput.nth(1), '6', { replace: true })
    //
    // Increase the number of rounds, expect the last exercise to get a rest interval
    .expect(restInput.count).eql(1)
    .typeText(roundsInput, '2', { replace: true })
    .expect(restInput.count).eql(2)
    .expect(restInput.nth(1).value).eql('3')
    //
    // Create the workout, should navigate to the workout page
    .click(button('Create Workout'))
    .expect(title('Workout: My Workout').visible).ok()
  expectCircuitWorkout(t)
})

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
