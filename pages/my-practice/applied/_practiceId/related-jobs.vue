<template>
  <section class="related-jobs-section">
    <MyPracticeRelatedJobsTabs :practiceType="'applied'" />
    <div class="mt-5">
      <nuxt-child
        :shifts="shifts"
        :rates="rates"
        :invoiceStatusList="invoiceStatusList"
        :practiceTypeList="practiceTypeList"
      />
    </div>
  </section>
</template>
<script>
import MyPracticeRelatedJobsTabs from "@/components/MyPractice/MyPracticeRelatedJobsTabs";
const invoiceStatusList = [
  {
    label: "All",
    value: ""
  },
  {
    label: "To Be Invoice",
    value: "To Be Invoice"
  },
  {
    label: "Disputed",
    value: "Disputed"
  },
  {
    label: "Invoiced",
    value: "Invoiced"
  }
];
const practiceTypeList = [
  {
    label: "All",
    value: ""
  },
  {
    label: "Platform",
    value: "Platform"
  },
  {
    label: "Private",
    value: "Private"
  }
];
export default {
  transition: {
    name: "fade",
    mode: "out-in"
  },
  components: {
    MyPracticeRelatedJobsTabs
  },
  data() {
    return {
      shifts: [],
      rates: [],
      invoiceStatusList,
      practiceTypeList
    };
  },
  created() {
    this.$axios.$get(`/api/v1/shifts`).then(res => {
      this.shifts = [];
      this.shifts.push({ label: "All", value: "" });
      res.data.shifts.forEach(item => {
        this.shifts.push({ label: item.name, value: item.id });
      });
    });
    this.$axios.$get(`/api/v1/locum-detail-rate-types`).then(res => {
      this.rates = [];
      this.rates.push({ label: "All", value: "" });
      res.data.locum_detail_rate_types.forEach(item => {
        this.rates.push({ label: item.name, value: item.id });
      });
    });
  }
};
</script>
