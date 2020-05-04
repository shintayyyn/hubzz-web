<template>
  <div class="page-overlap flex-1 flex flex-col self-end bg-trout">
    <div class="flex justify-between text-sm text-white">
      <nuxt-link to="/reports/" class="text-white hover:text-sunglow p-1">
        <svgicon name="arrow-left-solid" height="32" width="32" class="fill-current" />
      </nuxt-link>
    </div>
    <div class="flex justify-between flex-col md:flex-row py-2 md:py-4 w-full max-w-xl">
      <div class="flex">
        <div class="relative">
          <input
            class="rounded-lg border-2 border-transparent text-sm text-white p-2 pr-6 focus:border-sunglow focus:outline-none bg-waterloo"
            placeholder="Search for..."
          >
          <button class="absolute top-0 right-0 bottom-0 mr-3 md:mr-1">
            <svgicon
              name="times-solid"
              height="12"
              width="12"
              class="text-white fill-current -mx-2 md:-mx-6"
            />
          </button>
        </div>
        <button class="rounded-lg text-xs text-white p-2 mx-1 hover:text-black hover:bg-yellow-500">
          Go
        </button>
      </div>
      <div class="flex items-center my-2 md:my-0">
        <select
          class="outline-none rounded-lg border-2 border-transparent text-xs text-white p-2 -pl-12 focus:outline-none bg-waterloo"
        >
          <option disabled value selected class="bg-gray-700">
            Filter by
          </option>
          <option>Paid</option>
          <option>Not Paid</option>
        </select>
        <button
          class="rounded-lg text-xs text-white hover:text-black hover:bg-yellow-500 p-2 ml-2 rounded inline-flex items-center"
        >
          <svgicon 
            name="cloud-download" 
            width="21" 
            height="21" 
            color="fill" 
            class="fill-current"
          />
          <span class="px-1">Download CSV</span>
        </button>
      </div>
    </div>
    <!-- <div class="w-full max-w-xl text-sm text-white">
        <div class="hidden md:flex leading-tight items-center font-bold">
          <span class="flex-1 p-2">Practice</span>
          <span class="flex-1 p-2">Invoice Number</span>
          <span class="flex-1 p-2">Job Numbers</span>
          <span class="flex-1 p-2 text-center">Date Paid</span>
          <span class="flex-1 p-2 text-center">£ Amount</span>
        </div>
        <div v-for="item in reports" :key="item.id" class="flex flex-col md:flex-row md:items-center bg-waterloo p-2 md:p-0 my-2 border-l-8 border-sunglow md:border-0 rounded-lg">
          <span class="flex-1 px-2 py-1 md:p-2 leading-tight">
            <span class="font-bold md:hidden block">Practice</span>
            {{item.practice}}</span>
          <span class="flex-1 px-2 py-1 md:p-2"><span class="font-bold md:hidden block">Invoice Number</span>{{item.invoice_number}} </span>
          <span class="flex-1 px-2 py-1 md:p-2 flex flex-col">
            <span class="font-bold md:hidden block">Job Numbers</span>
            <span v-for="(job, index) in item.job_numbers" :key="index">{{job}}</span>
          </span>
          <span class="flex-1 px-2 py-1 md:p-2 md:text-center"><span class="font-bold md:hidden block">Date Paid</span>{{item.date_paid}} </span>
          <span class="flex-1 px-2 py-1 md:p-2 md:text-center"><span class="font-bold md:hidden block">£ Amount</span>{{item.amount}} </span>
        </div>
		</div>-->
    <div class="w-full max-w-xl text-xs overflow-x-auto">
      <div class="flex bg-waterloo text-white font-bold">
        <span class="flex-1 p-2">Practice</span>
        <span class="flex-1 p-2">Invoice Number</span>
        <span class="flex-1 p-2">Job Numbers</span>
        <span class="flex-1 p-2 text-center">Date Paid</span>
        <span class="flex-1 p-2 text-center">£ Amount</span>
      </div>
      <div v-for="item in reports" :key="item.id" class="flex items-center bg-white">
        <span class="flex-1 p-2 leading-tight">
          {{ item.practice }}
        </span>
        <span class="flex-1 p-2">
          {{ item.invoice_number }}
        </span>
        <span class="flex-1 p-2 flex flex-col">
          <span v-for="(job, index) in item.job_numbers" :key="index">
            {{ job }}
          </span>
        </span>
        <span class="flex-1 p-2 text-center">
          {{ item.date_paid }}
        </span>
        <span class="flex-1 p-2 text-center">
          {{ item.amount }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
	transition: "subpage",

	// async asyncData({ app, route }) {
	//   try {
	//     let response = await app.$axios.$get(
	//       `/api/v1/qualifications/${route.params.id}`
	//     );

	//     const qualification = response.data.qualification;

	//     return {
	//       qualification
	//     };
	//   } catch (err) {
	//     console.log("index qualifications index _id index asyncData err", err);
	//   }
	// },

	data () {
		return {
			qualification: null,
			reports: [
				{
					id: 1,
					practice: "DR BAKER AND PARTNERS",
					invoice_number: "0000000003",
					job_numbers: ["H0000000101", "H0000000102"],
					date_paid: "07/03/2019",
					amount: "100.00"
				},
				{
					id: 2,
					practice: "DR BAKER AND PARTNERS",
					invoice_number: "0000000003",
					job_numbers: ["H0000000101"],
					date_paid: "07/03/2019",
					amount: "100.00"
				},
				{
					id: 3,
					practice: "DR BAKER AND PARTNERS",
					invoice_number: "0000000003",
					job_numbers: ["H0000000101"],
					date_paid: "07/03/2019",
					amount: "100.00"
				},
				{
					id: 4,
					practice: "DR BAKER AND PARTNERS",
					invoice_number: "0000000003",
					job_numbers: ["H0000000101"],
					date_paid: "07/03/2019",
					amount: "100.00"
				},
				{
					id: 5,
					practice: "DR BAKER AND PARTNERS",
					invoice_number: "0000000003",
					job_numbers: ["H0000000101"],
					date_paid: "07/03/2019",
					amount: "100.00"
				}
			]
		}
	}
}
</script>
<style>
@media (min-width: 450px) {
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
}

@media screen and (min-width: 1200px) {
	.page-overlap {
		min-width: calc(100% - 200px);
	}
}
</style>