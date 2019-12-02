<template>
  <f7-page>
    <f7-navbar
      :title="workout ? 'Edit Workout' : 'New Workout'"
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
          outline
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
          outline
          @input="modifyExercise(i, 'name', $event.target.value)"
        >
          <div
            v-if="exercises.length > (i+1)"
            slot="root"
            class="exercise-target-numbers"
          >
            <f7-list-input
              label="Target weight:"
              inline-label
              type="number"
              :value="ex.weight"
              error-message="Weight must be non-negative"
              validate
              min="0"
              pattern="[0-9]*"
              outline
              @input="modifyExercise(i, 'weight', $event.target.value)"
            >
              <div
                slot="inner"
                class="item-label label-append"
              >
                <span>&nbsp;&nbsp;lbs.</span>
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
              outline
              @input="modifyExercise(i, 'reps', $event.target.value)"
            >
              <div
                slot="inner"
                class="item-label label-append"
              >
                <span>&nbsp;&nbsp;reps</span>
              </div>
            </f7-list-input>
          </div>
          <div
            v-if="'rest' in ex"
            slot="root"
          >
            <ul style="padding-right: calc(var(--f7-list-item-padding-horizontal) + var(--f7-list-in-list-padding-left));">
              <f7-list-input
                label="Rest:"
                inline-label
                type="number"
                :value="ex.rest"
                error-message="Rest must be non-negative"
                validate
                placeholder="0"
                min="0"
                pattern="[0-9]*"
                outline
                @input="modifyExercise(i, 'rest', $event.target.value)"
              >
                <div
                  slot="inner"
                  class="item-label label-append"
                >
                  <span>&nbsp;&nbsp;seconds</span>
                </div>
              </f7-list-input>
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
          outline
          @input="modifyRounds($event.target.value)"
        />
      </f7-list>

      <f7-row tag="p">
        <f7-button
          class="col"
          large
          fill
          raised
          color="green"
          @click="createWorkout"
        >
          {{ workout ? 'Update Workout' : 'Create Workout' }}
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
    defaultRest: 30,
    nameError: false,
    nameErrorMessage: ''
  }),

  computed: {
    ...mapState([
      'workouts'
    ]),
    workout () {
      return 'workoutId' in this.$f7route.params
        ? this.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
        : null
    }
  },

  mounted () {
    if ('workoutId' in this.$f7route.params) {
      this.name = this.workout.name
      this.exercises = this.workout.exercises.concat(this.exercises)
      this.rounds = this.workout.rounds
    }
  },

  methods: {

    ...mapMutations([
      'addWorkout',
      'editWorkout'
    ]),

    modifyExercise (i, key, val) {
      if (key !== 'name') {
        val = parseInt(val)
      }
      if (key === 'rest') {
        if (isNaN(val)) {
          val = 0
        }
        this.defaultRest = val
      }
      this.$set(this.exercises[i], key, val)
      if (this.exercises[this.exercises.length - 1].name !== '') {
        this.exercises.push(newExercise())
        const offset = this.rounds > 1 ? 2 : 3
        if (this.exercises.length >= offset) {
          this.$set(this.exercises[this.exercises.length - offset], 'rest', this.defaultRest)
        }
      }
    },

    modifyRounds (newRounds) {
      this.rounds = parseInt(newRounds)
      if (this.rounds > 1 && !('rest' in this.exercises[this.exercises.length - 2])) {
        this.$set(this.exercises[this.exercises.length - 2], 'rest', this.defaultRest)
      } else if (this.rounds === 1 && 'rest' in this.exercises[this.exercises.length - 2]) {
        this.$delete(this.exercises[this.exercises.length - 2], 'rest', this.defaultRest)
      }
    },

    createWorkout () {
      if (!this.name) {
        this.nameError = true
        this.nameErrorMessage = 'Please fill out this field.'
        this.$refs.newWorkout.$el.checkValidity()
      } else if ((!this.workout || this.workout.name !== this.name) &&
              this.workouts.findIndex(w => w.name === this.name) > -1) {
        this.nameError = true
        this.nameErrorMessage = 'Workout name already exists.'
        this.$refs.newWorkout.$el.checkValidity()
      } else if (this.$refs.newWorkout.$el.checkValidity()) {
        this.exercises = this.exercises.filter(ex => ex.name) // filter out blank (unfilled) exercises
        if (this.workout) {
          this.editWorkout(Object.assign({ id: this.workout.id }, this.$data))
          const newId = this.workouts.filter(w => w.name === this.name)[0].id
          this.$f7router.navigate('/workout/' + newId)
        } else {
          this.addWorkout(this.$data)
          this.$f7router.navigate('/workout/' + this.workouts[this.workouts.length - 1].id)
        }
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

<style>
  /*noinspection CssUnusedSymbol*/
  .exercise-target-numbers .item-title {
    width: 40%;
  }
</style>

<style scoped>
  .label-append {
    width: 20%;
  }
</style>
