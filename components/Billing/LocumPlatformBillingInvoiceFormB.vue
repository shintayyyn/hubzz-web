<template>
  <section class="relative max-w-3xl">
    <div class="flex flex-col md:flex-row justify-between">
      <!-- save buttons -->
      <div class="flex flex-wrap items-center">
        <AppButton
          class="m-1"
          :label="'Generate Form B'"
          @click="save()"
          :inStyle="'padding:5px 14px;font-size:1em'"
          :disabled="saveLoading"
        />
      </div>
      <!-- invoice type -->
      <!-- <div class="flex flex-row flex-wrap justify-start items-center my-2 md:my-4">
        <label class="mx-1">Type:</label>
        <div
          class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none"
          :class="form.type === 'Platform' ? 'bg-yellow-500 border-yellow-500' : ''"
          @click="form.type = 'Platform'"
        >Platform</div>
        <div
          class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none"
          :class="form.type === 'Private' ? 'bg-yellow-500 border-yellow-500' : ''"
          @click="form.type = 'Private'"
        >Private</div>
      </div>-->
      <div class="flex flex-row flex-wrap justify-start items-center my-2 md:my-4">
        <label class="mx-1">Type:</label>
        <div
          class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none bg-yellow-500 border-yellow-500"
        >Platform</div>
      </div>
    </div>

    <div id="htmlpdf" class="relative max-w-3xl mb-4 bg-white px-4 py-4 border shadow-md mb-32">
      <AppLoading :loading="saveLoading" spinner />
      <div class="flex flex-col" :ref="'pdf-header'">
        <div
          class="w-full sm:w-1/2 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2"
        >
          <section>
            <div class="relative flex flex-col py-2">
              <div class="relative flex flex-row flex-no-wrap justify-between">
                <label class="text-base py-1">To: Accounts Department</label>
              </div>
              <div class="relative flex flex-col py-2 mb-3 md:mb-6" v-on-clickaway="toggledOff">
                <div class="relative flex flex-row flex-wrap justify-start w-full">
                  <input
                    v-model="practice.label"
                    type="text"
                    placeholder="Select.."
                    ref="input"
                    class="border-b-2 focus:border-yellow-400 focus:outline-none py-3 font-bold text-xs sm:text-sm w-full"
                    @focus="toggled = true"
                    @keydown="handleKeyDownEvent"
                  />
                </div>
                <div class="relative flex flex-col w-full z-10" v-if="toggled">
                  <div
                    ref="filterSearchOptions"
                    class="absolute w-full option-list flex flex-col bg-white shadow-md overflow-y-auto"
                    :class="{'slide-down': toggled}"
                    @scroll="scrollHandler"
                  >
                    <div class="relative">
                      <div
                        :id="`${item.label}`"
                        class="py-2 px-3 cursor-pointer text-xs sm:text-sm"
                        :class="{'bg-gray-300': activeIndex === index}"
                        v-for="(item, index) in items"
                        :key="`${item.value}-${index}`"
                        @mouseover="activeIndex = index"
                        @click="add(item)"
                      >{{item.label}}</div>
                      <AppLoading :loading="loading" :message="'Loading'" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
        <!-- <div v-for="invoice in invoices" :key="invoice.id">
          <input type="checkbox" v-model="form.items" :valu="invoice.locum_form_a_id" />
          <div class="p-4 text-sm">{{invoice.label}}</div>
        </div>-->
        <AppInput
          v-if="practice.value"
          v-model="form.items"
          :type="'multi-checkbox'"
          @checked="form.items.push($event)"
          @unchecked="form.items.splice(form.items.findIndex(item => item === $event), 1)"
          :name="'items'"
          :label="'Select Form A Invoices'"
          :lists="invoices"
          :error="formError.find(item => item.field === 'items')"
          @blur="CheckEmptyField(form.items, 'items')"
        />
      </div>
    </div>
  </section>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppButton from "@/components/Base/AppButton";
