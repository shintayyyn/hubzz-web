<template>
  <section class="relative">
    <AppLoading :loading="loading" spinner />
    <div class="flex flex-wrap justify-start items-center">
      <div
        v-if="allApproved"
        class="save-button text-xs sm:text-sm ml-4 mx-2 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
        @click="save(false)"
      >Save changes</div>
      <div
        class="save-button text-xs sm:text-sm ml-4 mx-2 py-2 px-3 border-2 rounded-lg font-bold flex items-center"
        @click="exportToPdf()"
      >Export to PDF</div>
    </div>

    <div class="flex flex-row flex-wrap justify-start items-center my-4">
      <label class="mx-1 py-2 px-3">Type:</label>
      <button
        :class="type === 'Platform' ? 'bg-yellow-500 border-yellow-500' : 'hover:bg-gray-200'"
        class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none"
        @click="type = 'Platform'"
        :disabled="true"
      >Platform</button>
    </div>

    <!-- pdf form -->
    <div id="htmlpdf" class="max-w-3xl my-4 bg-white px-4 py-4 border shadow-md mb-32">
      <!-- pdf header -->
      <div class="flex flex-col p-4" :ref="'pdf-header'">
        <div class="text-xs sm:text-sm sm:text-right leading-normal">
          <div>{{locum_user.name}}</div>
          <div>{{locum_user.email}}</div>
        </div>
        <div class="flex flex-wrap justify-between my-2">
          <div
            class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3"
          >
            <section>
              <div class="relative flex flex-col py-2 mb-3 md:mb-6">
                <div class="relative flex flex-row flex-no-wrap justify-between">
                  <label class="text-xs sm:text-sm py-1">To: Accounts Department</label>
                </div>
                <div class="relative flex flex-row flex-wrap justify-start">
                  <input
                    v-model="surgery_name"
                    type="text"
                    placeholder="Select.."
                    ref="input"
                    class="border-b-2 w-full focus:border-yellow-400 focus:outline-none py-3 font-bold text-xs sm:text-sm"
                    readonly
                  />
                </div>
              </div>
            </section>
            <div
              class="text-xs sm:text-sm"
              v-if="selectedInvoice && selectedInvoice.surgery && selectedInvoice.surgery.address"
            >
              <div>{{selectedInvoice.surgery.address.line_1}}</div>
              <div>{{selectedInvoice.surgery.address.line_2}}</div>
              <div>{{selectedInvoice.surgery.address.line_3}}</div>
              <div>{{selectedInvoice.surgery.address.post_code}}</div>
            </div>
          </div>
          <div class="w-full sm:w-1/2 order-1 sm:order-2 sm:text-right leading-normal">
            <div class="font-bold text-sm sm:text-lg">{{selectedInvoice.status.toUpperCase()}}</div>
            <div class="text-xs sm:text-sm">{{issuedAt | localDate}}</div>
          </div>
        </div>
      </div>

      <div class="overflow-auto">
        <div class="items-table">
          <!-- thead / items header -->
          <div class="flex justify-start" :ref="'items-header'">
            <div
              style="width:430px"
              class="bg-gray-900 text-white px-4 py-1 font-semibold border-r-2 border-white"
            >Description</div>
            <div style="width:200px" class="bg-gray-900 text-white px-4 py-1 font-semibold">Total</div>
            <div style="width:110px" class="bg-gray-900 flex items-center justify-center">
              <span
                v-if="type === 'Private'"
                class="cursor-pointer w-6 h-6 mx-2 md:mx-4 rounded-full bg-white text-gray-900 font-semibold text-xl flex justify-center items-center hover:bg-gray-200"
                @click="addItem"
              >+</span>
            </div>
          </div>
          <!-- tbody -->
          <div
            :id="`invoice-item-${index}`"
            class="flex flex-col"
            v-for="(item, index) in selectedJobParts"
            :ref="`item-${index}`"
            :key="item.id"
          >
            <div class="flex justify-start mt-2">
              <div
                style="width:430px;min-height:80px;"
                class="text-xs sm:text-sm border-b-2 border-gray-300 px-4 py-1"
              >{{modifiedDescription(item)}}</div>
              <div
                style="min-height:80px;"
                class="text-xs sm:text-sm border-b-2 border-gray-300 px-4 py-1 text-right"
                :style="approvedInvoices.includes(item.job_part_id) ? 'width:310px':'width:200px'"
              >{{modifiedTotal(item)}}</div>
              <div class="align-middle sticky right-0 bg-white">
                <div class="flex flex-row flex-no-wrap justify-start items-center">
                  <input
                    v-model="disputedInvoices"
                    :id="`${item.job_part_id}-disputed`"
                    type="checkbox"
                    :value="item.job_part_id"
                    disabled
                  />
                  <label
                    :for="`${item.job_part_id}-disputed`"
                    class="text-xs sm:text-sm py-1 flex items-center"
                  >Disputed</label>
                </div>
                <div class="flex flex-row flex-no-wrap justify-start items-center">
                  <input
                    :disabled="item.approve || waitingForLocumReply(item)"
                    v-model="approvedInvoices"
                    :id="`${item.job_part_id}-approved`"
                    type="checkbox"
                    :value="item.job_part_id"
                  />
                  <label
                    :for="`${item.job_part_id}-approved`"
                    class="text-xs sm:text-sm py-1 flex items-center"
                  >Approved</label>
                </div>
                <div class="flex" v-if="waitingForLocumReply(item)">
                  <div>Waiting for Locum Reply</div>
                </div>
              </div>
            </div>
            <div
              class="flex justify-start mt-2"
              v-if="disputedInvoices.includes(item.job_part_id) && !approvedInvoices.includes(item.job_part_id)"
            >
              <div class="flex flex-col px-2" style="width:210px;">
                <label for="absent_days">Days of absent</label>
                <input
                  :disabled="item.approve || approvedInvoices.includes(item.job_part_id)"
                  type="number"
                  min="0"
                  v-model="item.absent_days"
                  name="absent_days"
                  class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                />
              </div>
              <div class="flex flex-col px-2" style="width:210px;">
                <label for="late_hours">Hours of late</label>
                <input
                  :disabled="item.approve || approvedInvoices.includes(item.job_part_id)"
                  type="number"
                  min="0"
                  v-model="item.late_hours"
                  name="late_hours"
                  class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                />
              </div>
              <div class="flex flex-col px-2" style="width:210px;">
                <label for="final_hours">Final hours</label>
                <input
                  :disabled="item.approve || approvedInvoices.includes(item.job_part_id)"
                  type="number"
                  min="0"
                  v-model="item.final_hours"
                  name="final_hours"
                  class="border-b-2 focus:outline-none h-full p-2 py-3 sm:text-sm text-right text-xs w-full focus:border-yellow-500"
                />
              </div>
            </div>
            <div
              class="flex justify-start mt-2"
              v-if="disputedInvoices.includes(item.job_part_id) && !approvedInvoices.includes(item.job_part_id)"
            >
              <div class="flex flex-col" style="width:630px;">
                <label for="remarks">Update remarks</label>
                <textarea
                  :disabled="item.approve || approvedInvoices.includes(item.job_part_id)"
                  v-model="item.remarks"
                  rows="3"
                  name="remarks"
                  class="w-full text-xs sm:text-sm resize-none border-b-2 border-gray-300 focus:border-yellow-500 focus:outline-none px-4 my-2"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div :ref="'days-worked'" class="flex flex-row flex-wrap justify-between px-2">
        <div class="w-full md:w-1/2 pr-1">
          <AppDate
            v-model="form.date_start"
            :name="'date_start'"
            :label="'Days worked from'"
            :error="formError.find(item => item.field === 'date_start')"
            :disabled="true"
          />
        </div>
        <div class="w-full md:w-1/2 pl-1">
          <AppDate
            v-model="form.date_end"
            :name="'date_end'"
            :label="'To'"
            :error="formError.find(item => item.field === 'date_end')"
            :disabled="true"
          />
        </div>
      </div>

      <div :ref="'items-total'" class="flex justify-between m-2 px-2">
        <span class="font-bold">Total</span>
        <div>
          <div class="flex justify-end">
            <div
              class="rounded-lg bg-red-500 p-1 text-xs sm:text-sm text-white"
              v-if="formError.find(item => item.field === 'total_amount')"
            >{{formError.find(item => item.field === 'total_amount').message}}</div>
          </div>
          £ {{amount | currency}}
        </div>
      </div>

      <div :ref="'pdf-footer'" class="rounded-lg border-2 border-gray-300 mt-4 p-4">
        <div class="flex flex-col text-xs sm:text-sm">
          <div>Payment by BACS:</div>
          <div>Account name: Rick Sanchez</div>
          <div>Bank: citadel of Ricks Mutiversal Bank</div>
          <div>Sort code: 13</div>
          <div>Account number: 7337#4*OR</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
