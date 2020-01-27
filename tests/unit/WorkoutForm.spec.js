import { shallowMount } from '@vue/test-utils'
import WorkoutForm from '@/pages/WorkoutForm.vue'
import { f7ListInput } from 'framework7-vue'

describe('WorkoutForm', () => {

  const wrapper = shallowMount(WorkoutForm)

  it('should display an input for the name', () => {

    const nameInput = wrapper.find(f7ListInput)
    expect(nameInput.props().label).toBe('Name')
    expect(nameInput.props().type).toBe('text')
    expect(nameInput.props().placeholder).toBe('Workout Name')

  })

})
