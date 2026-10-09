import {
  getRateLimitExpiry,
  setRateLimitExpiry,
  clearRateLimitExpiry
} from "@/utils/rateLimitStorage";

export default function withRateLimitCountdown({
  key,
  statusEndpoint,
  windowMs = 60000
}) {
  return {
    data() {
      return {
        rateLimitCountdown: 0,
        countdownInterval: null
      };
    },

    async mounted() {
      await this.restoreRateLimitCountdown();
    },

    destroyed() {
      if (this.countdownInterval) clearInterval(this.countdownInterval);
    },

    methods: {
      async restoreRateLimitCountdown() {
        const localExpiry = getRateLimitExpiry(key);
        if (localExpiry) {
          this.startRateLimitCountdown(localExpiry);
          return;
        }

        try {
          const { data } = await this.$axios.get(statusEndpoint);
          if (data && data.rateLimited && data.remainingSeconds > 0) {
            const expiryMs = Date.now() + data.remainingSeconds * 1000;
            setRateLimitExpiry(key, expiryMs);
            this.startRateLimitCountdown(expiryMs);
          }
        } catch (e) {
          console.log(e);
        }
      },

      startRateLimitCountdown(expiryMs) {
        if (this.countdownInterval) clearInterval(this.countdownInterval);

        const tick = () => {
          const remaining = Math.ceil((expiryMs - Date.now()) / 1000);
          if (remaining <= 0) {
            this.rateLimitCountdown = 0;
            clearInterval(this.countdownInterval);
            this.countdownInterval = null;
            clearRateLimitExpiry(key);
          } else {
            this.rateLimitCountdown = remaining;
          }
        };

        tick();
        this.countdownInterval = setInterval(tick, 1000);
      },
      handleRateLimitError(err, { notify = false } = {}) {
        const res = err && err.response;
        if (!res || res.status !== 429) return false;

        const retryAfterSeconds =
          (res.data && res.data.retryAfter) || Math.round(windowMs / 1000);
        const expiryMs = Date.now() + retryAfterSeconds * 1000;

        setRateLimitExpiry(key, expiryMs);
        this.startRateLimitCountdown(expiryMs);

        if (notify) {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "danger",
            text: [
              `${(res.data && res.data.error) ||
                "Too many requests."} Try again in ${retryAfterSeconds}s.`
            ]
          });
        }

        return true;
      }
    }
  };
}
