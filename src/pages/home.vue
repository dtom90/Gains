<template>
  <f7-page>

    <f7-navbar>
      <f7-nav-title>Gainzz</f7-nav-title>
    </f7-navbar>

    <f7-block strong>

      <h1>Workouts</h1>

      <f7-row tag="p" v-for="workout in workouts">
        <f7-button class="col" :href="'/workout/'+workout.id" big outline>
          {{ workout.name }}
        </f7-button>
      </f7-row>

      <f7-row tag="p">
        <f7-button href="/form/" class="col" big fill raised color="green">New Workout</f7-button>
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
