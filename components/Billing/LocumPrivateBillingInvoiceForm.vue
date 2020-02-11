<template>
  <section class="relative max-w-3xl">
    <div class="flex flex-col md:flex-row justify-between">
      <div class="flex flex-wrap items-center">
        <!-- <AppButton
          v-if="propJobPart || (propInvoice && propInvoice.status !== 'Approved')"
          class="m-1"
          :label="'Save changes'"
          @click="save(false)"
          :inStyle="'padding:5px 14px;font-size:1em'"
          :disabled="saveLoading || exportLoading"
        />-->
        <AppButton
          class="m-1"
          :label="propJobPart ? 'Save and archive as final' : 'Save changes'"
          @click="save(true)"
          :inStyle="'padding:5px 14px;font-size:1em'"
          :disabled="saveLoading || exportLoading"
        />
        <AppButton
          v-if="propInvoice && !propJobPart && propInvoice.status !== 'Draft'"
          class="m-1"
          :label="'View as PDF'"
          @click="viewAsPdf(propInvoice.id)"
          :inStyle="'padding:5px 14px;font-size:1em'"
        />
      </div>

      <!-- INVOICE TYPE -->
      <div class="flex flex-row flex-wrap justify-start items-center my-2 md:my-4">
        <label class="mx-1">Type:</label>
        <div
          class="text-xs sm:text-sm mx-1 py-2 px-3 border-2 rounded-lg font-bold flex items-center focus:outline-none bg-yellow-500 border-yellow-500"
        >Private</div>
      </div>
    </div>

    <div id="htmlpdf" class="relative max-w-3xl mb-4 bg-white px-4 py-4 border shadow-md mb-32">
      <AppLoading :loading="exportLoading" spinner :message="'Exporting'" />
      <AppLoading :loading="saveLoading" spinner />
      <div class="flex flex-col" :ref="'pdf-header'">
        <!-- LOCUM INFO -->
        <div class="text-xs sm:text-sm sm:text-right leading-normal">
          <div>{{$auth.user.personal_detail.name}}</div>
          <div>{{$auth.user.address_detail.address.line_1}}</div>
          <div>{{$auth.user.address_detail.address.line_3}}</div>
          <div>{{$auth.user.address_detail.address.post_code}}</div>
          <div>Tel {{$auth.user.contact_detail.mobile_number}}</div>
          <div>{{$auth.user.email}}</div>
          <div>{{$auth.user.locum_detail.invoice_detail && $auth.user.locum_detail.invoice_detail.utr_number ? `UTR ${$auth.user.locum_detail.invoice_detail.utr_number}` : null}}</div>
        </div>
        <div class="flex flex-wrap justify-between my-2" v-if="propInvoice">
          <div
            class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3"
          >
            <section>
              <div class="relative flex flex-col py-2">
                <div class="relative flex flex-row flex-no-wrap justify-between">
                  <label class="text-base py-1">To: Accounts Department</label>
                </div>
                <div class="font-bold text-lg mt-2">{{propInvoice.private_practice.name}}</div>
              </div>
            </section>
            <div class="text-xs sm:text-sm">
              <div>{{propInvoice.private_practice.address_line_1}}</div>
              <div>{{propInvoice.private_practice.address_line_2}}</div>
              <div>{{propInvoice.private_practice.address_line_3}}</div>
              <div>{{propInvoice.private_practice.address_postcode}}</div>
            </div>
          </div>
        </div>
        <div class="flex flex-wrap justify-between my-2" v-if="propJobPart">
          <div
            class="w-full sm:w-1/2 order-2 sm:order-1 text-xs sm:text-sm text-left rounded-lg border-2 border-gray-300 p-2 w-2/3"
          >
            <section>
              <div class="relative flex flex-col py-2">
                <div class="relative flex flex-row flex-no-wrap justify-between">
                  <label class="text-base py-1">To: Accounts Department</label>
                </div>
                <div class="font-bold text-lg mt-2">{{propJobPart.practice_name}}</div>
              </div>
            </section>
            <div class="text-xs sm:text-sm">
              <div>{{propJobPart.practice_address_line_1}}</div>
              <div>{{propJobPart.practice_address_line_2}}</div>
              <div>{{propJobPart.practice_address_line_3}}</div>
              <div>{{propJobPart.practice_address_postcode}}</div>
            </div>
          </div>
        </div>
      </div>

      <div class="overflow-auto">
        <div class="items-table">
          <!-- ITEMS HEADER -->
          <div class="flex justify-start" :ref="'items-header'">
            <div
              class="w-1/2 bg-gray-900 text-white px-4 py-1 font-semibold border-r-2 border-white"
            >Description</div>
            <div
              class="w-1/2 bg-gray-900 text-white px-4 py-1 font-semibold flex justify-between"
            >Total</div>
          </div>
          <!-- items / selected invoice -->
          <div
            :id="`invoice-item`"
            :ref="'invoice-item'"
            class="flex flex-col pb-2"
            v-if="form.items && form.items.length > 0"
          >
            <!-- item description / total / dispute checkbox -->
            <div class="relative flex justify-start mt-2">
              <div class="w-1/2 text-xs sm:text-sm px-4 py-1 border-gray-300">
                <textarea
                  v-model="form.items[0].description"
                  class="border-b-2 focus:outline-none focus:border-yellow-400 w-full h-full"
                  cols="40"
                  rows="4"
                ></textarea>
              </div>
              <div class="text-xs sm:text-sm border-gray-300 px-4 py-1 text-right w-1/2">
                <input
                  v-model="form.items[0].total"
                  type="number"
                  class="border-b-2 focus:outline-none focus:border-yellow-400 w-full h-full text-right"
                    @keypress="isNumber($event)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- ITEMS TOTAL -->
      <div :ref="'items-total'" class="flex justify-between md:m-2">
        <span class="font-bold">Total</span>
        <div
          class="relative"
        >£ {{form.items && form.items.length > 0 ? form.items[0].total : 0 | currency }}</div>
      </div>
      <!-- ITEMS DAYS WORKED -->
      <div :ref="'days-worked'" class="flex flex-row flex-wrap justify-between px-2">
        <div class="w-full flex flex-row flex-wrap justify-between md:px-2">
          <div class="w-full md:w-1/2 md:pr-1">
            <AppDate
              v-model="form.date_start"
              :name="'date_start'"
              :label="'Days worked from'"
              :error="formError.find(item => item.field === 'date_start')"
              @input="CheckEmptyField(form.date_start, 'date_start')"
            />
          </div>
          <div class="w-full md:w-1/2 md:pl-1">
            <AppDate
              v-model="form.date_end"
              :name="'date_end'"
              :label="'To'"
              :error="formError.find(item => item.field === 'date_end')"
              @input="CheckEmptyField(form.date_end, 'date_end')"
            />
          </div>
        </div>
      </div>

      <div :ref="'pdf-footer'" class="rounded-lg border-2 border-gray-300 mt-4 p-4">
        <div
          class="flex flex-col text-xs sm:text-sm"
          v-if="propInvoiceDetail.paid_under_payroll && propInvoiceDetail.payroll_detail"
        >
          <div>Payment by BACS: xxxxx</div>
          <div>Account name: {{propInvoiceDetail.payroll_detail.account_name ? propInvoiceDetail.payroll_detail.account_name : 'xxxxx'}}</div>
          <div>Bank: {{propInvoiceDetail.payroll_detail.bank_name ? propInvoiceDetail.payroll_detail.bank_name : 'xxxxx'}}</div>
          <div>Sort code: {{propInvoiceDetail.payroll_detail.sort_code ? propInvoiceDetail.payroll_detail.sort_code : 'xxxxx'}}</div>
          <div>Account number: {{propInvoiceDetail.payroll_detail.account_number ? propInvoiceDetail.payroll_detail.account_number : 'xxxxx*OR'}}</div>
        </div>
        <div
          class="flex flex-col text-xs sm:text-sm"
          v-if="!propInvoiceDetail.paid_under_payroll && propInvoiceDetail.bank_account"
        >
          <div>Payment by BACS: xxxxx</div>
          <div>Account name: {{propInvoiceDetail.bank_account.account_name ? propInvoiceDetail.bank_account.account_name : 'xxxxx'}}</div>
          <div>Bank: {{propInvoiceDetail.bank_account.bank_name ? propInvoiceDetail.bank_account.bank_name : 'xxxxx'}}</div>
          <div>Sort code: {{propInvoiceDetail.bank_account.sort_code ? propInvoiceDetail.bank_account.sort_code : 'xxxxx'}}</div>
          <div>Account number: {{propInvoiceDetail.bank_account.account_number ? propInvoiceDetail.bank_account.account_number : 'xxxxx*OR'}}</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import AppLoading from "@/components/Base/AppLoading";
