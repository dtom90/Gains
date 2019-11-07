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

export {
  title,
  blockTitle,
  blockText,
  button,
  inputGroup,
  listItem,
  listCell,
  doneButton,
  skipRestButton
}
