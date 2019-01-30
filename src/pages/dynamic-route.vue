<template>
  <f7-page>
    <f7-navbar title="Dynamic Route" back-link="Back"></f7-navbar>

    <f7-block strong>
      <h1>{{ workout.name }}</h1>
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
