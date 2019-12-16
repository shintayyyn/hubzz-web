<template>
  <section>
    <div class="shield" v-if="$store.state.toggled_sidebar" @click="close"></div>
    {{$route.name}}
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
      <AppConfirmationModal
        :label="`User account ${user_verification.status ? user_verification.status : ''}`"
        :confirmLabel="'OK'"
        :modal="user_verification.modal"
        @confirm="refresh"
      />
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
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppNotification from "@/components/AppNotification";
import JobNotification from "@/components/JobNotification";
import AppHeader from "@/components/AppHeader";

export default {
  transitions: "page",
  components: {
    AppSideBar,
    AppConfirmationModal,
    AppNotification,
    JobNotification,
    AppHeader
  },
  data() {
    return {
      signout_modal: false
    };
  },
  computed: {
    user_verification() {
      return this.$store.state.user_verification;
    }
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
    },
    refresh() {
      window.location.reload();
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
