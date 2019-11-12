import {
  title, button, inputGroup,
  expectHomePage, expectCircuitWorkout, listItem
} from './elements'

const hostname = 'localhost'
const port = process.env.PORT || '8080'
const page = `http://${hostname}:${port}`

fixture(`Workout Lifecycle`)
  .page(page)
  .beforeEach(expectHomePage)

const workoutNameInput = inputGroup('Name', { type: 'text', placeholder: 'Workout Name' })
const exerciseNameInput = i => inputGroup('Exercise ' + i, { type: 'text', placeholder: 'Exercise Name' })
const targetWeightInput = inputGroup('Target weight:', { type: 'number' })
const targetRepsInput = inputGroup('Target reps:', { type: 'number' })
const restInput = inputGroup('Rest:', { type: 'number' })
const roundsInput = inputGroup('Rounds', { type: 'number' })

test('Create a workout', async t => {
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

test('Blank rest should default to 0', async t => {
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
    // Type the first and second exercise name
    .typeText(exerciseNameInput('1'), 'Push-ups')
    .typeText(exerciseNameInput('2'), 'Pull-ups')
    //
    // Delete the rest period between exercises
    .selectText(restInput)
    .pressKey('delete')
    .expect(restInput.value).eql('0')
    //
    // Create the workout, should navigate to the workout page
    .click(button('Create Workout'))
    .expect(title('Workout: My Workout').visible).ok()
    .expect(listItem('Rest: 0 seconds').visible).ok()
})
