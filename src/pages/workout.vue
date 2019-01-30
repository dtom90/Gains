<template>
  <f7-page>
    <f7-navbar :title="workout.name" back-link="Back"></f7-navbar>

    <f7-block strong>
      <h1>{{ workout.name }}</h1>

      <f7-block>
        <h2>Exercises: </h2>
        <f7-list>
          <f7-list-item v-for="exercise in workout.exercises">{{ exercise }}</f7-list-item>
        </f7-list>
        <h4>x {{ workout.rounds }} Round{{ workout.rounds === 1 ? '' : 's' }}</h4>
      </f7-block>

    </f7-block>

    <f7-block>
      <p>{{ $f7route.path }}</p>
      <p>{{ workout }}</p>
    </f7-block>

  </f7-page>
</template>

<script>
export default {
  computed: {
    workout () {
      return this.$store.state.workouts.filter(w => w.id === this.$f7route.params['workoutId'])[0]
    }
  }
}
</script>
