<template>
  <f7-page>
    <f7-navbar
      title="New Workout"
      back-link="Back"
    />

    <f7-block>
      <f7-list
        ref="newWorkout"
        form
      >
        <f7-list-input
          label="Name"
          type="text"
          :value="name"
          placeholder="Workout Name"
          :error-message-force="nameError"
          :error-message="nameErrorMessage"
          @input="nameInputHandler"
        />

        <f7-list-input
          v-for="(ex, i) in exercises"
          :key="i"
          :label="'Exercise '+(i+1)"
          type="text"
          :value="ex.name"
          placeholder="Exercise Name"
          :required="i===0"
          validate
          @input="modifyExercise(i, 'name', $event.target.value)"
        >
          <div
            v-if="exercises.length > (i+1)"
            slot="root"
          >
            <ul>
              <f7-list-input
                label="Target weight:"
                inline-label
                type="number"
                :value="ex.weight"
                error-message="Weight must be non-negative"
                validate
                min="0"
                pattern="[0-9]*"
                @input="modifyExercise(i, 'weight', $event.target.value)"
              >
                <div slot="inner">
                  lbs.
                </div>
              </f7-list-input>
              <f7-list-input
                label="Target reps:"
                inline-label
                type="number"
                :value="ex.reps"
                error-message="Target reps must be positive"
                validate
                min="1"
                pattern="[0-9]*"
                @input="modifyExercise(i, 'reps', $event.target.value)"
              />
            </ul>
          </div>
        </f7-list-input>

        <f7-list-input
          label="Rounds"
          type="number"
          :value="rounds"
          error-message="Only positive numbers please!"
          required
          validate
          min="1"
          pattern="[0-9]*"
          @input="rounds = parseInt($event.target.value)"
        />
      </f7-list>

      <f7-row tag="p">
        <f7-button
          class="col"
          big
          fill
          raised
          color="green"
          @click="createWorkout"
        >
          Create Workout
        </f7-button>
      </f7-row>
    </f7-block>
  </f7-page>
</template>

<script>
import { f7Page, f7Navbar, f7Block, f7List, f7Row, f7ListInput, f7Button } from 'framework7-vue'
import { mapState, mapMutations } from 'vuex'

const newExercise = () => Object.assign({}, {
  name: '',
  weight: 0,
  reps: 1
})

export default {
  name: 'NewWorkout',

  components: { f7Page, f7Navbar, f7Block, f7List, f7Row, f7ListInput, f7Button },

  data: () => ({
    name: '',
    exercises: [newExercise()],
    rounds: 1,
    nameError: false,
    nameErrorMessage: ''
  }),
  computed: {
    ...mapState(['workouts'])
  },
  methods: {

    ...mapMutations(['addWorkout']),

    modifyExercise (i, key, val) {
      this.$set(this.exercises[i], key, val)
      if (this.exercises[this.exercises.length - 1].name !== '') { this.exercises.push(newExercise()) }
    },

    createWorkout () {
      if (!this.name) {
        this.nameError = true
        this.nameErrorMessage = 'Please fill out this field.'
        this.$refs.newWorkout.$el.checkValidity()
      } else if (this.workouts.filter(w => w.name === this.name).length > 0) {
        this.nameError = true
        this.nameErrorMessage = 'Workout name already exists.'
        this.$refs.newWorkout.$el.checkValidity()
      } else if (this.$refs.newWorkout.$el.checkValidity()) {
        this.exercises = this.exercises.filter(ex => ex.name) // filter out blank (unfilled) exercises
        this.addWorkout(this.$data)
        this.$f7router.navigate('/workout/' + this.workouts[this.workouts.length - 1].id)
      }
    },

    nameInputHandler (event) {
      this.name = event.target.value
      if (this.name) {
        this.nameError = false
        this.nameErrorMessage = ''
      }
    }

  }
}
</script>
