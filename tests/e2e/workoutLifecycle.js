import { Selector } from 'testcafe'

const hostname = 'localhost'
const port = process.env.PORT || '8080'
const path = process.env.BASE_URL || ''
const page = `http://${hostname}:${port}${path}`

const blockTitle = text => Selector('div.block-title').withExactText(text)
const title = text => Selector('div.title').withExactText(text)
const button = text => Selector('a.button').withExactText(text)
const inputLabel = label => Selector('div.item-label').withExactText(label)
const input = ({ type, placeholder }) => Selector(`input[type="${type}"]${placeholder ? `[placeholder="${placeholder}"]` : ''}`)
const listItem = text => Selector('li').withExactText(text)

fixture(`Testing Gains`)
  .page(page)
  .beforeEach(async t => {
    await t.expect(Selector('div.title-large-text').withText('Gainzz').visible).ok()
      .expect(blockTitle('Workouts').visible).ok()
      .expect(button('New Workout').visible).ok()
  })

test('Create a workout', async t => {
  await t
    //
    // Open the New Workout page
    .click(button('New Workout'))
    .expect(title('New Workout').visible).ok()
    .expect(inputLabel('Name').visible).ok()
    .expect(input({ type: 'text', placeholder: 'Workout Name' }).visible).ok()
    .expect(inputLabel('Exercise 1').visible).ok()
    .expect(input({ type: 'text', placeholder: 'Exercise Name' }).visible).ok()
    .expect(input({ type: 'text', placeholder: 'Exercise Name' }).count).eql(1)
    .expect(inputLabel('Target weight:').exists).notOk()
    .expect(input({ type: 'number', placeholder: '0 (bodyweight)' }).exists).notOk()
    .expect(inputLabel('Target reps:').exists).notOk()
    .expect(input({ type: 'number', placeholder: '(unset)' }).exists).notOk()
    .expect(inputLabel('Rounds').visible).ok()
    .expect(input({ type: 'number' }).visible).ok()
    .expect(input({ type: 'number' }).value).eql('1')
    //
    // Type in the workout parameters
    .typeText(input({ type: 'text', placeholder: 'Workout Name' }), 'My Workout')
    .typeText(input({ type: 'text', placeholder: 'Exercise Name' }).nth(0), 'Push-ups')
    .expect(inputLabel('Target weight:').visible).ok()
    .expect(input({ type: 'number', placeholder: '0 (bodyweight)' }).visible).ok()
    .expect(inputLabel('Target reps:').visible).ok()
    .expect(input({ type: 'number', placeholder: '(unset)' }).visible).ok()
    .expect(inputLabel('Exercise 2').visible).ok()
    .expect(input({ type: 'text', placeholder: 'Exercise Name' }).count).eql(2)
    .typeText(input({ type: 'text', placeholder: 'Exercise Name' }).nth(1), 'Pull-ups')
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
