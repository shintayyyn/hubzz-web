<template>
	<div class="flex flex-row flex-wrap justify-center w-full px-1">
		<span
			class="bg-job-active w-2 h-2 md:w-3 md:h-3 rounded border border-white"
			v-if="info && info.status && info.status.includes('Ongoing')"
		/>
		<span
			class="bg-job-pending w-2 h-2 md:w-3 md:h-3 rounded border border-white"
			v-if="info && info.status && (info.status.includes('Allocated') || info.status.includes('Applied'))"
		/>
		<template v-if="$auth.user.domain === 'Practice'">
			<span
				v-if="info && info.status && (info.status.includes('Unfilled') || info.status.includes('Declined') || info.status.includes('Withdrawn'))"
				class="bg-job-unfilled w-2 h-2 md:w-3 md:h-3 rounded border border-white"
			/>
		</template>
		<template v-if="info && info.shifts.length === 1">
			<div
				:class="shiftType(info && info.shifts[0])"
				class="h-1 w-1/2 absolute left-0 bottom-0 rounded-bl"
			/>
			<div
				:class="shiftType(info && info.shifts[0])"
				class="w-1 absolute bottom-0 left-0 rounded-bl"
				style="height:50%"
			/>
			<div
				:class="shiftType(info && info.shifts[0])"
				class="h-1 w-1/2 absolute left-0 top-0 rounded-tl"
			/>
			<div
				:class="shiftType(info && info.shifts[0])"
				class="w-1 absolute top-0 left-0 rounded-tl"
				style="height:50%"
			/>

			<div
				:class="shiftType(info && info.shifts[0])"
				class="h-1 w-1/2 absolute right-0 bottom-0 rounded-br"
			/>
			<div
				:class="shiftType(info && info.shifts[0])"
				class="w-1 absolute bottom-0 right-0 rounded-br"
				style="height:50%"
			/>
			<div
				:class="shiftType(info && info.shifts[0])"
				class="h-1 w-1/2 absolute right-0 top-0 rounded-tr"
			/>
			<div
				:class="shiftType(info && info.shifts[0])"
				class="w-1 absolute top-0 right-0 rounded-tr"
				style="height:50%"
			/>
		</template>
		<template v-if="info && info.shifts.length === 2">
			<div
				:class="shiftType(info && info.shifts[0])"
				class="h-1 w-1/2 absolute left-0 bottom-0 rounded-bl border-r-2 border-white"
			/>
			<div
				:class="shiftType(info && info.shifts[0])"
				class="w-1 absolute bottom-0 left-0 rounded-bl"
				style="height:50%"
			/>
			<div
				:class="shiftType(info && info.shifts[0])"
				class="h-1 w-1/2 absolute left-0 top-0 rounded-tl border-r-2 border-white"
			/>
			<div
				:class="shiftType(info && info.shifts[0])"
				class="w-1 absolute top-0 left-0 rounded-tl"
				style="height:50%"
			/>

			<div
				:class="shiftType(info && info.shifts[1])"
				class="h-1 w-1/2 absolute right-0 bottom-0 rounded-br border-l-2 border-white"
			/>
			<div
				:class="shiftType(info && info.shifts[1])"
				class="w-1 absolute bottom-0 right-0 rounded-br"
				style="height:50%"
			/>
			<div
				:class="shiftType(info && info.shifts[1])"
				class="h-1 w-1/2 absolute right-0 top-0 rounded-tr border-l-2 border-white"
			/>
			<div
				:class="shiftType(info && info.shifts[1])"
				class="w-1 absolute top-0 right-0 rounded-tr"
				style="height:50%"
			/>
		</template>
		<template v-else-if="info && info.shifts.length === 3">
			<div
				:class="shiftType(info && info.shifts[0])"
				class="h-1 w-1/2 absolute left-0 top-0 rounded-tl border-r-2 border-white"
			/>
			<div
				:class="shiftType(info && info.shifts[0])"
				class="w-1 absolute top-0 left-0 rounded-tl border-b-2 border-white"
				style="height:50%"
			/>

			<div
				:class="shiftType(info && info.shifts[1])"
				class="h-1 w-1/2 absolute right-0 top-0 rounded-tr border-l-2 border-white"
			/>
			<div
				:class="shiftType(info && info.shifts[1])"
				class="w-1 absolute top-0 right-0 rounded-tr border-b-2 border-white"
				style="height:50%"
			/>

			<div
				:class="shiftType(info && info.shifts[2])"
				class="h-1 w-1/2 absolute left-0 bottom-0 rounded-bl"
			/>
			<div
				:class="shiftType(info && info.shifts[2])"
				class="w-1 absolute bottom-0 left-0 rounded-bl border-t-2 border-white"
				style="height:50%"
			/>
			<div
				:class="shiftType(info && info.shifts[2])"
				class="h-1 w-1/2 absolute right-0 bottom-0 rounded-br"
			/>
			<div
				:class="shiftType(info && info.shifts[2])"
				class="w-1 absolute bottom-0 right-0 rounded-br border-t-2 border-white"
				style="height:50%"
			/>
		</template>
		<template v-else-if="info && info.shifts.length === 4">
			<div
				:class="shiftType(info && info.shifts[0])"
				class="h-1 w-1/2 absolute left-0 bottom-0 rounded-bl border-r-2 border-white"
			/>
			<div
				:class="shiftType(info && info.shifts[0])"
				class="w-1 absolute bottom-0 left-0 rounded-bl border-t-2 border-white"
				style="height:50%"
			/>
			<div
				:class="shiftType(info && info.shifts[1])"
				class="h-1 w-1/2 absolute left-0 top-0 rounded-tl border-r-2 border-white"
			/>
			<div
				:class="shiftType(info && info.shifts[1])"
				class="w-1 absolute top-0 left-0 rounded-tl border-b-2 border-white"
				style="height:50%"
			/>
			<div
				:class="shiftType(info && info.shifts[2])"
				class="h-1 w-1/2 absolute right-0 bottom-0 rounded-br border-l-2 border-white"
			/>
			<div
				:class="shiftType(info && info.shifts[2])"
				class="w-1 absolute bottom-0 right-0 rounded-br border-t-2 border-white"
				style="height:50%"
			/>
			<div
				:class="shiftType(info && info.shifts[3])"
				class="h-1 w-1/2 absolute right-0 top-0 rounded-tr border-l-2 border-white"
			/>
			<div
				:class="shiftType(info && info.shifts[3])"
				class="w-1 absolute top-0 right-0 rounded-tr border-b-2 border-white"
				style="height:50%"
			/>
		</template>
	</div>