import AppLoading from "@/components/Base/AppLoading";
import AppDate from "@/components/Base/AppDate";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import { mixin as clickaway } from "vue-clickaway";
export default {
  mixins: [clickaway],
  components: {
    AppInput,
    AppButton,
    AppLoading,
    AppDate,
    AppFilterSearch
  },
  data() {
    return {
      saveLoading: false,
      loading: false,
      loadingJobParts: false,
      practice: {
        label: "",
        value: null
      },
      form: {
        locum_user_id: null,
        type: null,
        items: []
      },
      formError: [],
      // !
      hasMore: false,
      items: [],
      toggled: false,
      activeIndex: 0,
      totalJobParts: 0,
      invoices: []
    };
  },
  watch: {
    // "form.type"(newValue, oldValue) {
    //   if (newValue && oldValue) {
    //     this.practice.label = "";
    //     this.practice.value = null;
    //     this.form = {
    //       locum_user_id: this.$auth.user.id,
    //       type: newValue,
    //       items: []
    //     };
    //     this.getLists(this.items.length);
    //   }
    // }
  },
  computed: {
    // url() {
    //   return this.form.type === "Platform"
    //     ? "/api/v1/locum/practices"
    //     : "/api/v1/locum/private-practices";
    // }
  },
  mounted() {
    this.form.locum_user_id = this.$auth.user.id;
    this.form.type = "Platform";

    let params = {
      can_generate_form_b: true,
      status: "Active"
    };

    this.loading = true;
    this.$axios
      .$get(`/api/v1/locum/practices`, { params })
      .then(res => {
        if (res.data.practices.length === 0) {
          this.hasMore = false;
        } else {
          res.data.practices.forEach(item => {
            this.items.push({
              label: item.name,
              value: item.id
            });
          });
          if (res.data.practices.length < 10) {
            this.hasMore = false;
          }
        }
      })
      .catch(err => {
        console.log("err", err.response || err);
        this.$store.commit("SET_NOTIFICATION", {
          enabled: true,
          status: "success",
          text: [`${err.response.data.message}`]
        });
        throw err;
      })
      .finally(() => {
        this.loading = false;
      });
  },
  methods: {
    save() {
      this.formError = [];
      this.form.type === "Platform"
        ? (this.form.practice_id = this.practice.value)
        : (this.form.private_practice_id = this.practice.value);
      this.Validate(this.form, []);
      if (!this.formError.length) {
        this.saveLoading = true;
        this.$axios
          .$post(`/api/v1/locum/locum-invoices-form-b`, this.form)
          .then(res => {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
            this.$emit("createFormB", res.data.locum_invoice_form_b);
          })
          .catch(err => {
            console.log("err", err.response || err);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${err.response.data.message}`]
            });
            throw err;
          })
          .finally(() => {
            this.saveLoading = false;
          });
      }
    },
    viewAsPdf(invoiceId) {
      window.open(
        `${process.env.API_URL}/api/v1/locum-invoices/${invoiceId}/pdf`
      );
    },
    // !
    getLists(offset) {
      let params = {
        can_generate_form_b: true,
        status: "Active"
      };

      this.loading = true;
      this.hasMore = true;
      this.$axios
        .$get(
          `${
            this.form.type === "Platform"
              ? "/api/v1/locum/practices"
              : "/api/v1/locum/private-practices"
          }`,
          { params }
        )
        .then(res => {
          this.items = [];
          if (res.data.practices) {
            if (res.data.practices.length === 0) {
              this.hasMore = false;
            } else {
              res.data.practices.forEach(item => {
                this.items.push({
                  label: item.name,
                  value: item.id
                });
              });
              if (res.data.practices.length < 10) {
                this.hasMore = false;
              }
            }
          }

          // if (res.data.private_practices) {
          //   if (res.data.private_practices.length === 0) {
          //     this.hasMore = false;
          //   } else {
          //     res.data.private_practices.forEach(item => {
          //       this.items.push({
          //         label: item.name,
          //         value: item.id
          //       });
          //     });
          //     if (res.data.private_practices.length < 10) {
          //       this.hasMore = false;
          //     }
          //   }
          // }
        })
        .catch(err => {
          console.log("err", err.response || err);
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "danger",
              text: [`${err.response.data.message}`]
            });
          }
        })
        .finally(() => {
          this.loading = false;
        });
    },
    getJobPartsCount() {
      const params = {
        locum_status: ["Approved"],
        can_generate_form_b: true,
        job_type: "Platform",
        job_practice_id: [this.practice.value]
      };
      return this.$axios
        .$get(`/api/v1/locum/job-parts/count`, { params })
        .then(res => {
          this.totalJobParts = res.data.count;
        })
        .catch(err => {
          console.log("err", err.response || err);
          throw err;
        });
    },
    getJobParts() {
      const params = {
        locum_status: ["Approved"],
        can_generate_form_b: true,
        job_type: "Platform",
        job_practice_id: [this.practice.value]
      };
      return this.$axios
        .$get(`/api/v1/locum/job-parts`, { params })
        .then(res => {
          this.invoices = [];
          res.data.job_parts.forEach(item => {
            this.invoices.push({
              value: item.locum_form_a_id,
              label: item.job_part_number
            });
          });
        })
        .catch(err => {
          console.log("err", err.response || err);
          throw err;
        });
    },
    scrollHandler(e) {
      if (
        this.$refs.filterSearchOptions.offsetHeight +
          this.$refs.filterSearchOptions.scrollTop >=
        this.$refs.filterSearchOptions.scrollHeight - 1
      ) {
        if (this.hasMore === true && !this.loading) {
          this.getLists(this.items.length);
        }
      }
    },
    toggledOff() {
      this.toggled = false;
    },
    async add(item) {
      this.practice.value = item.value;
      this.practice.label = item.label;
      this.toggled = false;

      this.loadingJobParts = true;
      await this.getJobPartsCount();
      await this.getJobParts();
      this.loadingJobParts = false;
    },
    remove() {
      this.practice.label = "";
      this.practice.value = null;
    },
    handleKeyDownEvent(e) {
      if (
        !["ArrowUp", "ArrowDown", "Enter", "Backspace", "Escape"].includes(
          event.key
        )
      ) {
        e.preventDefault();
      }
      if (!this.toggled) {
        return;
      }
      if (event.key === "ArrowUp") {
        if (this.activeIndex > 0) {
          this.activeIndex--;
        }
      }
      if (event.key === "ArrowDown") {
        if (this.activeIndex < this.items.length - 1) {
          this.activeIndex++;
        }
      }
      if (event.key === "Enter") {
        this.add(this.items[this.activeIndex]);
      }
      if (event.key === "Backspace") {
        if (!this.search) {
          //   this.remove(this.value.length - 1);
          this.remove();
        }
        this.$refs.input.focus();
      }
      if (event.key === "Escape") {
        this.toggledOff();
      }
    }
  }
};
</script>
<style scoped>
.items-table {
  width: 733px;
}
</style>