// import html2canvas from "html2canvas";
import AppLoading from "@/components/Base/AppLoading";
import AppDate from "@/components/Base/AppDate";
import AppInput from "@/components/Base/AppInput";
import AppFilterSearch from "@/components/Base/AppFilterSearch";
import { mixin as clickaway } from "vue-clickaway";
export default {
  mixins: [clickaway],
  props: ["selectedInvoice"],
  transition: {
    name: "slide",
    mode: "out-in"
  },
  components: {
    AppLoading,
    AppDate,
    AppInput,
    AppFilterSearch
  },
  data() {
    return {
      loading: false,

      disputedInvoices: [],
      approvedInvoices: [],
      defaultSelectedJobParts: [],

      type: null,

      practices: [],
      practice_id: "",
      jobs: [],
      invoice: "",
      rowData: [],
      description: "",
      total: "",
      form: {
        surgery_id: null,
        date_start: null,
        date_end: null,
        items: [],
        final: null
      },
      formError: [],
      // input select surgeries
      surgery_name: "",
      // input select job
      searchJobParts: "",
      selectedJobParts: [],
      locum_user: null
    };
  },
  computed: {
    modifiedDescription() {
      return item => {
        let selectedItem = this.selectedInvoice.items.find(
          invoice => invoice.job_part.id === item.job_part_id
        );
        if (parseInt(item.final_hours) === selectedItem.final_hours) {
          return item.description;
        } else {
          let selectedJobPart = this.selectedJobParts.find(
            jobPart => jobPart.job_part_id === item.job_part_id
          );
          selectedJobPart.description = `Job number ${selectedItem.job_part.job_part_number} ${selectedItem.job_part.job.type} Job at £${selectedItem.job_part.job.rate} ${selectedItem.job_part.job.locum_detail_rate_type.name} from ${selectedItem.job_part.date_start} to ${selectedItem.job_part.date_end} / ${selectedItem.job_part.job.shift.name} / Total hours of ${item.final_hours}`;
          return selectedJobPart.description;
        }
      };
    },
    allApproved() {
      return (
        this.selectedInvoice.items.filter(invoice => invoice.approved === false)
          .length > 0
      );
    },
    modifiedTotal() {
      return item => {
        let selectedItem = this.selectedInvoice.items.find(
          invoice => invoice.job_part.id === item.job_part_id
        );
        if (parseInt(item.final_hours) === selectedItem.final_hours) {
          return item.total;
        } else {
          let selectedJobPart = this.selectedJobParts.find(
            jobPart => jobPart.job_part_id === item.job_part_id
          );

          let total = "";
          // compute total
          if (
            selectedItem.job_part.job.locum_detail_rate_type.name === "Per Hour"
          ) {
            total =
              parseInt(selectedItem.job_part.job.rate) *
              parseInt(selectedJobPart.final_hours);
          } else if (
            selectedItem.job_part.job.locum_detail_rate_type.name ===
            "Per Whole Day Session"
          ) {
            total =
              (parseInt(selectedJobPart.final_hours) / 8) *
              parseInt(selectedItem.job_part.job.rate);
          } else if (
            selectedItem.job_part.job.locum_detail_rate_type.name ===
            "Per Half Day Session"
          ) {
            total =
              (parseInt(selectedJobPart.final_hours) / 4) *
              parseInt(selectedItem.job_part.job.rate);
          }
          console.log(total);
          total = !total ? "0.00" : total.toFixed(2).toString();
          console.log(total);
          selectedJobPart.total = total;
          return selectedJobPart.total;
        }
      };
    },
    amount() {
      if (this.selectedJobParts && this.selectedJobParts.length > 0) {
        let amount = 0;
        this.selectedJobParts.forEach(item => {
          if (item.total) {
            amount += parseFloat(item.total);
          }
        });
        return amount;
      }
    },
    filteredJobParts() {
      return this.jobParts.filter(filterItem => {
        const index = this.selectedJobParts.findIndex(item => {
          return item.job_part_id === filterItem.id;
        });
        return index === -1 && filterItem;
      });
    },
    issuedAt() {
      return this.selectedInvoice.issued_at
        ? this.selectedInvoice.issued_at
        : "Not yet issued";
    }
  },
  watch: {
    invoice(value) {
      if (value) {
        if (value) {
          this.rowData.push({ description: value, total: 5 });
        }
        this.invoice = null;
      }
    },
    approvedInvoices(newValue, oldValue) {
      let selectedId = newValue
        .filter(newId => !oldValue.includes(newId))
        .concat(oldValue.filter(oldId => !newValue.includes(oldId)))[0];
      if (!selectedId) {
        return;
      }
      let defaultSelectedJobPart = this.defaultSelectedJobParts.find(
        item => item.job_part_id === selectedId
      );

      let selectedJobPart = this.selectedJobParts.find(
        item => item.job_part_id === selectedId
      );
      let test = this.selectedInvoice.items.find(
        item => item.job_part.id === selectedJobPart.job_part_id
      );

      let total = null;

      if (newValue.includes(selectedId)) {
        defaultSelectedJobPart.description = `Job number ${test.job_part.job_part_number} ${test.job_part.job.type} Job at £${test.job_part.job.rate} ${test.job_part.job.locum_detail_rate_type.name} from ${test.job_part.job.date_start} to ${test.job_part.job.date_end} / ${test.job_part.job.shift.name} / Total hours of ${test.final_hours}`;
        // compute total
        if (test.job_part.job.locum_detail_rate_type.name === "Per Hour") {
          total =
            parseInt(test.job_part.job.rate) *
            parseInt(defaultSelectedJobPart.final_hours);
        } else if (
          test.job_part.job.locum_detail_rate_type.name ===
          "Per Whole Day Session"
        ) {
          total =
            (parseInt(defaultSelectedJobPart.final_hours) / 8) *
            parseInt(test.job_part.job.rate);
        } else if (
          test.job_part.job.locum_detail_rate_type.name ===
          "Per Half Day Session"
        ) {
          total =
            (parseInt(defaultSelectedJobPart.final_hours) / 4) *
            parseInt(test.job_part.job.rate);
        }
        total = total.toFixed(2).toString();
      } else if (!newValue.includes(selectedId)) {
        defaultSelectedJobPart.description = test.description;
        total = test.total;
      }

      selectedJobPart = { ...defaultSelectedJobPart, total };

      this.selectedJobParts.splice(
        this.selectedJobParts.findIndex(
          item => item.job_part_id === selectedId
        ),
        1,
        selectedJobPart
      );
    }
  },
  created() {
    this.locum_user = this.selectedInvoice.locum_user;
    this.type = this.selectedInvoice.type;
    this.surgery_name = this.selectedInvoice.surgery.name;
    this.form.surgery_id = this.selectedInvoice.surgery.id;
    this.form.date_start = this.selectedInvoice.date_start;
    this.form.date_end = this.selectedInvoice.date_end;
    this.selectedInvoice.items.forEach(item => {
      this.selectedJobParts.push({
        type: item.type,
        job_part_id: item.job_part.id,
        description: item.description,
        // description: `Job number ${item.job_part.job_part_number} ${item.job_part.job.type} Job at £${item.job_part.job.rate} ${item.job_part.job.locum_detail_rate_type.name} from ${item.job_part.date_start} to ${item.job_part.date_end} / ${item.job_part.job.shift.name} / Total hours of ${item.job_part.final_hours}`,
        total: item.total.toString(),
        dispute: item.disputed,
        approve: item.approved,
        absent_days: item.absent_days,
        final_hours: item.final_hours,
        late_hours: item.late_hours,
        remarks: item.remarks,
        disputed_by_locum_at: item.disputed_by_locum_at,
        disputed_by_practice_at: item.disputed_by_practice_at
      });
      if (item.disputed === true) {
        this.disputedInvoices.push(item.job_part.id);
      }
      if (item.approved === true) {
        this.approvedInvoices.push(item.job_part.id);
      }
    });
    this.defaultSelectedJobParts = JSON.parse(
      JSON.stringify(this.selectedJobParts)
    );
  },
  mounted() {
    document.body.style.overflow = "hidden";
  },
  destroyed() {
    document.body.style.overflow = "auto";
  },
  methods: {
    save(final) {
      this.formError = [];
      this.form.type = this.type;
      this.form.surgery_id = this.form.surgery_id;
      this.form.total_amount = this.amount;
      this.form.final = final;
      this.form.items = [];
      this.selectedJobParts.forEach(jobPart => {
        this.form.items.push({
          ...jobPart,
          dispute: this.disputedInvoices.includes(jobPart.job_part_id)
            ? true
            : false,
          approve: this.approvedInvoices.includes(jobPart.job_part_id)
            ? true
            : false,
          absent_days:
            !jobPart.absent_days || jobPart.absent_days === ""
              ? 0
              : jobPart.absent_days,
          late_hours:
            !jobPart.late_hours || jobPart.late_hours === ""
              ? 0
              : jobPart.late_hours,
          final_hours:
            !jobPart.final_hours || jobPart.final_hours === ""
              ? 0
              : jobPart.final_hours
        });
      });
      this.Validate(this.form, ["final"]);
      if (!this.formError.length) {
        this.$axios
          .$put(
            `/api/v1/practice/locum-invoices/${this.$route.params.id}`,
            this.form
          )
          .then(res => {
            this.$emit("updateInvoice", res.data.locum_invoice);
            this.$store.commit("SET_NOTIFICATION", {
              enabled: true,
              status: "success",
              text: [`${res.message}`]
            });
            this.$router.push("/practice-billing/invoices-from-locums");
            setTimeout(() => {
              this.$router.push({
                path: `/practice-billing/invoices-from-locums/${res.data.locum_invoice.id}`
              });
            }, 500);
          })
          .catch(err => {
            console.log("err", err.response.data);
            err.response.data.error_messages.forEach(error => {
              this.formError.push(error);
            });
          });
      }
    },
    waitingForLocumReply(item) {
      let count = this.$moment(item.disputed_by_locum_at).diff(
        item.disputed_by_practice_at,
        "seconds"
      );
      if (count < 0) {
        return true;
      }
      return false;
    },
    async exportToPdf() {
      this.loading = true;
      if (process.client) {
        document.body.style.cursor = "wait";
      }
      // this.$html2canvas(document.getElementById("htmlpdf")).then(canvas => {
      //   var imgWidth = 210;
      //   var pageHeight = 295;
      //   var imgHeight = (canvas.height * imgWidth) / canvas.width;
      //   var heightLeft = imgHeight;
      //   var doc = this.$jspdf("p", "mm");
      //   var position = 0;

      //   var imgData = canvas.toDataURL("image/png");

      //   doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      //   heightLeft -= pageHeight;

      //   while (heightLeft >= 0) {
      //     position = heightLeft - imgHeight;
      //     doc.addPage();
      //     doc.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      //     heightLeft -= pageHeight;
      //   }
      //   doc.save("practice-billing-invoice.pdf");
      // });

      let doc = this.$jspdf("p", "mm");
      let pageHeight = 1020;
      let yPosition = 0;

      // PDF HEADER
      const canvasPdfHeader = await this.$html2canvas(this.$refs["pdf-header"]);
      const imgWidthPdfHeader = 210;
      const imgHeightPdfHeader =
        (canvasPdfHeader.height * imgWidthPdfHeader) / canvasPdfHeader.width;
      const imgDataPdfHeader = canvasPdfHeader.toDataURL("image/png");

      pageHeight = pageHeight - this.$refs["pdf-header"].offsetHeight;

      doc.addImage(
        imgDataPdfHeader,
        "PNG",
        0,
        yPosition,
        imgWidthPdfHeader,
        imgHeightPdfHeader
      );

      yPosition = yPosition + imgHeightPdfHeader;

      // ITEMS HEADER
      const canvasItemsHeader = await this.$html2canvas(
        this.$refs["items-header"]
      );
      const imgWidthItemsHeader = 210;
      const imgHeightItemsHeader =
        (canvasItemsHeader.height * imgWidthItemsHeader) /
        canvasItemsHeader.width;
      const imgDataItemsHeader = canvasItemsHeader.toDataURL("image/png");

      pageHeight = pageHeight - this.$refs["items-header"].offsetHeight;

      doc.addImage(
        imgDataItemsHeader,
        "PNG",
        0,
        yPosition,
        imgWidthItemsHeader,
        imgHeightItemsHeader
      );

      yPosition = yPosition + imgHeightItemsHeader;

      // ITEMS
      let totalSelectedJobParts = this.selectedJobParts.length;

      for (let i = 0; i < totalSelectedJobParts; i++) {
        // minus the current item invoice height to the pageHeight
        pageHeight = pageHeight - this.$refs[`item-${i}`][0].offsetHeight;
        // if all pageHeight is used, add page
        if (pageHeight < 0) {
          pageHeight = 1020;
          yPosition = 0;
          doc.addPage();
          // add header to every new page, also subtract its height to page height
          doc.addImage(
            imgDataItemsHeader,
            "PNG",
            0,
            yPosition,
            imgWidthItemsHeader,
            imgHeightItemsHeader
          );

          yPosition = yPosition + imgHeightItemsHeader;

          pageHeight = pageHeight - this.$refs["items-header"].offsetHeight;
          pageHeight = pageHeight - this.$refs[`item-${i}`][0].offsetHeight;
        }

        // draw canvas
        let canvasItem = await this.$html2canvas(this.$refs[`item-${i}`][0]);
        let imgWidthItem = 210;
        let imgHeightItem =
          (canvasItem.height * imgWidthItem) / canvasItem.width;
        let imgDataItem = canvasItem.toDataURL("image/png");

        // add image
        doc.addImage(
          imgDataItem,
          "PNG",
          0,
          yPosition,
          imgWidthItem,
          imgHeightItem
        );

        yPosition = yPosition + imgHeightItem;
      }

      // sum up their offsetHeight
      let daysWorkedOffsetHeight = this.$refs["days-worked"].offsetHeight;
      let itemsTotalOffsetHeight = this.$refs["items-total"].offsetHeight;
      let pdfFooterOffsetHeight = this.$refs["pdf-footer"].offsetHeight;

      let totalOffsetHeight =
        daysWorkedOffsetHeight + itemsTotalOffsetHeight + pdfFooterOffsetHeight;

      pageHeight = pageHeight - totalOffsetHeight;

      // DAYS WORKED
      const canvasDaysWorked = await this.$html2canvas(
        this.$refs["days-worked"]
      );
      const imgWidthDaysWorked = 210;
      const imgHeightDaysWorked =
        (canvasDaysWorked.height * imgWidthDaysWorked) / canvasDaysWorked.width;
      const imgDataDaysWorked = canvasDaysWorked.toDataURL("image/png");

      // ITEMS TOTAL
      const canvasItemsTotal = await this.$html2canvas(
        this.$refs["items-total"]
      );
      const imgWidthItemsTotal = 210;
      const imgHeightItemsTotal =
        (canvasItemsTotal.height * imgWidthItemsTotal) / canvasItemsTotal.width;
      const imgDataItemsTotal = canvasItemsTotal.toDataURL("image/png");

      // PDF FOOTER
      const canvasPdfFooter = await this.$html2canvas(this.$refs["pdf-footer"]);
      const imgWidthPdfFooter = 210;
      const imgHeightPdfFooter =
        (canvasPdfFooter.height * imgWidthPdfFooter) / canvasPdfFooter.width;
      const imgDataPdfFooter = canvasPdfFooter.toDataURL("image/png");

      if (pageHeight < 0) {
        pageHeight = 1020;
        doc.addPage();
      }

      yPosition =
        295 - (imgHeightDaysWorked + imgHeightItemsTotal + imgHeightPdfFooter);

      doc.addImage(
        imgDataDaysWorked,
        "PNG",
        0,
        yPosition,
        imgWidthDaysWorked,
        imgHeightDaysWorked
      );

      yPosition = yPosition + imgHeightDaysWorked;

      doc.addImage(
        imgDataItemsTotal,
        "PNG",
        0,
        yPosition,
        imgWidthItemsTotal,
        imgHeightItemsTotal
      );

      yPosition = yPosition + imgHeightItemsTotal;

      doc.addImage(
        imgDataPdfFooter,
        "PNG",
        0,
        yPosition,
        imgWidthPdfFooter,
        imgHeightPdfFooter
      );

      yPosition = yPosition + imgHeightPdfFooter;

      doc.save("test.pdf");
      this.loading = false;
      if (process.client) {
        document.body.style.cursor = "auto";
      }
    }
  }
};
</script>
<style>
.save-button {
  border-color: #ecc94b;
  background-color: #ecc94b;
}
.save-button:hover {
  /* background-color: rgb(80, 80, 80); */
  background-color: #e2be3a;
  border-color: #e2be3a;
  cursor: pointer;
}
.option-list {
  transition: all 0.3s ease-in-out;
  height: 0;
}
.slide-down {
  transition: all 0.3s ease-in-out;
  height: auto;
}
/* surgery */
.loader-surgery {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  opacity: 0.5;
  color: #ccc;
}
.items-table tbody tr {
  box-shadow: none;
  border: none;
  border-radius: 0;
}
.items-table {
  width: 733px;
}
.items-table tbody {
  border: 2px solid #eff3f8;
  border-top-width: 0;
}
.items-table tbody td {
  padding: 0 8px;
}
</style>
