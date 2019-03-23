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
          :value="ex"
          placeholder="Exercise Name"
          :required="i===0"
          validate
          @input="modifyExercise(i, $event.target.value)"
        />

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
import { mapMutations } from 'vuex'

export default {
  components: { f7Page, f7Navbar, f7Block, f7List, f7Row, f7ListInput, f7Button },

  data: () => ({
    name: '',
    exercises: [''],
    rounds: 1,
    nameError: false,
    nameErrorMessage: ''
  }),
  methods: {

    ...mapMutations(['addWorkout']),

    modifyExercise (i, val) {
      this.$set(this.exercises, i, val)

      if (this.exercises[this.exercises.length - 1] !== '') { this.exercises.push('') }
    },

    createWorkout () {
      if (!this.name) {
        this.nameError = true
        this.nameErrorMessage = 'Please fill out this field.'
        this.$refs.newWorkout.$el.checkValidity()
      } else if (this.$store.state.workouts.filter(w => w.name === this.name).length > 0) {
        this.nameError = true
        this.nameErrorMessage = 'Workout name already exists.'
        this.$refs.newWorkout.$el.checkValidity()
      } else if (this.$refs.newWorkout.$el.checkValidity()) {
        this.exercises = this.exercises.filter(ex => ex) // filter out blank (unfilled) exercises
        this.addWorkout(this.$data)
        this.$f7router.navigate('/')
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