</template>
<script>
export default {
	props: ["item", "info"],
	methods: {
		shiftType(shift) {
			switch (shift) {
				case "AM":
					return "bg-shift-am";
					break;
				case "PM":
					return "bg-shift-pm";
					break;
				case "Whole Day":
					return "bg-shift-whole-day";
					break;
				case "OOH":
					return "bg-shift-ooh";
					break;
				default:
					return "";
					break;
			}
		}
	}
};
</script>
<style>
.bg-job-active {
	background-color: #38b460;
}

.bg-job-pending {
	background-color: #ffa901;
}

.bg-job-unfilled {
	background-color: #cd1424;
}

.bg-shift-whole-day {
	background-color: #fe703e;
}
.bg-shift-am {
	background-color: #ff59ca;
}
.bg-shift-pm {
	background-color: #34bbff;
}
.bg-shift-ooh {
	background-color: #947ffe;
}
.bottom-right {
	clip-path: polygon(90% 52%, 90% 90%, 52% 90%, 52% 100%, 100% 100%, 100% 52%);
}
.bottom-left {
	clip-path: polygon(10% 52%, 0 52%, 0 100%, 48% 100%, 48% 90%, 10% 90%);
}
.top-right {
	transform: rotate(180deg);
	/* clip-path: polygon(90% 55%, 90% 90%, 55% 90%, 55% 100%, 100% 100%, 100% 55%); */
	clip-path: polygon(90% 52%, 90% 90%, 52% 90%, 52% 100%, 100% 100%, 100% 52%);
}
.top-left {
	transform: rotate(180deg);
	clip-path: polygon(10% 52%, 0 52%, 0 100%, 48% 100%, 48% 90%, 10% 90%);
}
.bottom-3 {
	clip-path: polygon(
		0 52%,
		0% 100%,
		10% 100%,
		10% 52%,
		90% 52%,
		90% 90%,
		10% 90%,
		10% 100%,
		100% 100%,
		100% 52%
	);
}
.top-right-3 {
	transform: rotate(180deg);
	/* clip-path: polygon(90% 55%, 90% 90%, 55% 90%, 55% 100%, 100% 100%, 100% 55%); */
	clip-path: polygon(90% 52%, 90% 90%, 52% 90%, 52% 100%, 100% 100%, 100% 52%);
}
.top-left-3 {
	transform: rotate(180deg);
	clip-path: polygon(10% 52%, 0 52%, 0 100%, 48% 100%, 48% 90%, 10% 90%);
}
.left-2 {
	transform: rotate(90deg);
	clip-path: polygon(
		0 52%,
		0% 100%,
		10% 100%,
		10% 52%,
		90% 52%,
		90% 90%,
		10% 90%,
		10% 100%,
		100% 100%,
		100% 52%
	);
}
.right-2 {
	transform: rotate(-90deg);
	clip-path: polygon(
		0 52%,
		0% 100%,
		10% 100%,
		10% 52%,
		90% 52%,
		90% 90%,
		10% 90%,
		10% 100%,
		100% 100%,
		100% 52%
	);
}
</style>