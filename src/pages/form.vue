<template>
  <f7-page>

    <f7-navbar title="New Workout" back-link="Back"></f7-navbar>

    <f7-block strong>

      <f7-list form>
        <f7-list-input
          label="Name"
          type="text"
          :value="name"
          @input="name = $event.target.value"
          placeholder="Name"
        ></f7-list-input>
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
    name: ''
  }),
  methods: {
    addWorkout() {
      this.$root.addWorkout({name: this.name});
      this.$f7router.navigate('/');
    }
  }
}
</script>
