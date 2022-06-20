<template>
  <div>
    <base-dialog
      :show="!!error"
      title="An Error Occurred!"
      @close="handleError"
    >
      <p>{{ error }}</p>
    </base-dialog>
    <section><FilterCoach @change-filter="setFilters" /></section>
    <section>
      <base-card>
        <div class="controls">
          <base-button mode="outline" @click="loadCoaches(true)"
            >Refresh</base-button
          >
          <base-button link to="/auth?redirect=register" v-if="!isLoggedIn"
            >Login To Register as Coach</base-button
          >
          <base-button
            v-if="isLoggedIn && !isCoach && !isLoading"
            link
            to="/register"
            >register as coach</base-button
          >
        </div>
        <base-spinner v-if="isLoading"></base-spinner>
        <ul v-else-if="hasCoaches">
          <CoachItem
            v-for="coach in filteredCoaches"
            :key="coach.id"
            :id="coach.id"
            :areas="coach.areas"
            :firstName="coach.firstName"
            :lastName="coach.lastName"
            :rate="coach.hourlyRate"
          ></CoachItem>
        </ul>
        <h3 v-else>No Coaches Found</h3>
      </base-card>
    </section>
  </div>
</template>

<script>
import CoachItem from "../../components/CoachItem.vue";
import FilterCoach from "../../components/FilterCoach.vue";
import BaseButton from "../../components/BaseButton.vue";

export default {
  data() {
    return {
      error: null,
      isLoading: false,
      activeFilter: { frontend: true, backend: true, career: true },
    };
  },
  computed: {
    isLoggedIn() {
      return this.$store.getters.isAuthenticated;
    },
    filteredCoaches() {
      const coaches = this.$store.getters["coaches/coaches"];
      return coaches.filter((coach) => {
        if (this.activeFilter.frontend && coach.areas.includes("frontend")) {
          return true;
        }
        if (this.activeFilter.backend && coach.areas.includes("backend")) {
          return true;
        }
        if (this.activeFilter.career && coach.areas.includes("career")) {
          return true;
        }
        return false;
      });
    },
    hasCoaches() {
      return !this.isLoading && this.$store.getters["coaches/hasCoaches"];
    },
    isCoach() {
      return this.$store.getters["coaches/isCoach"];
    },
  },
  created() {
    this.loadCoaches();
  },
  methods: {
    setFilters(updatedFilter) {
      this.activeFilter = updatedFilter;
    },
    async loadCoaches(refresh = false) {
      this.isLoading = true;
      try {
        await this.$store.dispatch("coaches/loadCoach", {
          forceRefresh: refresh,
        });
      } catch (error) {
        this.error = error.message || "Something went wrong";
      }

      this.isLoading = false;
    },
    handleError() {
      this.error = null;
    },
  },
  components: { CoachItem, FilterCoach, BaseButton },
};
</script>

<style scoped>
ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.controls {
  display: flex;
  justify-content: space-between;
}
</style>
