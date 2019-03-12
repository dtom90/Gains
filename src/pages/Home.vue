<template>
  <f7-page>

    <f7-navbar title="Gainzz" large/>

    <f7-block-title>
      <h2>
        Workouts
      </h2>
    </f7-block-title>

    <f7-block strong>

      <f7-row tag="p" v-for="(workout, i) in workouts" :key="i">
        <f7-button class="col" :href="'/workout/'+workout.id" big fill raised>
          {{ workout.name }}
        </f7-button>
      </f7-row>

    </f7-block>

    <f7-block>
      <f7-row tag="p">
        <f7-button href="/newWorkout/" class="col" big fill raised color="green">New Workout</f7-button>
      </f7-row>
    </f7-block>

  </f7-page>
</template>
<script>
export default {
  computed: {
    workouts () {
      return this.$store.state.workouts
    }
  }
}
</script>
