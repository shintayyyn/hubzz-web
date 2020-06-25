<template>
  <div class="text-black">
    <!-- HEADER -->
    <div class="flex flex-wrap overflow-hidden md:mx-1 md:pl-3 mb-1 pb-1 text-sm">
      <AppButton
        v-if="forViewing == true"
        class="mr-2"
        :label="'Export As PDF'"
        :icon="'cloud-download'"
        @click="toPDF()"
      />
      <!-- <AppButton
        v-if="forViewing == true" 
				class="mr-2"
				:label="'Test HTML'"
				:icon="'cloud-download'"
				@click="testHtml()"
			/>-->
      <!-- <AppButton
        v-if="forViewing == true" 
				class="mr-2"
				:label="'Test Multiple Page'"
				:icon="'cloud-download'"
				@click="testMultiplePage()"
			/>-->
      <AppButton
        v-if="forViewing == false"
        class="m-2"
        :label="'Save as Final'"
        :icon="'save-icon'"
        @click="createInvoice()"
      />
      <!-- <AppButton
        v-if="forViewing == false"
        class="m-2" 
        :label="'Save as Draft'" 
        :icon="'save-icon'"
			/>-->
      <!-- <AppButton
        v-if="forViewing == false"
        class="m-2" 
        :label="'Clear Entries'" 
        :icon="'save-icon'"
        @click="clearEntries()"
			/>-->
    </div>
    <!-- HEADER ENDS HERE -->

    <!-- BODY -->
    <!-- FIRST PAGE -->
    <AppLoading :loading="loading" spinner :message="'Exporting to PDF'" />
    <div
      id="toPrint"
      class="invoice shadow-lg border-gray-500 md:mx-4 max-w-xl h-full flex flex-col justify-between bg-white"
      :class="!doNotShow && 'display'"
    >
      <div>
        <div ref="pdf-header" class="flex flex-col p-4">
          <div>
            <div class="text-sm text-right">
              <p>Hubzz Limited Mws,</p>
              <p>601 London Road</p>
              <p>Westcliff-On-Sea SS0 9PE</p>
              <p>billing@hubzz.co.uk</p>
              <p>Registered Company</p>
              <p>10832559</p>
            </div>
          </div>
          <div class="flex">
            <div class="w-full ">
              <div
                class="border-2 border-gray-300 rounded-lg p-4 text-sm"
                :class="doNotShow ? 'md:w-2/3' : 'w-2/3'"
              >
                <div class="font-semibold">
                  <div>To: Accounts Department</div>
                  <div class="w-full m-2">
                    <p>{{ practice.name }}</p>
                    <div class="mx-2 text-sm font-light">
                      <p>{{ practice.address_line_1 }}</p>
                      <p>{{ practice.address_line_2 }}</p>
                      <p>{{ practice.address_line_3 }}</p>
                    </div>

                    <div class="mt-2 flex flex-col">
                      <div>For the period</div>
                      <div>
                        <span>{{ $moment(dateStart).format('DD/MM/YYYY') + " to " + $moment(dateEnd).format('DD/MM/YYYY') }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="practiceInvoice" class="w-full flex flex-col-reverse">
              <div class="flex justify-end items-center">
                <div>Invoice Number: </div>
                <div
                  class="pl-1 font-semibold"
                >
                  {{ practiceInvoice.invoice_number }}
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- FOR INVOICES -->
        <div
          v-if="invoiceItems && invoiceItems.length > 0"
          class="flex flex-col overflow-x-auto"
          :class="doNotShow && 'mx-4'"
        >
          <div
            :ref="'items-header'"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex items-center justify-center py-2 bg-black">
              <div class="w-4/6">
                <div class="text-white text-sm text-left px-4">
                  <strong>Description</strong>
                </div>
              </div>
              <div class="w-2/6">
                <div class="text-white text-sm text-right px-4">
                  <strong>£ Amount</strong>
                </div>
              </div>
              <div v-if="forViewing == false">
                <!-- <div class="mr-2" v-if="doNotShow">
									<span
										@click="addInvoiceItem()"
										class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
									>+</span>
								</div>-->
              </div>
            </div>
          </div>
          <div
            v-for="(item, index) in invoiceItems"
            :key="`item-${index}`"
            :ref="`item-${index}`"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex w-full justify-center border-b border-gray-500 py-1">
              <div v-if="forViewing == false" class="w-2/3 text-sm mx-1">
                <textarea
                  v-if="doNotShow"
                  v-model="item.description"
                  rows="2"
                  class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
                  placeholder="Enter Description"
                />
                <p
                  v-else
                  class="text-left px-2 py-1"
                >
                  {{ item.description ? item.description : "No Description" }}
                </p>
              </div>
              <div v-else class="w-full max-w px-2 py-1">
                {{ item.description }}
              </div>
              <div class="w-1/3 text-sm mx-1">
                <template v-if="forViewing == false">
                  <input
                    v-if="doNotShow"
                    v-model="item.total"
                    class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right shadow-none"
                    :class="!doNotShow && 'pr-3'"
                    type="number"
                    min="0"
                    placeholder="Enter Total"
                  >
                </template>
                <p v-else class="px-2 py-1 text-right text-black">
                  {{ item.total }}
                </p>
              </div>
              <template v-if="forViewing == false">
                <div v-if="doNotShow" class="mr-2 flex items-center">
                  <span
                    class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                    @click="deductInvoiceItem(item.id)"
                  >-</span>
                </div>
              </template>
            </div>
          </div>
        </div>
        <!-- FOR DISPUTED -->
        <div
          v-if="disputedItems && disputedItems.length > 0"
          class="flex flex-col overflow-x-auto"
          :class="doNotShow && 'mx-4'"
        >
          <div
            :ref="'items-header'"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex items-center justify-center py-2 bg-black">
              <div class="w-4/6">
                <div class="text-white text-sm text-left px-4">
                  <strong>Disputed Job Description</strong>
                </div>
              </div>
              <div class="w-2/6">
                <div class="text-white text-sm text-right px-4">
                  <strong>£ Amount</strong>
                </div>
              </div>
              <!-- <div v-if="forViewing == false">
								<div class="mr-2" v-if="doNotShow">
									<span
										@click="addInvoiceItem()"
										class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
									>+</span>
								</div>
							</div>-->
            </div>
          </div>
          <div
            v-for="(item, index) in disputedItems"
            :key="`item-${index}`"
            :ref="`item-${index}`"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex w-full justify-center border-b border-gray-500 py-1">
              <div v-if="forViewing == false" class="w-2/3 text-sm mx-1">
                <textarea
                  v-if="doNotShow"
                  v-model="item.description"
                  rows="2"
                  class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
                  placeholder="Enter Description"
                />
                <p
                  v-else
                  class="text-left px-2 py-1"
                >
                  {{ item.description ? item.description : "No Description" }}
                </p>
              </div>
              <div v-else class="w-full max-w px-2 py-1">
                {{ item.description }}
              </div>
              <div class="w-1/3 text-sm mx-1">
                <template v-if="forViewing == false">
                  <input
                    v-if="doNotShow"
                    v-model="item.total"
                    class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right shadow-none"
                    :class="!doNotShow && 'pr-3'"
                    type="number"
                    min="0"
                    placeholder="Enter Total"
                  >
                </template>
                <p v-else class="px-2 py-1 text-right text-black">
                  {{ item.total }}
                </p>
              </div>
              <template v-if="forViewing == false">
                <div v-if="doNotShow" class="mr-2 flex items-center">
                  <span
                    class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                    @click="deductDisputedItem(item.id)"
                  >-</span>
                </div>
              </template>
            </div>
          </div>
        </div>
        <!-- FOR DEBITS -->
        <div v-if="createdDebitItems && createdDebitItems.length > 0" class="flex flex-col overflow-x-auto" :class="doNotShow && 'mx-4'">
          <div
            :ref="'items-header'"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex items-center justify-center py-2 bg-black">
              <div class="w-4/6">
                <div class="text-white text-sm text-left px-4">
                  <strong>Debit Description</strong>
                </div>
              </div>
              <div class="w-2/6">
                <div class="text-white text-sm text-right px-4">
                  <strong>£ Amount</strong>
                </div>
              </div>
              <div v-if="forViewing == false">
                <div v-if="doNotShow" class="mr-2">
                  <span
                    class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                    @click="addDebitItem()"
                  >+</span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-for="(item, index) in createdDebitItems"
            :key="`item-${index}`"
            :ref="`item-${index}`"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex w-full justify-center border-b border-gray-500 py-1">
              <div v-if="forViewing == false" class="w-2/3 text-sm mx-1">
                <textarea
                  v-if="doNotShow"
                  v-model="item.description"
                  :maxlength="maxChars"
                  rows="2"
                  class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
                  placeholder="Enter Description"
                />
                <p
                  v-else
                  class="text-left px-2 py-1"
                >
                  {{ item.description ? item.description : "No Description" }}
                </p>
              </div>
              <div v-else class="w-full max-w px-2 py-1">
                {{ item.description }}
              </div>
              <div class="w-1/3 text-sm mx-1">
                <template v-if="forViewing == false">
                  <input
                    v-if="doNotShow"
                    v-model="item.total"
                    class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right shadow-none"
                    :class="!doNotShow && 'pr-3'"
                    type="number"
                    min="0"
                    placeholder="Enter Total"
                  >
                </template>
                <p v-else class="px-2 py-1 text-right text-md font-semibold">
                  {{ item.total }}
                </p>
              </div>
              <template v-if="forViewing == false">
                <div v-if="doNotShow" class="mr-2 flex items-center">
                  <span
                    class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                    @click="deductDebitItem(item.id)"
                  >-</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <!-- FOR CREDITS -->
        <div v-if="createdCreditItems && createdCreditItems.length > 0" class="flex flex-col overflow-x-auto" :class="doNotShow && 'mx-4'">
          <div
            :ref="'items-header'"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex items-center justify-center py-2 bg-black">
              <div class="w-4/6">
                <div class="text-white text-sm text-left px-4">
                  <strong>Credit Description</strong>
                </div>
              </div>
              <div class="w-2/6">
                <div class="text-white text-sm text-right px-4">
                  <strong>£ Amount</strong>
                </div>
              </div>
              <div v-if="forViewing == false">
                <div v-if="doNotShow" class="mr-2">
                  <span
                    class="bg-gray-900 hover:bg-gray-800 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                    @click="addCreditItem()"
                  >+</span>
                </div>
              </div>
            </div>
          </div>
          <div
            v-for="(item, index) in createdCreditItems"
            :key="`item-${index}`"
            :ref="`item-${index}`"
            :class="!doNotShow && 'px-4'"
            :style="`min-width: ${doNotShow ? '733px' : ''}`"
          >
            <div class="flex w-full justify-center border-b border-gray-500 py-1">
              <div v-if="forViewing == false" class="w-2/3 text-sm mx-1">
                <textarea
                  v-if="doNotShow"
                  v-model="item.description"
                  rows="2"
                  class="border-b-2 border-gray-300 w-full h-full focus:outline-none resize-none py-1 px-4"
                  placeholder="Enter Description"
                />
                <p
                  v-else
                  class="text-left px-2 py-1"
                >
                  {{ item.description ? item.description : "No Description" }}
                </p>
              </div>
              <div v-else class="w-full max-w px-2 py-1">
                {{ item.description }}
              </div>
              <div class="w-1/3 text-sm mx-1">
                <template v-if="forViewing == false">
                  <input
                    v-if="doNotShow"
                    v-model="item.total"
                    class="border-b-2 border-gray-300 w-full h-full focus:outline-none text-right shadow-none"
                    :class="!doNotShow && 'pr-3'"
                    type="number"
                    min="0"
                    placeholder="Enter Total"
                  >
                </template>
                <p v-else class="px-2 py-1 text-right text-md font-semibold">
                  {{ '- '+item.total }}
                </p>
              </div>
              <template v-if="forViewing == false">
                <div v-if="doNotShow" class="mr-2 flex items-center">
                  <span
                    class="bg-black hover:bg-gray-900 w-6 h-6 cursor-pointer font-semibold flex items-center justify-center rounded-full text-white"
                    @click="deductCreditItem(item.id)"
                  >-</span>
                </div>
              </template>
            </div>
          </div>
        </div>

        <div ref="items-total" class="flex justify-between px-4 pt-2">
          <div class="my-1 px-1 w-3/4 font-bold">
            Total
          </div>
          <div class="my-1 px-1 w-1/4 text-right text-lg font-semibold">
            {{ "£ " + practiceInvoice.total_amount.toFixed(2) }}
          </div>
        </div>
        <div class="flex flex-row justify-between px-4 w-full">
          <span class="my-1 px-1 font-bold">
            Total Hours
          </span>
          <div class="my-1 px-1 text-right text-lg font-semibold">
            {{ totalHoursSum + ' Hours' }}
          </div>
        </div>
      </div>
      <!-- <div class="p-4" ref="pdf-footer">
				<div class="border-2 border-gray-300 rounded-lg p-2 text-sm">
					Payment by BACS:
					<br />Account name: XXX
					<br />Bank: XXX
					<br />Sort code: XXX
					<br />Account number: XXX
					<br />
				</div>
			</div>-->
    </div>
    <!-- FIRST PAGE ENDS HERE -->
    <!-- BODY ENDS HERE-->
  </div>
</template>

<script>
import AppLoading from "@/components/Base/AppLoading"
import AppButton from "@/components/Base/AppButton"
export default {
	components: {
		AppLoading,
		AppButton
	},
	props: [
		"forViewing",
		"practice",
		"practiceInvoice",
		"locumInvoice",
		"invoiceItems",
		"disputedItems",
		"debitItems",
		"creditItems",
		"dateStart",
		"dateEnd",
		"byLocum"
	],
	data () {
		return {
			toPostPracticeInvoice: {
				practice_id: "",
				date_start: "",
				date_end: "",
				items: [],
				total_amount: ""
			},
			// createdInvoiceItems: [],
			// createdDisputedItems: [],
			createdDebitItems: [],
			createdCreditItems: [],
			invoice: {},
			doNotShow: true,
			practices: [],
			chosenPractice: [],
			loading: false,

			maxChars: 100
		}
	},
	computed: {
		amountTotal: function () {
			let grossSum = 0
			let invoiceItemTotal = 0
			let disputedItemTotal = 0
			let debitTotal = 0
			let creditTotal = 0
			const reducer = (accumulator, currentValue) => accumulator + currentValue

			if (this.invoiceItems && this.invoiceItems.length > 0) {
				let invoiceItems = this.invoiceItems.map(invoiceItem =>
					parseFloat(invoiceItem.total)
				)
				invoiceItemTotal = invoiceItems.reduce(reducer)
			}

			if (this.disputedItems && this.disputedItems.length > 0) {
				let disputedItems = this.disputedItems.map(disputedItem =>
					parseFloat(disputedItem.total)
				)
				disputedItemTotal = disputedItems.reduce(reducer)
			}

			grossSum = parseFloat(invoiceItemTotal + disputedItemTotal)

			if (this.createdDebitItems && this.createdDebitItems.length > 0) {
				let createdDebitItems = this.createdDebitItems.map(debitItem =>
					parseFloat(debitItem.total)
				)
				debitTotal = createdDebitItems.reduce(reducer)
			}

			if (this.createdCreditItems && this.createdCreditItems.length > 0) {
				let createdCreditItems = this.createdCreditItems.map(creditItem =>
					parseFloat(creditItem.total)
				)
				creditTotal = createdCreditItems.reduce(reducer)
			}
			const netSum = parseFloat(grossSum + debitTotal - creditTotal).toFixed(2)
			return netSum
    },
    totalHoursSum: function () {
      let totalHours = 0
      const reducer = (accumulator, currentValue) => accumulator + currentValue
      if (this.invoiceItems && this.invoiceItems.length > 0) {
        let invoiceItemHours = this.invoiceItems.map(invoiceItem => 
          parseFloat(invoiceItem.total_hours ? invoiceItem.total_hours : 0)
        )
        totalHours = invoiceItemHours.reduce(reducer)
      }
      return totalHours.toFixed(2)
    },
  },
  
	created () {
    console.log('invoiceItems', this.invoiceItems)
		// if (this.invoiceItems) {
		//   this.createdInvoiceItems = this.invoiceItems
		// }
		// if (this.disputeditems) {
		//   this.createdDisputedItems = this.createdDisputedItems
		// }
		if (this.debitItems) {
			this.createdDebitItems = this.debitItems
		}
		if (this.creditItems) {
			this.createdCreditItems = this.creditItems
		}
	},
	methods: {
		async testHtml () {
			window.open(
				`${process.env.API_URL}/practice-invoices/${this.practiceInvoice.id}/html`
			)
		},

		async testMultiplePage () {
			window.open(`${process.env.API_URL}/practice-invoices/test/pdf`)
		},

		// async testHubzzInvoice() {
		//   window.open(
		//     `${process.env.API_URL}/practice-invoices/${this.practiceInvoice.id}/pdf`
		//   );
		// },

		// async testLocumInvoice() {
		//   window.open(
		//     `${process.env.API_URL}/api/v1/locum-invoices/${this.locumInvoice.id}/pdf`
		//   )
		// },

		toPDF () {
			if (this.locumInvoice) {
				window.open(
					`${process.env.API_URL}/api/v1/locum-invoices/${this.locumInvoice.id}/pdf`
				)
			} else if (this.practiceInvoice) {
				window.open(
					`${process.env.API_URL}/api/v1/practice-invoices/${
						this.practiceInvoice.id
					}/pdf?filename=${"hubzz_" +
						this.$moment(this.practiceInvoice.issued_at, 'YYYY-MM-DD[T]').utc().format("DD/MM/YYYY") +
						"_" +
						this.practiceInvoice.invoice_number +
						"_" +
						this.practiceInvoice.practice.code}`
				)
			}
		},
		async addInvoiceItem () {
			// deduct 1 when dealing with ID for array
			const newItem = {
				job_part: "",
				description: "",
				hours: "",
				amount: 0
			}
			newItem.id = this.invoiceItems.length + 1
			await this.invoiceItems.push(newItem)
		},

		async deductInvoiceItem (itemId) {
			const mapInvoiceItems = this.invoiceItems.map(
				invoiceItem => invoiceItem.id
			)
			await this.invoiceItems.splice(mapInvoiceItems.indexOf(itemId), 1)
		},

		async deductDisputedItem (itemId) {
			const mapDisputedItems = this.disputedItems.map(
				disputedItem => disputedItem.id
			)
			await this.disputedItems.splice(mapDisputedItems.indexOf(itemId), 1)
		},

		async addDebitItem () {
			const newItem = {
				type: "Debit",
				description: "",
				amount: 0
			}
			newItem.id = this.createdDebitItems.length + 1
			await this.createdDebitItems.push(newItem)
		},

		async deductDebitItem (itemId) {
			const mapDebitItems = this.createdDebitItems.map(
				debitItem => debitItem.id
			)
			await this.createdDebitItems.splice(mapDebitItems.indexOf(itemId), 1)
		},

		async addCreditItem () {
			const newItem = {
				type: "Credit",
				description: "",
				amount: 0
			}
			newItem.id = this.createdCreditItems.length + 1
			await this.createdCreditItems.push(newItem)
		},

		async deductCreditItem (itemId) {
			const mapCreditItems = this.createdCreditItems.map(
				creditItem => creditItem.id
			)
			await this.createdCreditItems.splice(mapCreditItems.indexOf(itemId), 1)
		},

		async createInvoice () {
			this.toPostPracticeInvoice.practice_id = (await this.practice.id)
				? this.practice.id
				: null
			this.toPostPracticeInvoice.date_start = (await this.dateStart)
				? this.dateStart
				: null
			this.toPostPracticeInvoice.date_end = (await this.dateEnd)
				? this.dateEnd
				: null
			this.toPostPracticeInvoice.items = await this.invoiceItems.concat(
				this.disputedItems,
				this.createdDebitItems,
				this.createdCreditItems
			)
			this.toPostPracticeInvoice.total_amount = await this.amountTotal

			if (this.toPostPracticeInvoice.items.length > 0) {
				await this.$axios
					.post(`/api/v1/admin/practice-invoices`, this.toPostPracticeInvoice)
					.then(() => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "success",
							text: "Invoice Posted"
						})
					})
					.catch(err => {
						this.$store.commit("SET_NOTIFICATION", {
							enabled: true,
							status: "danger",
							text: err.response.data.message
						})
					})
			} else {
				this.$store.commit("SET_NOTIFICATION", {
					enabled: true,
					status: "danger",
					text: "Items to be invoiced is required"
				})
			}
		},

		async clearEntries () {}
	}
}
</script>
<style>
.display {
	width: 800px;
}
@media (min-width: 480px) {
	.right-side-header-content {
		width: calc(100% - 0px);
	}
}
.page-overlap {
	min-width: 100%;
}
@media screen and (min-width: 768px) {
	.page-overlap {
		min-width: calc(100% - 70px);
	}
	.invoice {
		max-width: 800px;
		min-height: 850px;
	}
}

@media screen and (min-width: 1200px) {
	.page-overlap {
		min-width: calc(100% - 200px);
	}
}

.billing-modal {
	position: fixed;
	top: 0;
	right: 0;
	margin-right: 0%;
	width: 100%;
	height: 100%;
	overflow: hidden auto;
	border-left: solid 2px #ffc72c;
	transition: all 0.3s ease-in-out;
	background-color: #505561;
	z-index: 512;
}
@media screen and (min-width: 1200px) {
	.billing-modal {
		width: 80%;
	}
}
.billing-shield {
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: #333;
	opacity: 0.5;
	z-index: 511;
}
</style>
