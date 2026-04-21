<template>
  <div class="modal-container bg-white shadow-lg">
    <div class="p-4 md:p-8">
      <div class="flex items-center">
        <nuxt-link :to="'/profile/practice-documents'" class="cursor-pointer">
          <svgicon name="left-arrow" height="32" />
        </nuxt-link>
      </div>

      <div class="shadow-lg rounded-lg bg-gray-300 mt-4 max-w-5xl">
        <div class="flex flex-row flex-wrap justify-start p-4 md:p-8">
          <div class="flex flex-col w-full lg:w-1/4">
            <p class="mr-20 font-semibold">
              Filename
            </p>
            <p class="mt-2 text-base">
              {{ variation_terms.filename }}
            </p>

            <p class="mt-5 mr-20 font-semibold">
              File last uploaded
            </p>
            <p class="mt-2 text-base">
              {{
                $moment(variation_terms.created_at)
                  .utc()
                  .format("DD/MM/YYYY HH:mm:ss")
              }}
            </p>
          </div>
          <div class="w-full mt-5 lg:mt-0 lg:w-3/4">
            <embed
              class="object-contain object-top w-full"
              :class="
                variation_terms.type == 'image' ? 'image' : 'document h-full '
              "
              :src="
                variation_terms.type !== 'image'
                  ? convertDoc(variation_terms.url)
                  : variation_terms.url
              "
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  transition: {
    name: "slide",
    mode: "out-in"
  },
  data() {
    return {
      variation_terms: null
    };
  },
  computed: {
    authPermissions() {
      return this.$store.getters["permissions"];
    }
  },
  async asyncData({ app, params, error }) {
    try {
      const res = await app.$axios.$get(`/api/v1/practice/me/practice`, {
        cache: true
      });
      const variation_terms =
        res.data && res.data.practice && res.data.practice.variation_terms_file
          ? res.data.practice.variation_terms_file
          : null;
      return {
        variation_terms
      };
    } catch (err) {
      if (err.response && err.response.status === 401) {
        error(err.response.data);
        return;
      }
      throw err;
    }
  },
  methods: {
    convertDoc(document) {
      if (this.variation_terms.type === "image") {
        return document;
      } else {
        return `https://docs.google.com/gview?url=${document}&embedded=true`;
      }
    }
  }
};
</script>
<style scoped>
.modal-container {
  z-index: 510;
}
@media screen and (min-width: 1200px) {
  .modal-container {
    width: 80%;
  }
}
.document {
  width: 100%;
  min-height: 50vh;
}

.image {
  min-height: 100%;
  max-height: 100%;
}

@media screen and (min-width: 768px) {
  .document {
    min-height: 70vh;
  }

  .image {
    min-height: 60vh;
    max-height: 60vh;
  }
}
</style>
