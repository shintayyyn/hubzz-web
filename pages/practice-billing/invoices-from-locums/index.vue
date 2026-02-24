<template>
  <section class="relative">
    <div
      v-if="$route.name === 'practice-billing-invoices-from-locums'"
      class="flex flex-row justify-start overflow-x-auto border-b border-gray-500 pt-1"
    >
      <nuxt-link
        :event="initialLoading ? '' : 'click'"
        :to="{
          path: '/practice-billing/invoices-from-locums',
          query: { ...$route.query, status: 'to-be-invoiced' }
        }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name.includes('practice-billing-invoices-from-locums') &&
            (!$route.query.status ||
            ($route.query.status &&
            $route.query.status.toLowerCase() === 'to-be-invoiced'))
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        To be Invoiced
      </nuxt-link>

      <nuxt-link
        :event="initialLoading ? '' : 'click'"
        :to="{
          path: '/practice-billing/invoices-from-locums',
          query: { ...$route.query, status: 'disputed' }
        }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name.includes('practice-billing-invoices-from-locums') &&
            $route.query.status &&
            $route.query.status.toLowerCase() === 'disputed'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Disputed Invoices
      </nuxt-link>

      <nuxt-link
        :event="initialLoading ? '' : 'click'"
        :to="{
          path: '/practice-billing/invoices-from-locums',
          query: { ...$route.query, status: 'issued' }
        }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name.includes('practice-billing-invoices-from-locums') &&
            $route.query.status &&
            $route.query.status.toLowerCase() === 'issued'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Invoiced
      </nuxt-link>

      <nuxt-link
        :event="initialLoading ? '' : 'click'"
        :to="{
          path: '/practice-billing/invoices-from-locums',
          query: { ...$route.query, status: 'approved' }
        }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name.includes('practice-billing-invoices-from-locums') &&
            $route.query.status &&
            $route.query.status.toLowerCase() === 'approved'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Approved Invoices
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'practice-billing-solo-forms' }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name === 'practice-billing-solo-forms'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        Solo Forms
      </nuxt-link>

      <nuxt-link
        :to="{ name: 'practice-billing-form-as' }"
        class="md:mr-5 px-3 py-2 text-xs font-bold cursor-pointer whitespace-no-wrap"
        :class="
          $route.name === 'practice-billing-form-as'
            ? 'border-b-4 border-gray-500'
            : 'text-gray-600'
        "
      >
        NHS Pension Form A
      </nuxt-link>
    </div>
    <AppFilter :enableSearch="false" class="mt-4">
      <template v-slot:extraButton>
        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          :in-style="'padding:5px 14px;margin-bottom:0;font-size:14px;'"
          customTheme="border"
          @click="refreshInvoices"
        />
      </template>
      <template v-slot:filter>
        <div class="w-32">
          <AppInput
            v-model="job_ir35"
            :wrapperClass="'px-1'"
            :type="'select'"
            :name="'job_ir35'"
            :placeholder="'Inside ir35'"
            :items="[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
              { label: 'All', value: '' }
            ]"
            nolabel
            border
          />
        </div>
        <div
          v-if="
            $route.query.status &&
              $route.query.status.toLowerCase() !== 'to-be-invoiced'
          "
        >
          <AppInput
            v-model="invoice_number"
            :wrapperClass="'px-1'"
            :type="'text'"
            :name="'invoice_number'"
            :label="'Invoice number'"
            nolabel
            border
          />
        </div>
        <div class="">
          <AppInput
            v-model="job_part_number_includes"
            :wrapperClass="'px-1'"
            :type="'text'"
            :name="'job_part_number_includes'"
            :label="'Job Part number'"
            nolabel
            border
          />
        </div>
        <div
          v-if="
            $route.query.status &&
              ['approved', 'pension-form-a'].includes(
                $route.query.status.toLowerCase()
              )
          "
          class="w-32"
        >
          <AppInput
            v-model="is_paid"
            :wrapperClass="'px-1'"
            :type="'select'"
            :name="'is_paid'"
            :placeholder="'Paid'"
            :items="[
              { label: 'Yes', value: true },
              { label: 'No', value: false },
              { label: 'All', value: '' }
            ]"
            nolabel
            border
          />
        </div>
        <div class="">
          <AppInput
            v-model="appointed_to_locum_user_name_includes"
            :wrapperClass="'px-1'"
            :type="'text'"
            :name="'appointed_to_locum_user_name_includes'"
            :label="'Locum Name'"
            nolabel
            border
          />
        </div>
        <AppButton :label="'Apply'" class="mx-1" @click="filterJobParts" />
        <AppButton
          :disabled="disabledClearFilter"
          :label="'Clear'"
          customTheme="border hover:bg-gray-200"
          @click="clearFilters"
        />
      </template>
    </AppFilter>

    <transition name="fade" mode="out-in">
      <div
        v-if="initialLoading"
        class="relative flex w-full"
        style="min-height:80px"
      >
        <AppLoading :loading="initialLoading" spinner />
      </div>
    </transition>

    <transition name="fade" mode="out-in">
      <div v-if="!initialLoading">
        <!-- <div class="flex items-center mt-4">
          <button
            class="flex items-center justify-between text-sm p-1 border border-gray-500 rounded mr-2"
            @click="filterModal = !filterModal"
          >
            <p class="mx-2">
              Filter
            </p>
            <span class="mx-2"><svgicon name="caret-down" width="10" :style="filterModal ? 'transform: rotate(180deg)' : ''" /></span>
          </button>
          <transition name="fade">
            <div v-if="filterModal" class="md:px-1 flex w-full">
              <AppButton
                :disabled="disabledClearFilter"
                :label="'Clear'"
                :in-style="'padding:5px 14px;margin-bottom:0'"
                @click="clearFilters"
              />
              <AppButton
                class="mx-2"
                :label="'Search'"
                :in-style="'padding:5px 14px;margin-bottom:0'"
                @click="filterJobParts"
              />
            </div>
          </transition>
          <AppButton
            v-if="showRefresh"
            :label="'Refresh'"
            :in-style="'padding:5px 14px;margin-bottom:0;font-size:14px;'"
            customTheme="border-2"
            @click="refreshInvoices"
          />
        </div>
        <transition name="drop-down">
          <div v-if="filterModal" class="flex flex-col md:flex-row items-start mt-2">
            <div class="my-1 md:my-0 md:px-1 w-full md:flex-1">
              <AppInput
                v-model="job_ir35"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'job_ir35'"
                :label="'Inside ir35'"
                :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
              />
            </div>
            <div
              v-if="$route.query.status && $route.query.status.toLowerCase() !== 'to-be-invoiced'"
              class="my-1 md:my-0 md:px-1 w-full md:flex-1"
            >
              <AppInput
                v-model="invoice_number"
                :wrapperClass="'px-1'"
                :type="'text'"
                :name="'invoice_number'"
                :label="'Invoice number'"
              />
            </div>
            <div class="my-1 md:my-0 md:px-1 w-full md:flex-1">
              <AppInput
                v-model="job_part_number_includes"
                :wrapperClass="'px-1'"
                :type="'text'"
                :name="'job_part_number_includes'"
                :label="'Job Part number'"
              />
            </div>
            <div
              v-if="$route.query.status && ['approved', 'pension-form-a'].includes($route.query.status.toLowerCase())"
              class="my-1 md:my-0 md:px-1 w-full md:flex-1"
            >
              <AppInput
                v-model="is_paid"
                :wrapperClass="'px-1'"
                :type="'select'"
                :name="'is_paid'"
                :label="'Paid'"
                :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
              />
            </div>
          </div>
        </transition> -->
        <AppTable
          v-if="job_parts.length > 0"
          :total="jobPartCount"
          :items="job_parts"
          :loading="loading"
          :current-page="current_page"
          :per-page="limit"
          :columns="columns"
          :order-by="order_by"
          :customWidth="800"
          @pagechanged="pagechanged"
          @limitchanged="limitchanged"
          @sorted="sorted"
        >
          <!-- start of new actions logic -->
          <template v-slot:actions="slotProps">
            <div class="flex flex-col bg-white border rounded border-gray-500">
              <div
                v-if="['approved', 'issued'].includes($route.query.status)"
                class="rounded text-xs px-2 hover:bg-orange-400 text-left cursor-pointer"
                :class="$route.query.status === 'approved' ? '' : 'text-center'"
                @click="
                  $router.push({
                    path: `/practice-billing/invoices-from-locums/${slotProps.item.locum_invoice_id}`,
                    query: { ...$route.query }
                  })
                "
              >
                View
              </div>
              <template
                v-if="
                  practice.type !== 'Spoke' ||
                    !practice.parent_practice_id ||
                    practice.parent_practice_id !==
                    slotProps.item.locum_invoice_parent_practice_id ||
                    practice.allow_surgery_bill_locum === true
                "
              >
                <div
                  v-if="
                    slotProps.item.locum_invoice_id &&
                      slotProps.item.invoice_status !== 'To Be Invoice' &&
                      slotProps.item.locum_invoice_status !== 'Approved' &&
                      $route.query.status !== 'issued'
                  "
                  class="rounded text-xs px-2 hover:bg-orange-400 text-left cursor-pointer"
                  :class="
                    $route.query.status === 'approved' ? '' : 'text-center'
                  "
                  @click="
                    $router.push({
                      path: `/practice-billing/invoices-from-locums/${slotProps.item.locum_invoice_id}/edit`,
                      query: { ...$route.query }
                    })
                  "
                >
                  {{
                    authPermissions.includes("Process Billings")
                      ? "Edit"
                      : "View"
                  }}
                </div>
                <button
                  v-if="
                    $route.query.status === 'approved' &&
                      !slotProps.item.locum_invoice_paid_at &&
                      authPermissions.includes('Process Billings')
                  "
                  class="rounded text-xs px-2 hover:bg-orange-400 text-left cursor-pointer"
                  :class="
                    $route.query.status === 'approved' ? '' : 'text-center'
                  "
                  @click.stop.prevent="
                    select_invoice(slotProps.item.locum_invoice_id)
                  "
                >
                  Mark as Paid
                </button>
              </template>

              <!-- v-if="slotProps.item.status === 'Approved' && slotProps.item.locum_invoice_item && !slotProps.item.locum_invoice_item.locum_invoice.paid_at
              && $route.query.status === 'approved'"-->

              <!-- Mark as paid - NI/PAYE -->
              <div
                v-else-if="$route.name === 'practice-invoices-from-locums'"
                class="text-gray-600"
              >
                Disabled by Hub
              </div>
            </div>
          </template>
          <!-- end of new actions logic -->
        </AppTable>
        <div
          v-if="!job_parts.length && !isFiltered"
          class="flex justify-center"
        >
          {{ noJobPartsToDisplay }}
        </div>
        <div
          v-if="!job_parts.length && isFiltered"
          class="flex justify-center py-4"
        >
          No Jobs Found
        </div>

        <!-- NI / PAYE Payment Modal -->
        <div v-if="payment_modal" class="p-2">
          <div
            class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3"
          >
            <AppDate
              v-model="form.paid_at"
              :name="'paid_at'"
              :label="'Payment made on'"
              :error="formError.find(item => item.field === 'paid_at')"
              is-before
            />
            <template v-if="ir35">
              <AppInput
                v-model="form.ni"
                :type="'select'"
                :name="'ni'"
                :label="'NI'"
                :items="[
                  { label: 'No', value: false },
                  { label: 'Yes', value: true }
                ]"
              />
              <AppInput
                v-if="[true, 'true'].includes(form.ni)"
                v-model="form.ni_amount"
                :type="'number'"
                :name="'ni_amount'"
                :label="'NI Amount'"
                :in-style="
                  'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'
                "
                :limit="8"
                :error="formError.find(item => item.field === 'ni_amount')"
              />
              <AppInput
                v-model="form.paye"
                :type="'select'"
                :name="'paye'"
                :label="'PAYE'"
                :items="[
                  { label: 'No', value: false },
                  { label: 'Yes', value: true }
                ]"
              />
              <AppInput
                v-if="[true, 'true'].includes(form.paye)"
                v-model="form.paye_amount"
                :type="'number'"
                :name="'paye_amount'"
                :label="'PAYE Amount'"
                :in-style="
                  'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'
                "
                :limit="8"
                :error="formError.find(item => item.field === 'paye_amount')"
              />
            </template>
            <div class="flex flex-row flex-no-wrap justify-center">
              <AppButton
                class="mx-1"
                :label="'Save'"
                :in-style="'padding:5px 10px'"
                @click="confirmPayment"
              />
              <AppButton
                class="mx-1"
                :label="'Cancel'"
                :in-style="'padding:5px 10px'"
                @click="payment_modal = false"
              />
            </div>
          </div>
        </div>

        <AppConfirmationModal
          :label="'Send this Solo Form to Locum?'"
          :confirm-label="'Yes'"
          :cancel-label="'Cancel'"
          :modal="send_solo_form_modal"
          @confirm="sendForm"
          @cancel="send_solo_form_modal = false"
        />

        <transition name="fade" mode="out-in">
          <nuxt-link
            v-if="
              [
                'practice-billing-invoices-from-locums-id',
                'practice-billing-invoices-from-locums-id-edit'
              ].includes($route.name) ||
                payment_modal ||
                locumFormAIdToBePaid
            "
            :to="{
              name: 'practice-billing-invoices-from-locums',
              query: { ...$route.query }
            }"
            class="shield"
          />
        </transition>
        <nuxt-child @updateInvoice="updateInvoice" />
      </div>
    </transition>
  </section>
