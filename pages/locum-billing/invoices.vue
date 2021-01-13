<template>
  <section class="relative">
    <div class="flex flex-row justify-start overflow-x-auto border-b-2 border-gray-300">
      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'to-be-invoiced' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && (!$route.query.status || ($route.query.status && $route.query.status.toLowerCase() === 'to-be-invoiced')) ? 'border-b-2 border-gray-500' : 'text-gray-600'"
      >
        To be invoiced
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'disputed' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'disputed') ? 'border-b-2 border-gray-500' : 'text-gray-600'"
      >
        Disputed Invoices
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'issued' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'issued') ? 'border-b-2 border-gray-500' : 'text-gray-600'"
      >
        Invoiced
      </nuxt-link>

      <nuxt-link
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'approved' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'approved') ? 'border-b-2 border-gray-500' : 'text-gray-600'"
      >
        Approved Invoices
      </nuxt-link>
      
      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ name: 'locum-billing-solo-forms' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'locum-billing-solo-forms' ? 'border-b-2 border-gray-500' : 'text-gray-600'"
      >
        Solo Forms
      </nuxt-link>

      <nuxt-link
        v-if="false && $auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'pension-form-a' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class=" $route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-a') ? 'border-b-2 border-gray-500' : 'text-gray-600'"
      >
        NHS Pensions Form A
      </nuxt-link>
      
      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP'"
        :to="{ name: 'locum-billing-form-as' }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name === 'locum-billing-form-as' ? 'border-b-2 border-gray-500' : 'text-gray-600'"
      >
        NHS Pensions Form A
      </nuxt-link>

      <nuxt-link
        v-if="$auth.user.locum_detail.profession.profession_category.name === 'GP' || hasFormB"
        :to="{ path: '/locum-billing/invoices', query: { ...$route.query, status: 'pension-form-b' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap"
        :class="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-b') ? 'border-b-2 border-gray-500' : 'text-gray-600'"
      >
        NHS Pensions Form B
      </nuxt-link>
    </div>

    <div
      v-if="$route.name.includes('locum-billing-invoices') && ($route.query.status && $route.query.status.toLowerCase() === 'pension-form-b')"
      class="flex flex-row justify-start overflow-x-auto pb-3"
    >
      <nuxt-link
        :to="{ name: 'locum-billing-invoices-form-b-create', query: { ...$route.query, status: 'pension-form-b' } }"
        class="md:mr-5 p-3 text-sm font-bold cursor-pointer whitespace-no-wrap shadow-sm border-2 rounded-lg text-black bg-yellow-400 hover:bg-yellow-500"
      >
        <div class="flex">
          <div class="mx-1">
            <svgicon
              name="create-job"
              width="21"
              height="21"
              class="fill-current text-black"
            />
          </div>
          <div>
            Generate NHS Form B
          </div>
        </div>
      </nuxt-link>
    </div>

    <transition name="fade" mode="out-in">
      <div v-if="initialLoading" class="relative flex w-full" style="min-height:80px">
        <AppLoading :loading="initialLoading" spinner />
      </div>

      <div v-if="!initialLoading">
        <AppButton
          v-if="!['pension-form-b'].includes($route.query.status)"
          :label="'Filter'"
          :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
          @click="filterModal = !filterModal"
        />

        <AppButton
          v-if="showRefresh"
          :label="'Refresh'"
          :in-style="'padding:5px 14px;margin-bottom:5px;font-size:14px;'"
          @click="refreshInvoices"
        />

        <div
          class="flex-wrap justify-start items-end z-10 absolute w-full bg-white shadow-lg p-3 rounded-lg"
          :class="filterModal ? 'flex' : 'hidden'"
        >
          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_ir35"
              class="px-1"
              :type="'select'"
              :name="'job_ir35'"
              :label="'Inside ir35'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
            />
          </div>

          <div
            v-if="$route.query.status && $route.query.status.toLowerCase() !== 'to-be-invoiced'"
            class="md:px-1 w-full lg:w-1/4 md:w-1/3"
          >
            <AppInput
              v-model="invoice_number"
              class="px-1"
              :type="'text'"
              :name="'invoice_number'"
              :label="'Invoice number'"
            />
          </div>

          <div class="md:px-1 w-full lg:w-1/4 md:w-1/3">
            <AppInput
              v-model="job_part_number_includes"
              class="px-1"
              :type="'text'"
              :name="'job_part_number_includes'"
              :label="'Job Part number'"
            />
          </div>

          <div
            v-if="$route.query.status && ['approved', 'pension-form-a'].includes($route.query.status.toLowerCase())"
            class="md:px-1 w-full lg:w-1/4 md:w-1/3"
          >
            <AppInput
              v-model="is_paid"
              class="px-1"
              :type="'select'"
              :name="'is_paid'"
              :label="'Paid'"
              :items="[{ label: 'Yes', value: true },{ label: 'No', value: false}, { label: 'All', value: null} ]"
            />
          </div>
          
          <div class="md:px-1 flex w-full">
            <AppButton
              :disabled="disabledClearFilter"
              :label="'Clear'"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              @click="clearFilters"
            />
            <AppButton
              class="mx-2"
              :label="'Search'"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              @click="filterJobParts"
            />
            <AppButton
              class="mx-2 md:hidden"
              :label="'Close'"
              :in-style="'padding:5px 14px;margin-bottom:5px'"
              @click="filterModal = false"
            />
          </div>
        </div>

        <template
          v-if="(!$route.query.status || ($route.query.status && $route.query.status !== 'pension-form-b'))"
        >
          <AppTable
            v-if="job_parts.length > 0"
            :total="jobPartCount"
            :items="job_parts"
            :current-page="current_page"
            :per-page="limit"
            :columns="columns"
            :order-by="order_by"
            :loading="loading"
            @pagechanged="pagechanged"
            @limitchanged="limitchanged"
            @sorted="sorted"
          >
            <template v-slot:actions="slotProps">
              <div class="flex flex-wrap justify-center">
                <div
                  v-if="!slotProps.item.locum_invoice_id"
                  class="my-1 py-2 px-3 bg-green-700 hover:bg-green-600 text-white font-bold rounded-lg focus:outline-none cursor-pointer text-sm"
                  @click="$router.push({ path: `/locum-billing/invoices/${slotProps.item.id}/create`, query: {...$route.query} })"
                >
                  Generate Invoice
                </div>

                <div
                  v-if="
                    slotProps.item.locum_invoice_id
                      && slotProps.item.locum_status !== 'Approved' && !['approved', 'issued'].includes($route.query.status)
                  "
                  class="flex flex-wrap justify-around"
                >
                  <div
                    class="whitespace-no-wrap my-1 mx-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                    @click="$router.push({ path: `/locum-billing/invoices/${slotProps.item.locum_invoice_id}/edit`, query: {...$route.query} })"
                  >
                    Edit
                  </div>
                  <button
                    v-if="!$route.query.status || $route.query.status.toLowerCase() === 'to-be-invoiced'"
                    class="whitespace-no-wrap my-1 mx-1 py-2 px-3 bg-red-700 hover:bg-red-600 text-white font-bold rounded-lg focus:outline-none"
                    @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id, 'deleteInvoice')"
                  >
                    Delete
                  </button>
                </div>

                <div
                  v-if="['approved', 'issued'].includes($route.query.status)"
                  class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click="$router.push({ path: `/locum-billing/invoices/${slotProps.item.locum_invoice_id}`, query: {...$route.query} })"
                >
                  View
                </div>

                <div
                  v-if="
                    $route.query.status && $route.query.status === 'pension-form-a'
                      && slotProps.item.nhs_claimable
                      && slotProps.item.locum_form_a_id
                  "
                  class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click="viewAsPdf(slotProps.item.locum_form_a_id, 'form-a')"
                >
                  View Form A
                </div>

                <div
                  v-if="
                    $route.query.status && $route.query.status === 'pension-form-a'
                      && slotProps.item.nhs_claimable
                      && slotProps.item.locum_form_a_id
                      && !slotProps.item.locum_form_a_sent_to_practice
                  "
                  class="my-1 py-2 px-3 font-bold rounded-lg focus:outline-none"
                  :class="slotProps.item.locum_form_a_sent_to_practice ? 'bg-gray-600 text-white cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-400 cursor-pointer'"
                  @click="toggleSendFormAModal(slotProps.item.locum_invoice_id, slotProps.item.locum_form_a_sent_to_practice)"
                >
                  Send Form to Practice
                </div>

                <div
                  v-if="
                    $route.query.status && $route.query.status === 'solo-form'
                      && slotProps.item.ooh
                      && slotProps.item.locum_solo_form_id
                  "
                  class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click="viewAsPdf(slotProps.item.locum_solo_form_id, 'solo-form')"
                >
                  View Solo Form
                </div>

                <!-- <div
                  v-if="
                    $route.query.status && $route.query.status === 'approved'
                      && slotProps.item.locum_invoice_item
                      && !slotProps.item.locum_invoice_item.locum_invoice.paid_at
                  "
                  class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click.stop.prevent="select_invoice(slotProps.item.locum_invoice_id, 'payInvoice')"
                >Mark as Paid</div>-->

                <div
                  v-if="
                    $route.query.status && $route.query.status === 'pension-form-a'
                      && slotProps.item.nhs_claimable
                      && slotProps.item.locum_form_a_id
                      && slotProps.item.locum_form_a_sent_to_practice
                      && !slotProps.item.locum_form_a_paid
                  "
                  class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click.stop.prevent="select_invoice(slotProps.item.locum_form_a_id, 'payFormA')"
                >
                  Mark as Paid
                </div>

                <div
                  v-if="
                    $route.query.status && $route.query.status === 'solo-form'
                      && slotProps.item.ooh
                      && slotProps.item.locum_solo_form_id
                      && slotProps.item.locum_solo_form_sent_to_locum === 1
                      && slotProps.item.locum_solo_form_paid === 0
                  "
                  class="my-1 py-2 px-3 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click.stop.prevent="select_invoice(slotProps.item.locum_solo_form_id, 'paySoloForm')"
                >
                  Mark as Paid
                </div>
              </div>
            </template>
          </AppTable>

          <div
            v-if="!job_parts.length && !isFiltered"
            class="flex justify-center"
          >
            {{ noJobPartsToDisplay }}
          </div>
          <div v-if="!job_parts.length && isFiltered" class="flex justify-center py-4">
            No Jobs Found
          </div>
        </template>

        <template v-if="($route.query.status && $route.query.status === 'pension-form-b')">
          <AppTable
            v-if="locum_form_bs.length > 0"
            :total="jobPartCount"
            :items="locum_form_bs"
            :current-page="current_page"
            :per-page="limit"
            :columns="form_bs_columns"
            :order-by="order_by"
            :loading="loading"
            @pagechanged="pagechanged"
            @limitchanged="limitchanged"
            @sorted="sorted"
          >
            <template v-slot:actions="slotProps">
              <div class="flex justify-center">
                <div
                  class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click="viewAsPdf(slotProps.item.id, 'form-b')"
                >
                  View Form B
                </div>
              </div>
              <!-- <div class="flex justify-center">
                <div
                  class="my-1 p-2 bg-yellow-500 hover:bg-yellow-400 font-bold rounded-lg focus:outline-none cursor-pointer"
                  @click="showTest(slotProps.item.id, 'form-b')"
                >
                  Show Test Form B
                </div>
              </div>-->
            </template>
          </AppTable>
          <div
            v-if="locum_form_bs.length === 0"
            class="flex justify-center"
          >
            {{ noJobPartsToDisplay }}
          </div>
        </template>
      </div>
    </transition>

    <AppConfirmationModal
      :label="'Proceed to delete this draft?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="delete_invoice_modal"
      @confirm="deleteInvoice"
      @cancel="delete_invoice_modal = false, invoice_id = null"
    />

    <div v-if="pay_form_a_modal" class="p-2">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
        <AppDate
          v-model="form.paid_at"
          :name="'paid_at'"
          :label="'Payment made on'"
          :error="formError.find(item => item.field === 'paid_at')"
          is-before
        />
        <div class="flex flex-row flex-no-wrap justify-center">
          <AppButton class="mx-1" :label="'Save'" :in-style="'padding:5px 10px'" @click="payFormA" />
          <AppButton
            class="mx-1"
            :label="'Cancel'"
            :in-style="'padding:5px 10px'"
            @click="pay_form_a_modal = false, invoice_id = null"
          />
        </div>
      </div>
    </div>

    <div v-if="pay_solo_form_modal" class="p-2">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
        <AppDate
          v-model="form.paid_at"
          :name="'paid_at'"
          :label="'Payment made on'"
          :error="formError.find(item => item.field === 'paid_at')"
          is-before
        />
        <div class="flex flex-row flex-no-wrap justify-center">
          <AppButton
            class="mx-1"
            :label="'Save'"
            :in-style="'padding:5px 10px'"
            @click="paySoloForm"
          />
          <AppButton
            class="mx-1"
            :label="'Cancel'"
            :in-style="'padding:5px 10px'"
            @click="pay_solo_form_modal = false, invoice_id = null"
          />
        </div>
      </div>
    </div>

    <div v-if="pay_invoice_modal" class="p-2">
      <div class="rounded-lg shadow-md px-4 py-8 md:px-8 payment-modal border w-5/6 md:w-1/3">
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
            :items="[{ label: 'No', value: false }, { label: 'Yes', value: true }]"
          />
          <AppInput
            v-if="[true, 'true'].includes(form.ni)"
            v-model="form.ni_amount"
            :type="'number'"
            :name="'ni_amount'"
            :label="'NI Amount'"
            :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
            :limit="8"
            :error="formError.find(item => item.field === 'ni_amount')"
          />
          <AppInput
            v-model="form.paye"
            :type="'select'"
            :name="'paye'"
            :label="'PAYE'"
            :items="[{ label: 'No', value: false }, { label: 'Yes', value: true }]"
          />
          <AppInput
            v-if="[true, 'true'].includes(form.paye)"
            v-model="form.paye_amount"
            :type="'number'"
            :name="'paye_amount'"
            :label="'PAYE Amount'"
            :in-style="'padding-top:0.5rem;padding-bottom:0.5rem;text-align:right'"
            :limit="8"
            :error="formError.find(item => item.field === 'paye_amount')"
          />
        </template>
        <div class="flex flex-row flex-no-wrap justify-center">
          <AppButton
            class="mx-1"
            :label="'Save'"
            :in-style="'padding:5px 10px'"
            @click="payInvoice"
          />
          <AppButton
            class="mx-1"
            :label="'Cancel'"
            :in-style="'padding:5px 10px'"
            @click="pay_invoice_modal = false"
          />
        </div>
      </div>
    </div>

    <AppConfirmationModal
      :label="'Generate NHS Form A for this Invoice?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="generate_form_a_modal"
      @confirm="generateFormA"
      @cancel="generate_form_a_modal = false"
    />

    <AppConfirmationModal
      :label="'Send this Form A to Practice?'"
      :confirm-label="'Yes'"
      :cancel-label="'Cancel'"
      :modal="send_form_a_modal"
      @confirm="sendForm"
      @cancel="send_form_a_modal = false"
    />

    <transition name="fade" mode="out-in">
      <nuxt-link
        v-if="
          [
            'locum-billing-invoices-id',
            'locum-billing-invoices-id-create',
            'locum-billing-invoices-id-edit',
            'locum-billing-invoices-form-b-create',
          ].includes($route.name)
            || delete_invoice_modal || pay_form_a_modal || pay_invoice_modal || pay_solo_form_modal
        "
        :to="{ name: 'locum-billing-invoices', query: {...$route.query}}"
        class="shield"
      />
    </transition>

    <nuxt-child
      @createInvoice="createInvoice"
      @updateInvoice="updateInvoice"
      @createFormB="createFormB"
    />
  </section>
