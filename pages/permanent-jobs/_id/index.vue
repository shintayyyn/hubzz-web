<template>
	<section>
		<div class="flex justify-between items-center flex-wrap">
			<h4 class="text-lg md:text-xl font-bold">Salaried GP / Locum GP</h4>
			<div class="flex items-center flex-no-wrap">
				<AppButton class="ml-2" :label="'Send'" />
				<AppButton class="ml-2" :label="'Save'" />
				<AppButton class="ml-2" :label="'Apply'" />
			</div>
		</div>
		<div class="flex flex-col md:flex-row">
			<div class="w-full md:w-3/5 lg:w-2/3 px-2">
				<div class="bg-white rounded-lg shadow-lg p-4 my-4">description</div>
			</div>
			<div class="w-full md:w-2/5 lg:w-1/3 px-2">
				<div class="bg-white rounded-lg shadow-lg p-4">
					<img src="https://via.placeholder.com/150" class="mx-auto py-2" />
					<div class="flex justify-center py-2">
						<p class="w-1/3 font-bold">Recruiter</p>
						<div class="w-2/3 pl-2">
							<p>NHS Greater Huddersfield</p>
							<p>NHS Greater Huddersfield</p>
							<p>NHS Greater Huddersfield</p>
						</div>
					</div>
					<div class="flex justify-center py-2">
						<p class="w-1/3 font-bold">Location</p>
						<div class="w-2/3 pl-2">
							<p>Huddersfield, West Yorkshire</p>
						</div>
					</div>
					<div class="flex justify-center py-2">
						<p class="w-1/3 font-bold">Salary</p>
						<div class="w-2/3 pl-2">
							<p>Attractive, negotiable</p>
						</div>
					</div>
					<div class="flex justify-center py-2">
						<p class="w-1/3 font-bold">Posted</p>
						<div class="w-2/3 pl-2">
							<p>06 Jan 2020</p>
						</div>
					</div>
					<div class="flex justify-center py-2">
						<p class="w-1/3 font-bold">Closes</p>
						<div class="w-2/3 pl-2">
							<p>06 Feb 2020</p>
						</div>
					</div>
					<div class="flex justify-center py-2">
						<p class="w-1/3 font-bold">Contact</p>
						<div class="w-2/3 pl-2">
							<p>Jacqui Yates</p>
						</div>
					</div>
					<div class="flex justify-center py-2">
						<p class="w-1/3 font-bold">Role</p>
						<div class="w-2/3 pl-2">
							<p>Locum / Sessional GP, Salaried GP</p>
						</div>
					</div>
					<div class="flex justify-center py-2">
						<p class="w-1/3 font-bold">Contract Type</p>
						<div class="w-2/3 pl-2">
							<p>Permanent</p>
						</div>
					</div>
					<div class="flex justify-center py-2">
						<p class="w-1/3 font-bold">Hours</p>
						<div class="w-2/3 pl-2">
							<p>Part Time</p>
						</div>
					</div>
					<div class="flex justify-center py-2">
						<p class="w-1/3 font-bold">Industry</p>
						<div class="w-2/3 pl-2">
							<p>NHS</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
<script>
import AppButton from "@/components/Base/AppButton";
export default {
	components: {
		AppButton
	}
};
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
</style>