</template>

<script>
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
import AppTable from "@/components/Base/AppTable";
import AppDate from "@/components/Base/AppDate";
import AppButton from "@/components/Base/AppButton";
import AppInput from "@/components/Base/AppInput";
import AppLoading from "@/components/Base/AppLoading";
import AppFilter from "@/components/Base/AppFilter";

export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },

  components: {
    AppConfirmationModal,
    AppTable,
    AppDate,
    AppButton,
    AppLoading,
    AppInput,
    AppFilter
  },

  data() {
    return {
      user: "",
      practice: "",

      initialLoading: false,
      loading: false,
      filterModal: false,
      isFiltered: false,
      jobPartCount: 0,
      job_parts: [],

      showRefresh: false,
      current_page: 1,

      offset: 0,
      limit: 15,
      order_by: [],
      job_ir35: null,
      invoice_number: null,
      job_part_number_includes: null,
      appointed_to_locum_user_name_includes: null,
      is_paid: null,

      payment_modal: false,
      invoice_id: null,
      send_solo_form_modal: false,
      form: {
        paid_at: null,
        ni: false,
        ni_amount: null,
        paye: false,
        paye_amount: null
      },
      formError: [],

      locumFormAPaidAt: null,
      locumFormAIdToBePaid: null
    };
  },

  computed: {
    columns() {
      let columns = [];

      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : "to-be-invoiced";

      columns.push({
        name: "Practice / Surgery",
        dataIndex: "practice_name",
        class: "text-center",
        sortable: true
      });

      if (queryStatus !== "to-be-invoiced") {
        columns.push({
          name: "Invoice Number",
          dataIndex: "locum_invoice_invoice_number",
          sortable: true,
          width: 130
        });
      }

      columns.push(
        {
          name: "Job Part No.",
          dataIndex: "job_part_number",
          sortable: true,
          width: 130
        },
        {
          name: "Job Title",
          dataIndex: "title",
          sortable: true
        },
        {
          name: "£ Amount",
          dataIndex: "job_part_gross_rate_formatted",
          class: "text-center",
          sortable: true,
          width: 120
        },
        {
          name: "Under IR35",
          dataIndex: "ir35",
          class: "text-center",
          sortable: true,
          width: 100
        },
        {
          name: "Under Parent Practice",
          dataIndex: "under_parent_practice",
          class: "text-center",
          sortable: true,
          width: 150
        }
      );

      if (["approved"].includes(queryStatus)) {
        columns.push({
          name: "Paid Invoice",
          dataIndex: "locum_invoice_paid_formatted",
          class: "text-center",
          sortable: true,
          width: 100
        });

        columns.push({
          name: "Practice Paid At",
          dataIndex: "locum_invoice_paid_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 100
        });

        columns.push({
          name: "Locum Paid At",
          dataIndex: "locum_invoice_locum_paid_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 100
        });
      }

      if (queryStatus === "approved") {
        columns.push({
          name: "Approved At",
          dataIndex: "approved_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 150
        });
      } else if (queryStatus === "to-be-invoiced") {
        columns.push({
          name: "Completed At",
          dataIndex: "completed_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 150
        });
      } else {
        columns.push({
          name: "Issued",
          dataIndex: "locum_invoice_issued_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
          width: 150
        });
      }

      columns.push({
        name: "Locum",
        dataIndex: "appointed_to_locum_user_name",
        class: "text-center",
        sortable: true
      });

      if (queryStatus !== "to-be-invoiced") {
        columns.push({
          name: "Actions",
          dataIndex: "actions",
          class: `${queryStatus === "approved" ? "dropdown" : "text-center"}`,
          initialDropdown: "View",
          width: queryStatus === "approved" ? 115 : 80
        });
      }

      return columns;
    },

    ir35() {
      if (!this.invoice_id) {
        return false;
      }
      let selectedInvoice = this.job_parts.find(
        item => item.locum_invoice_id === this.invoice_id
      );
      return selectedInvoice.ir35 ? selectedInvoice.ir35 : false;
    },

    authPermissions() {
      return this.$store.getters["permissions"];
    },

    noJobPartsToDisplay() {
      let str = "";
      let queryStatus = this.$route.query.status;
      switch (queryStatus && queryStatus.toLowerCase()) {
      case "to-be-invoiced":
        str = "You do not have any completed job parts.";
        break;
      case "disputed":
        str = "You do not have any disputed invoices.";
        break;
      case "issued":
        str = "You do not have any issued Invoice.";
        break;
      case "approved":
        str = "You do not have any approved job parts.";
        break;
      default:
        str = "";
      }
      return str;
    },

    disabledClearFilter() {
      let jobIr35 = this.job_ir35 === "" ? null : this.job_ir35;
      let isPaid = this.is_paid === "" ? null : this.is_paid;
      let invoiceNumber =
        this.invoice_number === "" ? null : this.invoice_number;
      let jobPartNumberIncludes =
        this.job_part_number_includes === ""
          ? null
          : this.job_part_number_includes;
      let locumName =
        this.appointed_to_locum_user_name_includes === ""
          ? null
          : this.appointed_to_locum_user_name_includes;

      if (
        isPaid === null &&
        jobIr35 === null &&
        invoiceNumber === null &&
        jobPartNumberIncludes === null &&
        locumName === null
      ) {
        return true;
      }
      return false;
    }
  },

  watch: {
    async "$route.query"(newValue, oldValue) {
      console.log("oldvaue", oldValue);
      console.log("newvalue", newValue);
      let newStatus = newValue.status;
      let oldStatus = oldValue.status;
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.current_page = 1;
        this.filterModal = false;
        this.showRefresh = false;
        this.jobPartCount = 0;
        this.job_parts = [];
        this.clearFilters();
        this.isFiltered = false;
        // this.initialLoading = true
        await this.getInvoiceableJobPartsPromiseAll();
        // this.initialLoading = false
      }
    },

    "form.ni"(value) {
      if ([false, "false"].includes(value)) {
        this.form.ni_amount = 0;
      }
    },

    "form.paye"(value) {
      if ([false, "false"].includes(value)) {
        this.form.paye_amount = 0;
      }
    }
  },

  created() {
    console.log("route name", this.$route);
    this.user = this.$auth.user;
    this.practice =
      this.$auth.user &&
      this.$auth.user.domain === "Practice" &&
      this.$auth.user.practice_detail
        ? this.$auth.user.practice_detail.practice
        : null;
  },

  mounted() {
    this.$socket.on(
      "Practice Notification Locum Invoice Created",
      this.getLocumInvoiceRealTime
    );
    this.$socket.on(
      "Practice Notification Locum Invoice Paid",
      this.getLocumInvoiceRealTime
    );
    this.$socket.on(
      "Practice Notification Locum Invoice Updated",
      this.getLocumInvoiceRealTime
    );

    this.initialLoading = true;
    this.getInvoiceableJobPartsPromiseAll()
      .catch(err => {
        console.log("err", err.response || err);
      })
      .finally(() => {
        this.initialLoading = false;
      });
  },

  destroyed() {
    this.$socket.removeListener(
      "Practice Notification Locum Invoice Created",
      this.getLocumInvoiceRealTime
    );
    this.$socket.removeListener(
      "Practice Notification Locum Invoice Paid",
      this.getLocumInvoiceRealTime
    );
    this.$socket.removeListener(
      "Practice Notification Locum Invoice Updated",
      this.getLocumInvoiceRealTime
    );
  },

  methods: {
    toggleSendFormAModal(locumInvoiceId, alreadySent) {
      if (alreadySent) return;
      this.send_solo_form_modal = true;
      this.invoice_id = locumInvoiceId;
    },

    sendForm() {
      this.$axios
        .$put(
          `/api/v1/practice/locum-invoices-solo-form/${this.invoice_id}/send-to-locum`
        )
        .then(res => {
          console.log(res);
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`]
          });
          this.send_solo_form_modal = false;
          let updatedSoloForm = this.job_parts.find(
            jobPart =>
              jobPart.locum_invoice_id ===
              res.data.locum_solo_form.locum_invoice_id
          );
          updatedSoloForm.locum_solo_form_sent_to_locum = 1;
        });
    },

    viewAsPdf(formId, type) {
      let url =
        type === "form-a"
          ? `/api/v1/locum-form-a`
          : type === "solo-form"
            ? `/api/v1/locum-solo-form`
            : `/api/v1/locum-form-b`;
      window.open(`${process.env.API_URL}${url}/${formId}/pdf`);
    },

    getInvoiceableJobPartsPromiseAll() {
      let practiceJobPartStatus = [];
      let locumInvoiceStatus = [];
      let queryStatus = this.$route.query.status;

      switch (queryStatus && queryStatus.toLowerCase()) {
      case "to-be-invoiced":
        locumInvoiceStatus.push("To Be Invoiced");
        practiceJobPartStatus = ["Completed", "Declined", "Cancelled"];
        break;
      case "disputed":
        locumInvoiceStatus.push("Disputed");
        practiceJobPartStatus = ["Completed", "Declined", "Cancelled"];
        break;
      case "issued":
        locumInvoiceStatus.push("Invoiced");
        practiceJobPartStatus = ["Completed", "Declined", "Cancelled"];
        break;
      case "approved":
        locumInvoiceStatus.push("Approved");
        practiceJobPartStatus.push("Approved");
        break;
      default:
        locumInvoiceStatus.push("To Be Invoiced");
        practiceJobPartStatus = ["Completed", "Declined", "Cancelled"];
      }

      const params = {
        practice_job_part_status: practiceJobPartStatus,
        locum_invoiceable: true,
        locum_invoice_status: locumInvoiceStatus,
        type: "Platform",
        ir35: this.job_ir35,
        locum_invoice_paid: this.is_paid,
        locum_invoice_number_includes: this.invoice_number,
        job_part_number_includes: this.job_part_number_includes,
        appointed_to_locum_user_name_includes: this
          .appointed_to_locum_user_name_includes
        // practice_id: this.$auth.user.practice_id,
      };

      this.initialLoading = true;
      return Promise.all([
        this.$axios.$get(`/api/v2/practice/practice-job-parts/count`, {
          params: {
            ...params
          }
        }),
        this.$axios.$get(`/api/v2/practice/practice-job-parts`, {
          params: {
            ...params,
            offset: 0,
            limit: 15
          }
        })
      ])
        .then(([responseTotal, responseJobParts]) => {
          this.jobPartCount = responseTotal.data.count;
          this.job_parts = responseJobParts.data.job_parts;
        })
        .catch(err => {
          console.log("err", err.response || err);
          this.$nuxt.error(err);
        })
        .finally(() => {
          this.initialLoading = false;
        });
    },

    async filterJobParts() {
      this.current_page = 1;
      this.offset = 0;
      this.limit = 15;
      this.initialLoading = true;
      this.isFiltered = true;
      await this.getInvoiceableJobPartsPromiseAll();
      this.initialLoading = false;
      this.filterModal = false;
    },

    getJobParts() {
      let practiceJobPartStatus = [];
      let locumInvoiceStatus = [];
      let queryStatus = this.$route.query.status;

      switch (queryStatus && queryStatus.toLowerCase()) {
      case "to-be-invoiced":
        locumInvoiceStatus.push("To Be Invoiced");
        practiceJobPartStatus = ["Completed", "Declined", "Cancelled"];
        break;
      case "disputed":
        locumInvoiceStatus.push("Disputed");
        practiceJobPartStatus = ["Completed", "Declined", "Cancelled"];
        break;
      case "issued":
        locumInvoiceStatus.push("Invoiced");
        practiceJobPartStatus = ["Completed", "Declined", "Cancelled"];
        break;
      case "approved":
        locumInvoiceStatus.push("Approved");
        practiceJobPartStatus.push("Approved");
        break;
      default:
        locumInvoiceStatus.push("To Be Invoiced");
        practiceJobPartStatus = ["Completed", "Declined", "Cancelled"];
      }

      const params = {
        practice_job_part_status: practiceJobPartStatus,
        locum_invoiceable: true,
        locum_invoice_status: locumInvoiceStatus,
        type: "Platform",
        ir35: this.job_ir35,
        locum_invoice_paid: this.is_paid,
        locum_invoice_number_includes: this.invoice_number,
        job_part_number_includes: this.job_part_number_includes,
        appointed_to_locum_user_name_includes: this
          .appointed_to_locum_user_name_includes
        // practice_id: this.$auth.user.practice_id,
      };

      return this.$axios
        .$get(`/api/v2/practice/practice-job-parts`, {
          params: {
            ...params,
            order_by: this.order_by,
            offset: this.offset,
            limit: this.limit
          }
        })
        .then(res => {
          this.job_parts = res.data.job_parts;
        })
        .catch(err => {
          console.log("err", err.response || err);
        });
    },

    async refreshInvoices() {
      this.loading = true;
      this.current_page = 1;
      this.offset = 0;
      this.limit = 15;
      await this.getInvoiceableJobPartsPromiseAll();
      this.loading = false;
      this.showRefresh = false;
    },

    getLocumInvoiceRealTime({ id }) {
      if (!id) {
        return;
      }
      this.showRefresh = true;
    },

    select_invoice(id) {
      this.payment_modal = true;
      this.form.paid_at = null;
      this.form.ni = false;
      this.form.ni_amount = null;
      this.form.paye = false;
      this.form.paye_amount = null;
      this.invoice_id = id;
    },

    updateInvoice(invoice) {
      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : null;

      let job_part = this.job_parts.find(
        item => item.id === invoice.items[0].job_part.id
      );

      if (job_part) {
        job_part.locum_invoice_id = invoice.id;
        job_part.job_part_gross_rate_formatted =
          invoice.job_part_gross_rate_formatted;

        let index = this.job_parts.findIndex(item => item.id === job_part.id);
        if (index >= 0) {
          if (
            ((!queryStatus ||
              (queryStatus && queryStatus === "to-be-invoiced")) &&
              invoice.status === "Draft") ||
            (queryStatus &&
              queryStatus === "issued" &&
              invoice.status === "Issued") ||
            (queryStatus &&
              queryStatus === "disputed" &&
              invoice.status === "Disputed") ||
            (queryStatus &&
              queryStatus === "approved" &&
              invoice.status === "Approved")
          ) {
            this.job_parts.splice(index, 1, job_part);
          } else {
            this.job_parts.splice(index, 1);
          }
        }
      }
    },

    confirmPayment() {
      let notRequired = ["ni", "paye"];
      if (this.ir35 === false) {
        notRequired.push("ni_amount");
        notRequired.push("paye_amount");
        this.form.ni = false;
        this.form.ni_amount = null;
        this.form.paye = false;
        this.form.paye_amount = null;
      } else if (this.ir35 === true) {
        if ([false, "false"].includes(this.form.ni)) {
          notRequired.push("ni_amount");
        }
        if ([false, "false"].includes(this.form.paye)) {
          notRequired.push("paye_amount");
        }
      }

      console.log("mark as paid form", this.form);

      this.formError = [];
      this.Validate(this.form, notRequired);
      if (!this.formError.length) {
        this.$axios
          .$put(
            `/api/v1/practice/locum-invoices/${this.invoice_id}/paid`,
            this.form
          )
          .then(res => {
            let jobPart = this.job_parts.find(
              item => item.id === res.data.locum_invoice.items[0].job_part.id
            );

            let index = this.job_parts.findIndex(
              item => item.id === jobPart.id
            );

            const locumInvoice = res.data.locum_invoice;

            if (index > -1) {
              jobPart.locum_invoice_paid = locumInvoice.paid;
              jobPart.locum_invoice_paid_formatted =
                locumInvoice.paid_formatted;
              jobPart.locum_invoice_paid_at = locumInvoice.paid_at;
              jobPart.locum_invoice_paid_at_in_gb_formatted =
                locumInvoice.paid_at_in_gb_formatted;
              jobPart.locum_invoice_ni_paye_amount_formatted =
                locumInvoice.ni_paye_amount_formatted;
              jobPart.locum_invoice_locum_tax_formatted =
                locumInvoice.locum_tax_formatted;

              // jobPart.locum_invoice_item.locum_invoice.paid_at
              //   = locumInvoice.paid_at

              // jobPart.locum_invoice_item.locum_invoice.ni
              //   = locumInvoice.ni

              // jobPart.locum_invoice_item.locum_invoice.ni_amount
              //   = locumInvoice.ni_amount

              // jobPart.locum_invoice_item.locum_invoice.paye
              //   = locumInvoice.paye

              // jobPart.locum_invoice_item.locum_invoice.paye_amount
              //   = locumInvoice.paye_amount

              this.job_parts.splice(index, 1, jobPart);
            }

            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });

            this.payment_modal = false;
            this.form.ni = false;
            this.form.ni_amount = null;
            this.form.paye = false;
            this.form.paye_amount = null;
          })
          .catch(err => {
            console.log("err", err.response || err);

            let message = null;

            if (err.response) {
              if (
                err.response.status === 400 &&
                err.response.data.error_messages
              ) {
                this.formError = err.response.data.error_messages;
              } else {
                message = err.response.data.message;
              }
            } else if (err.request) {
              message = "Something weng wrong!";
            } else {
              message = err.message;
            }

            if (message) {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "danger",
                text: [`${message}`]
              });
            }
          });
      }
    },

    async sorted(order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1];
        let sorting = item.split(":")[0];
        switch (sorting) {
        case "practice.name":
          sorting = "practice_name";
          break;
        default:
          sorting;
        }
        return `${sorting}:${order}`;
      });
      this.current_page = 1;
      this.offset = 0;
      this.order_by = orderBy;
      this.loading = true;
      await this.getJobParts();
      this.loading = false;
    },

    async pagechanged(page) {
      this.current_page = page;
      this.offset = this.limit * (page - 1);
      this.loading = true;
      await this.getJobParts();
      this.loading = false;
    },

    async limitchanged(limit) {
      this.current_page = 1;
      this.offset = 0;
      this.limit = limit;
      this.loading = true;
      await this.getJobParts();
      this.loading = false;
    },

    clearFilters() {
      this.offset = 0;
      this.limit = 15;
      this.order_by = [];
      this.job_ir35 = null;
      this.is_paid = null;
      this.invoice_number = null;
      this.job_part_number_includes = null;
      this.appointed_to_locum_user_name_includes = null;
      this.filterJobParts();
    }
  }
};
</script>

<style scoped>
.shield {
  z-index: 511;
}

.payment-modal {
  position: fixed;
  background-color: white;
  z-index: 512;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
