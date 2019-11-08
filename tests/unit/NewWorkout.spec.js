import { shallowMount } from '@vue/test-utils'
import NewWorkout from '@/pages/NewWorkout.vue'
import { f7Page, f7Navbar, f7Block, f7List, f7Row, f7ListInput, f7Button } from 'framework7-vue'

describe('NewWorkout', () => {

  const wrapper = shallowMount(NewWorkout)

  it('should display an input for the name', () => {

    const nameInput = wrapper.find(f7ListInput)
    expect(nameInput.props().label).toBe('Name')
    expect(nameInput.props().type).toBe('text')
    expect(nameInput.props().placeholder).toBe('Workout Name')

  })

})