import AppButton from "@/components/Base/AppButton";
import AppDate from "@/components/Base/AppDate";
import AppInput from "@/components/Base/AppInput";
export default {
  components: {
    AppLoading,
    AppButton,
    AppDate,
    AppInput
  },
  props: {
    propInvoiceDetail: {
      type: Object
    },
    propInvoice: {
      type: Object
    },
    propJobPart: {
      type: Object
    }
  },

  data() {
    return {
      exportLoading: false,
      saveLoading: false,
      form: {
        date_start: null,
        date_end: null,
        items: [],
        total_amount: 0,
        final: false,
        ir35: false
      },
      formError: []
    };
  },
  computed: {
    description() {
      if (this.propJobPart && !this.propInvoice) {
        return `Job number ${this.propJobPart.job_part_number} ${
          this.propJobPart.job.type
        }
          Job at £${this.propJobPart.job.rate} ${
          this.propJobPart.job.locum_detail_rate_type.name
        }
          from ${this.propJobPart.date_start} to ${this.propJobPart.date_end}
          / ${this.propJobPart.job.shift.name} / Total hours of ${
          this.form.items.length > 0 ? this.form.items[0].final_hours : 0
        }`;
      }
    }
  },
  mounted() {
    if (this.propJobPart && !this.propInvoice) {
      this.form.type = this.propJobPart.job.type;
      this.form.private_practice_id = this.propJobPart.job.private_practice_id;
      this.form.date_start = this.propJobPart.date_start;
      this.form.date_end = this.propJobPart.date_end;

      let total =
        this.propJobPart.job.locum_detail_rate_type.name === "Per Hour"
          ? this.propJobPart.job.rate * this.propJobPart.final_hours
          : (this.propJobPart.job.rate / this.propJobPart.job.total_hours) *
            this.propJobPart.final_hours;

      this.form.items = [
        {
          type: "Job Part",
          job_part_id: this.propJobPart.id,
          description: `Job number ${this.propJobPart.job_part_number} ${
            this.propJobPart.job.type
          } Job at £${this.propJobPart.job.rate} ${
            this.propJobPart.job.locum_detail_rate_type.name
          } from ${this.propJobPart.date_start} to ${
            this.propJobPart.date_end
          } / ${
            this.propJobPart.job.shift.name
          } / Total hours of ${this.propJobPart.final_hours.toFixed(2)}`,
          total: total.toFixed(2),
          dispute: this.propJobPart.disputed,
          absent_days: this.propJobPart.absent_days,
          final_hours: this.propJobPart.final_hours.toFixed(2),
          late_hours: this.propJobPart.late_hours,
          remarks: ""
        }
      ];

      this.form.total_amount = total.toFixed(2);
      this.form.final = false;
      this.form.ir35 = false;
    }

    if (this.propInvoice && !this.propJobPart) {
      this.form.locum_invoice_id = this.propInvoice.id;
      this.form.date_start = this.propInvoice.date_start;
      this.form.date_end = this.propInvoice.date_end;

      this.form.items = [
        {
          type: "Job Part",
          job_part_id: this.propInvoice.items[0].job_part.id,
          description: this.propInvoice.items[0].description,
          total: this.propInvoice.items[0].total.toFixed(2),
          dispute: this.propInvoice.items[0].disputed,
          absent_days: this.propInvoice.items[0].absent_days,
          final_hours: this.propInvoice.items[0].final_hours,
          late_hours: this.propInvoice.items[0].late_hours,
          remarks: this.propInvoice.items[0].remarks
        }
      ];
      this.form.total_amount = this.propInvoice.total_amount.toFixed(2);
      this.form.final = false;
      this.form.ir35 = this.propInvoice.ir35;
    }
    console.log("propInvoiceDetail", this.propInvoiceDetail);
  },
  methods: {
    save(final) {
      this.formError = [];
      this.Validate(this.form, ["final", "ir35"]);
      if (!this.formError.length) {
        this.saveLoading = true;
        if (this.propJobPart && !this.propInvoice) {
          this.form.final = final;
          this.form.total_amount = parseInt(this.form.items[0].total);
          this.$axios
            .$post(`/api/v1/locum/locum-invoices`, this.form)
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: [`${res.message}`]
              });
              this.$emit("createInvoice", res.data.locum_invoice);
            })
            .catch(err => {
              console.log("err", err.response || err);
              if (err.response.data.message) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "success",
                  text: [`${err.response.data.message}`]
                });
              } else if (err.response.data.error_messages) {
                err.response.data.error_messages.forEach(error => {
                  this.formError.push(error);
                });
              } else {
                this.formError.push(err.response.data);
              }
              throw err;
            })
            .finally(() => {
              this.saveLoading = false;
            });
        } else if (this.propInvoice && !this.propJobPart) {
          this.form.final = final;
          this.$axios
            .$put(
              `/api/v1/locum/locum-invoices/${this.$route.params.id}`,
              this.form
            )
            .then(res => {
              this.$store.commit("SET_NOTIFICATION", {
                enabled: true,
                status: "success",
                text: [`${res.message}`]
              });
              this.$emit("updateInvoice", res.data.locum_invoice);
            })
            .catch(err => {
              console.log("err", err.response || err);
              if (err.response.data.message) {
                this.$store.commit("SET_NOTIFICATION", {
                  enabled: true,
                  status: "success",
                  text: [`${err.response.data.message}`]
                });
              } else if (err.response.data.error_messages) {
                err.response.data.error_messages.forEach(error => {
                  this.formError.push(error);
                });
              } else {
                this.formError.push(err.response.data);
              }
              throw err;
            })
            .finally(() => {
              this.saveLoading = false;
            });
        }
      }
    },
    viewAsPdf(invoiceId) {
      window.open(
        `${process.env.API_URL}/api/v1/locum-invoices/${invoiceId}/pdf`
      );
    },
    async exportToPdf() {
      this.exportLoading = true;
      if (process.client) {
        document.body.style.cursor = "wait";
      }

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
      const canvasItems = await this.$html2canvas(this.$refs["invoice-item"]);

      const imgWidthItems = 210;
      const imgHeightItems =
        (canvasItems.height * imgWidthItems) / canvasItems.width;
      const imgDataItems = canvasItems.toDataURL("image/png");

      pageHeight = pageHeight - this.$refs["invoice-item"].offsetHeight;

      doc.addImage(
        imgDataItems,
        "PNG",
        0,
        yPosition,
        imgWidthItems,
        imgHeightItems
      );

      yPosition = yPosition + imgHeightItems;

      // let totalSelectedJobParts = this.selectedJobParts.length;

      // for (let i = 0; i < totalSelectedJobParts; i++) {
      //   // minus the current item invoice height to the pageHeight
      //   pageHeight = pageHeight - this.$refs[`item-${i}`][0].offsetHeight;
      //   // if all pageHeight is used, add page
      //   if (pageHeight < 0) {
      //     pageHeight = 1020;
      //     yPosition = 0;
      //     doc.addPage();
      //     // add header to every new page, also subtract its height to page height
      //     doc.addImage(
      //       imgDataItemsHeader,
      //       "PNG",
      //       0,
      //       yPosition,
      //       imgWidthItemsHeader,
      //       imgHeightItemsHeader
      //     );

      //     yPosition = yPosition + imgHeightItemsHeader;

      //     pageHeight = pageHeight - this.$refs["items-header"].offsetHeight;
      //     pageHeight = pageHeight - this.$refs[`item-${i}`][0].offsetHeight;
      //   }

      //   // draw canvas
      //   let canvasItem = await this.$html2canvas(this.$refs[`item-${i}`][0]);
      //   let imgWidthItem = 210;
      //   let imgHeightItem =
      //     (canvasItem.height * imgWidthItem) / canvasItem.width;
      //   let imgDataItem = canvasItem.toDataURL("image/png");

      //   // add image
      //   doc.addImage(
      //     imgDataItem,
      //     "PNG",
      //     0,
      //     yPosition,
      //     imgWidthItem,
      //     imgHeightItem
      //   );

      //   yPosition = yPosition + imgHeightItem;
      // }

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
      this.exportLoading = false;
      if (process.client) {
        document.body.style.cursor = "auto";
      }
    }
  }
};
</script>
<style scoped>
.items-table {
  min-width: 733px;
}
</style>
