<template>
  <div class="modal-container shadow-lg">
    <div class="p-4 md:p-8">
      <div class="flex flex-row flex-no-wrap items-center text-lg">
        <div class="cursor-pointer" @click="$router.push('/compliance')">
          <svgicon name="left-arrow" height="32" />
        </div>
        <a
          class="text-black no-underline flex items-center w-auto hover:bg-yellow-500 rounded-lg cursor-pointer p-2 mx-4"
          @click.prevent="downloadItem(mandatory_training.file.url,mandatory_training.file.filename)"
        >
          <svgicon
            name="cloud-download"
            width="21"
            height="21"
            color="black"
            hover="transparent black"
            class="inline"
          />
          <span class="mx-1" />
          <span>Download</span>
        </a>
      </div>
      <div class="flex flex-col md:p-4">
        <div class="shadow-lg rounded-lg bg-gray-300 mt-5 max-w-5xl">
          <div class="flex flex-row flex-wrap justify-start p-4 md:p-8">
            <div class="flex flex-col w-full lg:w-1/4 pr-4">
              <p class="font-bold text-lg">
                Title
              </p>

              <p class="mt-2 text-sm md:text-base">
                {{ mandatory_training.mandatory_training ? mandatory_training.mandatory_training.name: null }}
              </p>

              <p class="mt-5 font-bold text-lg">
                File last uploaded
              </p>

              <p class="mt-2 text-sm md:text-base">
                {{ mandatory_training.uploaded_at_in_gb_formatted }}
              </p>

              <p class="mt-5 font-bold text-lg">
                Expiry date
              </p>

              <AppDate
                v-model="expiry_date"
                :name="'expiry_date'"
                isAfter
                :error="formError.find(item => item.field === 'expiry_date')"
              />

              <AppButton :label="'Save'" :inStyle="'padding:5px 20px'" @click="update" />
            </div>

            <div v-if="mandatory_training.file" class="mt-5 lg:mt-0 w-full lg:w-3/4">
              <embed
                class="object-contain object-top w-full"
                :class="mandatory_training.file.type == 'image' ? 'image' : 'document h-full'"
                :src="mandatory_training.file.type !== 'image' || mandatory_training.file.subtype === 'tiff' ? convertDoc(mandatory_training.file.url) : mandatory_training.file.url"
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import AppDate from "@/components/Base/AppDate"
import AppButton from "@/components/Base/AppButton"
export default {
  components: {
    AppDate,
    AppButton,
  },
  data () {
    return {
      expiry_date: null,
      formError: [],
      file: null,
    }
  },

  async asyncData ({ app, params, }) {
    try {
      const response = await app.$axios.$get(
        `/api/v1/locum/locum-detail-mandatory-trainings/${params.id}`
      )

      let mandatory_training = response.data && response.data.locum_detail_mandatory_training
        ? response.data.locum_detail_mandatory_training
        : null

      return {
        mandatory_training,
      }
    } catch (err) {
      throw err
    }
  },

  created () {
    this.expiry_date = this.mandatory_training.expired_at
    this.file = this.mandatory_training.file
  },

  methods: {
    async update () {
      try {
        this.formError = []
        if (!this.expiry_date) {
          this.formError.push({
            field: "expiry_date",
            message: "Expiry Date is required",
          })
          return
        }

        await this.$axios.$patch(
          `/api/v1/locum/locum-detail-mandatory-trainings/${this.$route.params.id}`,
          { expired_at: this.expiry_date, }
        )

        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: ["Locum Detail Mandatory Training Updated Successfully",],
        })

        this.$router.push("/compliance")
      } catch (err) {
        throw err
      }
    },

    downloadItem (fileUrl, fileName) {
      const axios = require("axios")
      axios({
        url: fileUrl,
        method: "GET",
        responseType: "blob", // important
      }).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data,]))
        const link = document.createElement("a")
        link.href = url
        link.setAttribute("download", fileName)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },
    convertDoc (document) {
      return `https://docs.google.com/gview?url=${document}&embedded=true`
    },
  },
}
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
