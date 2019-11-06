import { Selector } from 'testcafe'

const hostname = 'localhost'
const port = process.env.PORT || '8080'
const path = process.env.BASE_URL || ''
const page = `http://${hostname}:${port}${path}`

const blockTitle = text => Selector('div.block-title').withExactText(text)
const title = text => Selector('div.title').withExactText(text)
const button = text => Selector('a.button').withExactText(text)
const inputCss = ({ type, placeholder }) => `input[type="${type}"]${placeholder ? `[placeholder="${placeholder}"]` : ''}`
const inputGroup = (label, { type, placeholder }) => Selector('li')
  .find('div.item-label').withExactText(label)
  .parent('li')
  .find(inputCss({ type, placeholder }))
const listItem = text => Selector('li').withExactText(text)

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
    // Type in the workout parameters
    .typeText(workoutNameInput, 'My Workout')
    .expect(targetWeightInput.exists).notOk()
    .expect(targetRepsInput.exists).notOk()
    .expect(exerciseNameInput('2').exists).notOk()
    .typeText(exerciseNameInput('1'), 'Push-ups')
    .expect(targetWeightInput.visible).ok()
    .expect(targetRepsInput.visible).ok()
    .expect(targetWeightInput.value).eql('0')
    .expect(targetRepsInput.value).eql('1')
    .expect(exerciseNameInput('2').visible).ok()
    .typeText(exerciseNameInput('2'), 'Pull-ups')
    .click(button('Create Workout'))
    //
    // Should navigate to the workout page
    .expect(title('Workout: My Workout').visible).ok()
    .expect(blockTitle('Exercises:').visible).ok()
    .expect(listItem('Push-ups').visible).ok()
    .expect(listItem('Pull-ups').visible).ok()
    .expect(Selector('p').withExactText('x 1 Round').visible).ok()
    .expect(button('Start Workout').visible).ok()
})