</template>

<script>
import AppButton from "@/components/Base/AppButton"
import AppConfirmationModal from "@/components/Base/AppConfirmationModal"
import AppTable from "@/components/Base/AppTable"
import AppInput from "@/components/Base/AppInput"
import AppDate from "@/components/Base/AppDate"
import AppLoading from "@/components/Base/AppLoading"
export default {
  transition: {
    name: "fade",
    mode: "out-in",
  },

  components: {
    AppInput,
    AppDate,
    AppLoading,
    AppButton,
    AppConfirmationModal,
    AppTable,
  },

  data () {
    return {
      hasFormA: false,
      hasFormB: false,

      initialLoading: true,
      loading: false,
      filterModal: false,
      isFiltered: false,
      jobPartCount: 0,
      job_parts: [],
      locum_form_bs: [],

      showRefresh: false,
      current_page: 1,

      offset: 0,
      limit: 5,
      order_by: [],
      job_ir35: null,
      invoice_number: null,
      job_part_number_includes: null,
      is_paid: null,

      form_bs_columns: [
        {
          name: "Type",
          dataIndex: "type",
        },
        {
          name: "Practice",
          dataIndex: "locum_form_a_practice_names",
        },
        // {
        //   name: "Practice",
        //   slot: true,
        //   slotName: "practice_slot",
        // },
        {
          name: "Date Created",
          dataIndex: "date_created_in_gb_formatted",
          class: "text-center",
        },
        {
          name: "Actions",
          dataIndex: "actions",
          class: "text-center",
        },
      ],

      pay_form_a_modal: false,
      pay_solo_form_modal: false,
      pay_invoice_modal: false,
      delete_invoice_modal: false,
      generate_form_a_modal: false,
      send_form_a_modal: false,
      invoice_id: null,

      form: {
        paid_at: null,
        ni: false,
        ni_amount: null,
        paye: false,
        paye_amount: null,
      },

      formError: [],
    }
  },

  computed: {
    ir35 () {
      if (!this.invoice_id) {
        return false
      }
      let selectedInvoice = this.job_parts.find(
        item => item.locum_invoice_id === this.invoice_id
      )
      return selectedInvoice.job_ir35 ? selectedInvoice.job_ir35 : false
    },

    locumProfessionCategoryName () {
      return this.$auth.loggedIn && this.$auth.user
        ? this.$auth.user.profession_category_name
        : null
    },

    columns () {
      let columns = []
      let queryStatus = this.$route.query.status
        ? this.$route.query.status.toLowerCase()
        : "to-be-invoiced"

      columns.push({
        name: "Practice / Surgery",
        dataIndex: "practice_name",
        class: "text-center",
        sortable: true,
      })

      if (queryStatus !== "to-be-invoiced") {
        columns.push({
          name: "Invoice Number",
          dataIndex: "invoice_number",
          sortable: true,
        })
      }

      columns.push(
        {
          name: "Job Part Number",
          dataIndex: "job_part_number",
          sortable: true,
        },
        {
          name: "Job Title",
          dataIndex: "job_title",
          sortable: true,
        },
        {
          name: "£ Amount",
          dataIndex: "job_part_gross_rate_formatted",
          class: "text-center",
          sortable: true,
        },
      )

      if (this.locumProfessionCategoryName === 'GP') {
        columns.push(
          {
            name: "OOH",
            dataIndex: "ooh",
            class: "text-center",
            sortable: true,
          },
          {
            name: "NHS Claimable",
            dataIndex: "nhs_claimable_formatted",
            class: "text-center",
            sortable: true,
          }
        )
      }

      if (["approved", "solo-form",].includes(queryStatus)) {
        columns.push({
          name: "Paid Invoice",
          dataIndex: "paid_formatted",
          class: "text-center",
          sortable: true,
        })
      }

      if (["approved",].includes(queryStatus)) {
        columns.push({
          name: "Paid At",
          dataIndex: "paid_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
        })
      }

      if (["pension-form-a",].includes(queryStatus)) {
        columns.push({
          name: "Paid By Practice At",
          dataIndex: "locum_form_a_paid_by_practice_at_formatted",
          class: "text-center",
        })

        columns.push({
          name: "Paid By Locum At",
          dataIndex: "locum_form_a_paid_at_formatted",
          class: "text-center",
        })
      }

      if (queryStatus === "approved" || queryStatus === "pension-form-a" || queryStatus === "solo-form") {
        columns.push({
          name: "Approved At",
          dataIndex: "approved_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
        })
      } else if (queryStatus === "to-be-invoiced") {
        columns.push({
          name: "Completed At",
          dataIndex: "completed_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
        })
      } else {
        columns.push({
          name: "Issued",
          dataIndex: "issued_at_in_gb_formatted",
          class: "text-center",
          sortable: true,
        })
      }

      columns.push({
        name: "Actions",
        dataIndex: "actions",
        class: "text-center",
      })

      return columns
    },

    authPermissions () {
      return this.$store.getters["permissions"]
    },

    noJobPartsToDisplay () {
      let str = ""
      let queryStatus = this.$route.query.status
      switch (queryStatus && queryStatus.toLowerCase()) {
      case "to-be-invoiced":
        str = "You do not have any completed job parts."
        break
      case "disputed":
        str = "You do not have any disputed invoices."
        break
      case "issued":
        str = "You do not have any invoiced job parts."
        break
      case "approved":
        str = "You do not have any approved job parts."
        break
      case "solo-form":
        str = "You do not have any solo forms."
        break
      case "pension-form-a":
        str = "You do not have any nhs form a."
        break
      case "pension-form-b":
        str = "You do not have any nhs form b."
        break
      default:
        str = "You do not have any completed job parts."
      }
      return str
    },

    disabledClearFilter () {
      let jobIr35 = this.job_ir35 === "" ? null : this.job_ir35
      let isPaid = this.is_paid === "" ? null : this.is_paid
      let invoiceNumber
        = this.invoice_number === "" ? null : this.invoice_number
      let jobPartNumberIncludes
        = this.job_part_number_includes === ""
          ? null
          : this.job_part_number_includes

      if (
        isPaid === null
        && jobIr35 === null
        && invoiceNumber === null
        && jobPartNumberIncludes === null
      ) {
        return true
      }
      return false
    },
  },

  watch: {
    async "$route.query" (newValue, oldValue) {
      let newStatus = newValue.status
      let oldStatus = oldValue.status
      if (newStatus && newStatus !== null && newStatus !== oldStatus) {
        this.current_page = 1
        this.filterModal = false
        this.showRefresh = false
        this.jobPartCount = 0
        this.job_parts = []
        this.clearFilters()
        this.isFiltered = false
        this.initialLoading = true
        await this.getJobPartsPromiseAll()
        this.initialLoading = false
      }
    },
  },

  mounted () {
    this.$socket.on("Locum Notification Locum Invoice Created", this.getLocumInvoiceRealTime)
    this.$socket.on("Locum Notification Locum Invoice Paid", this.getLocumInvoiceRealTime)
    this.$socket.on("Locum Notification Locum Invoice Updated", this.getLocumInvoiceRealTime)

    this.current_page = 1
    this.filterModal = false
    this.showRefresh = false
    this.jobPartCount = 0
    this.job_parts = []
    this.clearFilters()
    this.isFiltered = false
    this.initialLoading = true
    this.getJobPartsPromiseAll().finally(() => {
      this.initialLoading = false
    })
  },

  destroyed () {
    this.$socket.removeListener("Locum Notification Locum Invoice Created", this.getLocumInvoiceRealTime)
    this.$socket.removeListener("Locum Notification Locum Invoice Paid", this.getLocumInvoiceRealTime)
    this.$socket.removeListener("Locum Notification Locum Invoice Updated", this.getLocumInvoiceRealTime)
  },

  methods: {
    toggleSendFormAModal (locumInvoiceId, alreadySent) {
      if (alreadySent) return
      this.send_form_a_modal = true
      this.invoice_id = locumInvoiceId
    },
    
    sendForm () {
      this.$axios
        .$put(
          `/api/v1/locum/locum-invoices-form-a/${this.invoice_id}/send-to-practice`
        )
        .then(res => {
          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
          this.send_form_a_modal = false

          const updatedFormA = this.job_parts.find(
            jobPart =>
              jobPart.locum_invoice_id
              === res.data.locum_form_a.locum_invoice_id
          )

          if (updatedFormA) {
            updatedFormA.locum_form_a_sent_to_practice = true
          }
        })
    },
    // showTest(id) {
    //   this.$axios.$get(`/api/v1/locum/locum-invoices-form-b/${id}`).then(res => {
    //     console.log(res.data.locum_invoice_form_b)
    //   })
    // },
    viewAsPdf (formId, type) {
      let url
        = type === "form-a"
          ? `/api/v1/locum-form-a`
          : type === "solo-form"
            ? `/api/v1/locum-solo-form`
            : `/api/v1/locum-form-b`
      window.open(`${process.env.API_URL}${url}/${formId}/pdf`)
    },

    generateFormA () {
      this.$axios
        .$post(`/api/v1/locum/locum-invoices-form-a`, {
          locum_invoice_id: this.invoice_id,
        })
        .then(res => {
          let index = this.job_parts.findIndex(
            item => item.locum_invoice_id === this.invoice_id
          )
          if (index >= 0) {
            let jobPart = this.job_parts[index]
            jobPart.locum_form_a_id = res.data.locum_invoice_form_a.id
            this.job_parts.splice(index, 1, jobPart)
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response && err.response.data && err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${err.response.data.message}`,],
            })
          }
          throw err
        })
        .finally(() => {
          this.generate_form_a_modal = false
        })
    },

    getJobPartsPromiseAll () {
      let url = `/api/v1/locum/job-parts`
      let invoice_status = []
      let locum_status = []
      let locum_invoiceable = null
      let nhs_claimable = null
      let ooh = null
      let generate_form = null
      let sent_to_locum = null
      let queryStatus = this.$route.query.status

      switch (queryStatus && queryStatus.toLowerCase()) {
      case "to-be-invoiced":
        invoice_status.push("To Be Invoiced")
        locum_status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
        break
      case "disputed":
        invoice_status.push("Disputed")
        locum_status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
        break
      case "issued":
        invoice_status.push("Invoiced")
        locum_status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
        break
      case "approved":
        invoice_status.push("Approved")
        locum_status.push("Approved")
        locum_invoiceable = true
        break
      case "solo-form":
        invoice_status.push("Approved")
        locum_status.push("Approved")
        locum_invoiceable = true
        ooh = true
        generate_form = true
        sent_to_locum = true
        break
      case "pension-form-a":
        invoice_status.push("Approved")
        locum_status.push("Approved")
        locum_invoiceable = true
        nhs_claimable = true
        ooh = false
        generate_form = true
        break
      case "pension-form-b":
        url = `/api/v1/locum/locum-invoices-form-b`
        break
      default:
        invoice_status.push("To Be Invoiced")
        locum_status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
      }
      return Promise.all([
        this.$axios.$get(`${url}/count`, {
          params: {
            invoice_status,
            locum_status,
            locum_invoiceable,
            nhs_claimable,
            ooh,
            sent_to_locum,
            generate_form,
            job_type: "Platform",
            type: "Platform",
            job_ir35: this.job_ir35,
            is_paid: this.is_paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.job_part_number_includes,
            viewing_locum_user_id: this.$auth.user.id,
          },
        }),
        this.$axios.$get(`${url}`, {
          params: {
            invoice_status,
            locum_status,
            locum_invoiceable,
            nhs_claimable,
            ooh,
            sent_to_locum,
            generate_form,
            job_type: "Platform",
            type: "Platform",
            job_ir35: this.job_ir35,
            is_paid: this.is_paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.job_part_number_includes,
            viewing_locum_user_id: this.$auth.user.id,
            offset: 0,
            limit: 5,
          },
        }),
      ])
        .then(([responseTotal, response,]) => {
          this.jobPartCount = responseTotal.data.count
          if (response.data && response.data.job_parts) {
            let job_parts = response.data.job_parts

            this.job_parts = job_parts.map(jobPart => {
              return {
                ...jobPart,
              }
            })
          } else if (response.data && response.data.locum_form_bs) {
            this.locum_form_bs = response.data.locum_form_bs.map(item => {
              return {
                ...item,
                practice: item.forms[0].practice_name,
              }
            })
          }
        })
        .catch(([errTotal, err,]) => {
          console.log(
            "err",
            errTotal.response || errTotal || err.response || err
          )
          throw err
        })
    },
    async filterJobParts () {
      this.current_page = 1
      this.offset = 0
      this.limit = 5
      this.initialLoading = true
      this.isFiltered = true
      await this.getJobPartsPromiseAll()
      this.initialLoading = false
      this.filterModal = false
    },

    getJobParts () {
      let url = `/api/v1/locum/job-parts`
      let invoice_status = []
      let locum_status = []
      let locum_invoiceable
      let nhs_claimable
      let ooh
      let sent_to_locum
      let generate_form
      let queryStatus = this.$route.query.status

      switch (queryStatus && queryStatus.toLowerCase()) {
      case "to-be-invoiced":
        invoice_status.push("To Be Invoiced")
        locum_status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
        break
      case "disputed":
        invoice_status.push("Disputed")
        locum_status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
        break
      case "issued":
        invoice_status.push("Invoiced")
        locum_status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
        break
      case "approved":
        invoice_status.push("Approved")
        locum_status.push("Approved")
        locum_invoiceable = true
        break
      case "solo-form":
        invoice_status.push("Approved")
        locum_status.push("Approved")
        locum_invoiceable = true
        ooh = true
        generate_form = true
        sent_to_locum = true
        break
      case "pension-form-a":
        invoice_status.push("Approved")
        locum_status.push("Approved")
        locum_invoiceable = true
        nhs_claimable = true
        ooh = false
        generate_form = true
        break
      case "pension-form-b":
        url = `/api/v1/locum/locum-invoices-form-b`
        break
      default:
        invoice_status.push("To Be Invoiced")
        locum_status = ["Completed", "Declined", "Cancelled",]
        locum_invoiceable = true
      }
      return this.$axios
        .$get(`${url}`, {
          params: {
            invoice_status,
            locum_status,
            locum_invoiceable,
            nhs_claimable,
            ooh,
            sent_to_locum,
            generate_form,
            job_type: "Platform",
            type: "Platform",
            viewing_locum_user_id: this.$auth.user.id,
            offset: this.offset,
            limit: this.limit,
            job_ir35: this.job_ir35,
            is_paid: this.is_paid,
            invoice_number: this.invoice_number,
            job_part_number_includes: this.job_part_number_includes,
            order_by: this.order_by,
          },
        })
        .then(res => {
          if (res.data && res.data.job_parts) {
            let job_parts = res.data.job_parts

            this.job_parts = job_parts.map(jobPart => {
              return {
                ...jobPart,
              }
            })
          } else if (res.data && res.data.locum_form_bs) {
            this.locum_form_bs = res.data.locum_form_bs.map(item => {
              return {
                ...item,
                practice: item.forms[0].practice_name,
              }
            })
          }
        })
        .catch(err => {
          console.log("err", err.response || err)
        })
    },
    async refreshInvoices () {
      this.loading = true
      this.current_page = 1
      this.offset = 0
      this.limit = 5
      await this.getJobPartsPromiseAll()
      this.loading = false
      this.showRefresh = false
    },
    getLocumInvoiceRealTime ({ id, }) {
      if (!id) {
        return
      }
      this.showRefresh = true
    },

    select_invoice (id, type) {
      this.invoice_id = id
      this.form.paid_at = null
      this.form.ni = false
      this.form.ni_amount = null
      this.form.paye = false
      this.form.paye_amount = null
      if (type === "deleteInvoice") {
        this.delete_invoice_modal = true
      } else if (type === "payFormA") {
        this.pay_form_a_modal = true
      } else if (type === "payInvoice") {
        this.pay_invoice_modal = true
      } else if (type === "paySoloForm") {
        this.pay_solo_form_modal = true
      }
    },
    deleteInvoice () {
      this.$axios
        .$delete(`/api/v1/locum/locum-invoices/${this.invoice_id}`)
        .then(res => {
          let job_part = this.job_parts.find(item => {
            return item.locum_invoice_id === this.invoice_id
          })
          let index = this.job_parts.findIndex(item => {
            return item.locum_invoice_id === this.invoice_id
          })
          let queryStatus = this.$route.query.status

          if (
            !queryStatus
            || (queryStatus && queryStatus.toLowerCase() === "to-be-invoiced")
          ) {
            job_part.locum_invoice_id = null
          } else if (
            queryStatus
            && ["disputed", "issued",].includes(queryStatus.toLowerCase())
          ) {
            this.job_parts.splice(index, 1)
          }

          this.refreshInvoices()

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${err.response.data.message}`,],
            })
          }
          throw err
        })
        .finally(() => {
          this.delete_invoice_modal = false
        })
    },
    payInvoice () {
      this.$axios
        .$put(`/api/v1/locum/locum-invoices/${this.invoice_id}/paid`, this.form)
        .then(res => {
          let updatedInvoice = this.job_parts.find(
            jobPart => jobPart.locum_invoice_id === res.data.locum_invoice.id
          )

          updatedInvoice.locum_invoice_item.locum_invoice.paid_at
            = res.data.locum_invoice.paid_at

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${err.response.data.message}`,],
            })
          }
          throw err
        })
        .finally(() => {
          this.pay_invoice_modal = false
        })
    },
    paySoloForm () {
      this.$axios
        .$put(
          `/api/v1/locum/locum-solo-forms/${this.invoice_id}/paid`,
          this.form
        )
        .then(res => {
          let updatedSoloForm = this.job_parts.find(
            jobPart =>
              jobPart.locum_invoice_id
              === res.data.locum_solo_form.locum_invoice_id
          )

          updatedSoloForm.locum_solo_form_paid = 1

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${res.message}`,],
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${err.response.data.message}`,],
            })
          }
          throw err
        })
        .finally(() => {
          this.pay_solo_form_modal = false
        })
    },
    payFormA () {
      this.$axios
        .put(`/api/v1/locum/locum-form-as/${this.invoice_id}/paid`, this.form)
        .then((response) => {
          const locumFormA = response.data.data.locum_form_a

          let jobPart = this.job_parts.find(jobPart => jobPart.locum_form_a_id === locumFormA.id)

          if (jobPart) {
            jobPart.locum_form_a_paid = locumFormA.paid
            jobPart.locum_form_a_paid_formatted = locumFormA.paid_formatted
            jobPart.locum_form_a_paid_at = locumFormA.paid_at
            jobPart.locum_form_a_paid_at = locumFormA.paid_at_formatted
          }

          this.$store.commit("SET_NOTIFICATION", {
            enabled: true,
            status: "success",
            text: [`${response.data.message}`,],
          })
        })
        .catch(err => {
          console.log("err", err.response || err)
          if (err.response.data.message) {
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${err.response.data.message}`,],
            })
          }
          throw err
        })
        .finally(() => {
          this.pay_form_a_modal = false
        })
    },
    async createFormB () {
      this.loading = true
      await this.getJobParts()
      this.loading = false
      // this.locum_form_bs.push({
      //   ...invoice,
      //   date_created: app
      //     .$moment(invoice.date_created, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
      //     .format("DD-MM-YYYY"),
      //   practice: invoice.forms[0].practice_name
      // });

      // job_parts.forEach(item => {
      //   locum_form_bs.push({
      //     ...item,
      //     date_created: app
      //       .$moment(item.date_created, "YYYY-MM-DD[T]HH:mm:ss.SSS[Z]")
      //       .format("DD-MM-YYYY"),
      //     practice: item.forms[0].practice_name
      //   });
      // });
    },
    async createInvoice () {
      this.loading = true
      await this.getJobParts()
      this.loading = false
      // let queryStatus = this.$route.query.status;

      // let job_part = this.job_parts.find(
      //   item => item.id === invoice.items[0].job_part.id
      // );
      // job_part.locum_invoice_id = invoice.id;
      // let index = this.job_parts.findIndex(item => item.id === job_part.id);
      // if (index >= 0) {
      //   if (
      //     queryStatus &&
      //     queryStatus.toLowerCase() === "to-be-invoiced" &&
      //     invoice.status === "Draft"
      //   ) {
      //     this.job_parts.splice(index, 1, job_part);
      //   } else if (invoice.status !== "Draft") {
      //     this.job_parts.splice(index, 1);
      //   }
      // }
    },
    async updateInvoice () {
      this.loading = true
      await this.getJobParts()
      this.loading = false
      // let queryStatus = this.$route.query.status;

      // let job_part = this.job_parts.find(
      //   item => item.id === invoice.items[0].job_part.id
      // );
      // job_part.locum_invoice_id = invoice.id;

      // let index = this.job_parts.findIndex(item => item.id === job_part.id);
      // if (index >= 0) {
      //   if (
      //     ((!queryStatus ||
      //       (queryStatus && queryStatus.toLowerCase() === "to-be-invoiced")) &&
      //       invoice.status === "Draft") ||
      //     (queryStatus &&
      //       queryStatus.toLowerCase() === "issued" &&
      //       invoice.status === "Issued") ||
      //     (queryStatus &&
      //       queryStatus.toLowerCase() === "disputed" &&
      //       invoice.status === "Disputed") ||
      //     (queryStatus &&
      //       queryStatus.toLowerCase() === "approved" &&
      //       invoice.status === "Approved")
      //   ) {
      //     this.job_parts.splice(index, 1, job_part);
      //   } else {
      //     this.job_parts.splice(index, 1);
      //   }
      // }
    },
    async sorted (order_by) {
      let orderBy = order_by.map(item => {
        let order = item.split(":")[1]
        let sorting = item.split(":")[0]
        switch (sorting) {
        default:
          sorting
        }
        return `${sorting}:${order}`
      })
      this.current_page = 1
      this.offset = 0
      this.order_by = orderBy
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },
    async pagechanged (page) {
      this.current_page = page
      this.offset = this.limit * (page - 1)
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },
    async limitchanged (limit) {
      this.current_page = 1
      this.offset = 0
      this.limit = limit
      this.loading = true
      await this.getJobParts()
      this.loading = false
    },
    clearFilters () {
      this.offset = 0
      this.limit = 5
      this.order_by = []
      this.job_ir35 = null
      this.is_paid = null
      this.invoice_number = null
      this.job_part_number_includes = null
      this.filterJobParts()
    },
  },
}
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
