import { Selector } from 'testcafe'

const hostname = 'localhost'
const port = process.env.PORT || '8080'
const path = process.env.BASE_URL || ''
const page = `http://${hostname}:${port}${path}`

const blockTitle = text => Selector('div.block-title').withExactText(text)
const title = text => Selector('div.title').withExactText(text)
const button = text => Selector('a.button').withExactText(text)
const inputGroup = (label, { type, placeholder }) => Selector('li')
  .find('div.item-label').withExactText(label)
  .sibling('div.item-input-wrap')
  .child(`input[type="${type}"]${placeholder ? `[placeholder="${placeholder}"]` : ''}`)
const listItem = text => Selector('div.item-inner').withExactText(text)
const listCell = text => Selector('div.item-cell').withExactText(text)

fixture(`Testing Gains`)
  .page(page)
  .beforeEach(async t => {
    await t.expect(Selector('div.title-large-text').withText('Gainzz').visible).ok()
      .expect(blockTitle('Workouts').visible).ok()
      .expect(button('New Workout').visible).ok()
  })

test('Create a workout', async t => {
  const workoutNameInput = inputGroup('Name', { type: 'text', placeholder: 'Workout Name' })
  const exerciseNameInput = i => inputGroup('Exercise ' + i, { type: 'text', placeholder: 'Exercise Name' })
  const targetWeightInput = inputGroup('Target weight:', { type: 'number' })
  const targetRepsInput = inputGroup('Target reps:', { type: 'number' })
  const restInput = inputGroup('Rest:', { type: 'number' })
  const roundsInput = inputGroup('Rounds', { type: 'number' })

  const blockText = text => Selector('div.block > p').withExactText(text)
  const doneButton = Selector('div.exercise-block > a.button').withExactText('Done')
  const skipRestButton = Selector('div.rest-block > a.button').withExactText('Skip Rest')

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
    //
    // Click the 'Start Workout' button
    .click(button('Start Workout'))
    .expect(title('Active Workout: My Workout').visible).ok()
    .expect(Selector('h3').withExactText('Current Round: 1').visible).ok()
    .expect(blockText('Current Exercise: Push-ups').visible).ok()
    .expect(blockText('Target: 1 rep of 0 lbs.').visible).ok()
    .expect(doneButton.visible).ok()
    .expect(blockText('Next Up: 3s Rest').visible).ok()
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
