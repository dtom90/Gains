// Import Vue
import Vue from 'vue'
import Vuex from 'vuex'
import VuexPersist from 'vuex-persist/dist/umd'

import getters from './getters'
import mutations from './mutations'
import sampleState from './sampleState'

Vue.use(Vuex)

const vuexLocalStorage = new VuexPersist({
  storage: window.localStorage
})

const state = process.env.LOAD_SAMPLE_STATE ? sampleState : {
  workouts: [],
  completed: {}
}

const store = new Vuex.Store({
  state,
  getters,
  mutations,
  plugins: [vuexLocalStorage.plugin]
})

export default store
