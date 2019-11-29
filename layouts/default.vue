<template>
  <section>
    <div class="shield" v-if="$store.state.toggled_sidebar" @click="close"></div>
    <!-- {{$route.path}} -->
    <AppHeader />
    <AppSideBar @modal="signout_modal = $event" />
    <div
      :class="
				$route.name === 'messages-slug' || $route.name === 'messages-new'
					? 'content-message'
					: 'content'
			"
    >
      <AppNotification />
        <JobNotification />
      <nuxt
        class="mb-4"
        :class="
					$route.name === 'messages-slug' || $route.name === 'messages-new'
						? 'md:mt-20'
						: 'mt-16'
				"
      />
    </div>
  </section>
</template>
<script>
import AppSideBar from "@/components/AppSideBar";
import AppNotification from "@/components/AppNotification";
import JobNotification from "@/components/JobNotification";
import AppHeader from "@/components/AppHeader";

export default {
  transitions: "page",
  components: {
    AppSideBar,
    AppNotification,
    JobNotification,
    AppHeader
  },
  data() {
    return {
      signout_modal: false
    };
  },
  middleware: "isNotAuthenticated",
  watch: {
    $route(value) {
      if (value) {
        this.$store.commit("TOGGLE_SIDEBAR", false);
        document.body.style.overflow = "auto";
      }
    }
  },
  methods: {
    close() {
      this.$store.commit("TOGGLE_SIDEBAR", false);
      document.body.style.overflow = "auto";
    }
  }
};
</script>
<style>
.content {
  /* box-sizing: content-box; */
  padding: 10px 20px;
  height: 100%;
  scroll-behavior: smooth;
}

.content-message {
  padding: 0 20px;
}

.shield {
  z-index: 55;
}
@media screen and (min-width: 1200px) {
  .content,
  .content-message {
    margin-left: 200px;
  }
}

@media screen and (min-width: 480px) {
  .content,
  .content-message {
    padding: 1px 5% 0;
  }
}

@media screen and (min-width: 320px) {
  .content,
  .content-message {
    padding: 1px 3% 0;
  }
}
</style>
