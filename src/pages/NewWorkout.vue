<template>
  <f7-page>
    <f7-navbar title="New Workout" back-link="Back"></f7-navbar>

    <f7-block>

      <f7-list form ref="newWorkout">

        <f7-list-input
          label="Name"
          type="text"
          :value="name"
          @input="name = $event.target.value"
          placeholder="Workout Name"
          required
          validate
        ></f7-list-input>

        <f7-list-input
          v-for="(ex, i) in exercises" :key="i"
          :label="'Exercise '+(i+1)"
          type="text"
          :value="ex"
          @input="modifyExercise(i, $event.target.value)"
          placeholder="Exercise Name"
          :required="i===0"
          validate
        ></f7-list-input>

        <f7-list-input
          label="Rounds"
          type="number"
          :value="rounds"
          @input="rounds = parseInt($event.target.value)"
          error-message="Only positive numbers please!"
          required
          validate
          min="1"
          pattern="[0-9]*"
        >
        </f7-list-input>

      </f7-list>

      <f7-row tag="p">
        <f7-button class="col" big fill raised color="green" @click="addWorkout">
          Create Workout
        </f7-button>
      </f7-row>

    </f7-block>

  </f7-page>
</template>

<script>
export default {
  data: () => ({
    name: '',
    exercises: [''],
    rounds: 1
  }),
  methods: {

    modifyExercise(i, val) {
      this.$set(this.exercises, i, val);

      if (this.exercises[this.exercises.length - 1] !== '')
        this.exercises.push('')
    },

    addWorkout() {
      if (this.$refs.newWorkout.$el.checkValidity()) {

        this.$root.addWorkout(this.$data);
        this.$f7router.navigate('/');
      }
    }
  }
}
</script>
