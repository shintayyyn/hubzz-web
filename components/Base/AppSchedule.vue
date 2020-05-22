<template>
	<div>
		<transition name="fade">
       <div v-if="showShifts" class="fixed m-auto z-50 left-0 right-0 top-0 bottom-0 err-shield flex items-center justify-center" >
          <div class="overflow-hidden relative bg-white border rounded mx-2 md:mx-0" :class="shift_schedule.length > 0 ? 'md:w-4/5 xl:w-3/5' : 'md:w-1/4'">
           <transition name="drop">
              <AppConfirmationModal
              v-if="confirmClosing"
              :label="confirmation.message"
              :confirmLabel="'Yes'"
              :cancelLabel="'Cancel'"
              :modal="confirmClosing"
              @confirm="closeShift(confirmation.type, confirmation.data)"
              @cancel="confirmClosing=false"
              :inStyle="'position: absolute;'"
            />
           </transition>
            <div class="flex items-center justify-between px-4 pt-2 pb-2 border-b">
              <p class="font-bold">Manage Shifts</p>
              <svgicon name="times-solid" width="18" height="18" @click="(shift_schedule && shift_schedule.find(item => item.initial) || editShiftId) ? [confirmClosing = true, confirmation={message: 'Discard Changes?', type: 'close'}] : showShifts=false, shiftError=[]" class="fill-current hover:text-gray-700 cursor-pointer"/>
            </div>
            <div class="px-4">
              <div class="flex flex-col items-center py-8" v-if="shift_schedule.length === 0" >
                <AppButton :label="'Add Shift'" :inStyle="'padding:5px 14px;'" class="mb-1" @click="addShiftSchedule" />
                <p class="text-center text-gray-600 italic">Add Shift to set up schedule.</p>
              </div>
              <transition name="fade">
              <div :class="shift_schedule.length > 1 ? 'overflow-x-hidden overflow-y-auto':''" style="max-height: 600px" ref="scheduleWrapper" v-if="shift_schedule.length > 0">
                <!-- SAVED SHIFTS -->
                <div class="relative py-3" :class="[index%2?'bg-gray-200':'', shift_schedule.length >= 4 ? 'px-1 lg:pl-0 lg:pr-2' : 'px-1', index !== (shift_schedule.length-1) ? 'border-b-2 ' : '']" v-for="(item, index) in shift_schedule" :key="index">
                  <transition name="fade">
                    <div class="absolute h-full w-full flex justify-center items-center z-20" v-if="shift_saving===index">
                      <p class="bg-green-400 px-8 py-3 rounded-lg font-bold flex items-center text-white">
                        <span><svgicon name="success-checkmark" width="20" height="20" class="mr-1 fill-current"/></span>Saved!</p>
                    </div>
                  </transition>
                  <template  v-if="!item.initial && (!editShiftId || (editShiftId && editShiftId !== item.value))">
                    <div class="flex justify-between items-center border-b mb-2 pb-2">
                      <p class="font-bold"><span class="font-normal">Shift Name: </span>{{ item.label }}</p>
                      <div class="flex text-sm">
                        <p class="hover:text-blue-600 cursor-pointer mr-2"  @click="editShift('edit', item)">Edit</p>
                        <p class="hover:text-blue-600 cursor-pointer mr-2" @click="[confirmClosing = true, confirmation={message: 'Are you sure you want to remove this shift?', type: 'remove', data: {id:item.id, index: index}}]">Remove</p>
                        <p class="cursor-pointer" :class="item.appliedToAll ? 'text-red-500 hover:text-red-600' : 'hover:text-blue-600 '" @click="applyToAll(item)" >{{ item.appliedToAll ? 'Cancel Apply to All' : 'Apply to All' }}</p>
                      </div>
                    </div>
                    <div class="flex flex-col">
                      <div class="flex text-sm">
                        <p class="w-1/5">Shift</p>
                        <p class="w-1/5">Start Time</p>
                        <p class="w-1/5">End Time</p>
                        <p class="w-2/5">Rate</p>
                      </div>
                      <div class="flex font-semibold">
                        <p class="w-1/5">{{item.shift ? item.shift.name : shifts.find(shift => shift.value.toString() === item.shift_id.toString()).label}}</p>
                        <p class="w-1/5">{{item.time_start}}</p>
                        <p class="w-1/5">{{item.time_end}}</p>
                        <p class="w-2/5">{{item.rate}} {{item.locum_detail_rate_type ? item.locum_detail_rate_type.name : rate_lists.find(rate => rate.value.toString() === item.locum_detail_rate_type_id.toString()).label}}</p>
                      </div>
                      
                    </div>
                  </template>
                  <template v-else>
                    <div>
                      <AppInput
                        v-if="item.initial"
                        v-model="item.label"
                        :name="`label-${index}`"
                        :type="'text'"
                        :label="'Shift Name'"
                        :in-style="'background-color: transparent;'"
                        :info="'Add Shift Name to easily assign the shift to dates'"
                        :error="shiftError.find(item => item.field === `label-${index}`)"
                        required
                        :limit="25"
                        @blur="CheckEmptyField(item.field,`label-${index}`)"
                      />
                      <AppInput
                        v-else
                        v-model="item.edit_label"
                        :name="`label-${index}`"
                        :type="'text'"
                        :label="'Edit Shift Name'"
                        :in-style="'background-color: transparent;'"
                        :info="'Add Shift Name to easily assign the shift to dates'"
                        :error="shiftError.find(item => item.field === `label-${index}`)"
                        required
                        :limit="25"
                        @blur="CheckEmptyField(item.field,`label-${index}`)"
                      />
                    </div>
                    <div class="relative flex flex-row flex-wrap justify-between items-end">
                      <div class="w-full md:w-1/5 px-1">
                          <AppInput
                          v-if="item.initial"
                            v-model="item.shift_id"
                            :type="'select'"
                            :name="`shift-${index}`"
                            :label="'Shifts'"
                            :placeholder="'Select...'"
                            :items="shifts"
                            :error="shiftError.find(item => item.field === `shift-${index}`)"
                            required
                            @blur="CheckEmptyField(item.shift, 'shift')"
                          />
                          <AppInput
                            v-else
                            v-model="item.edit_shift"
                            :type="'select'"
                            :name="`shift-${index}`"
                            :label="'Shifts'"
                            :placeholder="'Select...'"
                            :items="shifts"
                            :error="shiftError.find(item => item.field === `shift-${index}`)"
                            required
                            @blur="CheckEmptyField(item.shift, 'shift')"
                          />
                      </div>
                      <div class="w-full md:w-1/5 px-1">
                        <AppTime
                          v-if="item.initial"
                          v-model="item.time_start"
                          :type="'time'"
                          :name="`time_start-${index}`"
                          :label="'Start Time'"
                          :error="shiftError.find(item => item.field === `time_start-${index}`)"
                          required
                          :inClass="index%2?'bg-gray-200':''"
                          @blur="CheckEmptyField(item.time_start,'time_start')"
                        />
                        <AppTime
                          v-else
                          v-model="item.edit_time_start"
                          :type="'time'"
                          :name="`time_start-${index}`"
                          :label="'Start Time'"
                          :error="shiftError.find(item => item.field === `time_start-${index}`)"
                          required
                          :inClass="index%2?'bg-gray-200':''"
                          @blur="CheckEmptyField(item.time_start,'time_start')"
                        />
                      </div>
                      <div class="w-full md:w-1/5 px-1">
                        <AppTime
                          v-if="item.initial"
                          v-model="item.time_end"
                          :type="'time'"
                          :name="`time_end-${index}`"
                          :label="'End Time'"
                          :error="shiftError.find(item => item.field === `time_end-${index}`)"
                          required
                          :inClass="index%2?'bg-gray-200':''"
                          @blur="CheckEmptyField(item.time_end,'time_end')"
                        />
                        <AppTime
                          v-else
                          v-model="item.edit_time_end"
                          :type="'time'"
                          :name="`time_end-${index}`"
                          :label="'End Time'"
                          :error="shiftError.find(item => item.field === `time_end-${index}`)"
                          required
                          :inClass="index%2?'bg-gray-200':''"
                          @blur="CheckEmptyField(item.time_end,'time_end')"
                        />
                      </div>
                      <div class="w-full md:w-1/5 px-1">
                        <AppInput
                          v-if="item.initial"
                          v-model="item.locum_detail_rate_type_id"
                          :type="'select'"
                          :name="`locum_detail_rate_type_id-${index}`"
                          :label="'Rate type'"
                          :items="rate_lists"
                          :error="shiftError.find(item => item.field === `locum_detail_rate_type_id-${index}`)"
                          required
                        />
                        <AppInput
                          v-else
                          v-model="item.edit_locum_detail_rate_type_id"
                          :type="'select'"
                          :name="`locum_detail_rate_type_id-${index}`"
                          :label="'Rate type'"
                          :items="rate_lists"
                          :error="shiftError.find(item => item.field === `locum_detail_rate_type_id-${index}`)"
                          required
                        />
                      </div>
                      <div class="w-full md:w-1/5 px-1 flex items-center">
                        <AppInput
                          v-if="item.initial"
                          class="w-full"
                          v-model="item.rate"
                          :type="'text'"
                          :name="`rate-${index}`"
                          :label="'Rate £'"
                          :min="1"
                          :in-style="'text-align:right; background-color: transparent;'"
                          :limit="8"
                          :inClass="index%2?'bg-gray-200':''"
                          required
                          :error="shiftError.find(item => item.field === `rate-${index}`)"
                          @blur="CheckEmptyField(item.rate,'rate'), item.rate === '' ? item.rate = 0 : item.rate"
                          @focus="item.rate === 0 ? item.rate = '' : item.rate"
                          @keydown="isNumber($event)"
                        />
                        <AppInput
                          v-else
                          class="w-full"
                          v-model="item.edit_rate"
                          :type="'text'"
                          :name="`rate-${index}`"
                          :label="'Rate £'"
                          :min="1"
                          :in-style="'text-align:right; background-color: transparent;'"
                          :limit="8"
                          :inClass="index%2?'bg-gray-200':''"
                          required
                          :error="shiftError.find(item => item.field === `rate-${index}`)"
                          @blur="CheckEmptyField(item.rate,'rate'), item.rate === '' ? item.rate = 0 : item.rate"
                          @focus="item.rate === 0 ? item.rate = '' : item.rate"
                          @keydown="isNumber($event)"
                        />
                      </div>
                    </div>
                    <div class="flex flex-col md:flex-row md:justify-end">
                      <AppButton v-if="editShiftId && editShiftId === item.value" :label="'Cancel Editing'" class="md:mr-1 mb-1 md:mb-0" @click="cancelEditing(item, index)" />
                      <AppButton v-if="!item.initial" :label="editShiftId && editShiftId === item.value ? 'Save' : 'Edit'" class="md:mr-1 mb-1 md:mb-0" @click="editShift('save', item, index)" />
                      <AppButton v-if="item.initial" :label="'Save'" class="md:mr-1 mb-1 md:mb-0" @click="saveShiftSchedule(item, index)" />
                      <AppButton v-if="item.initial" :label="'Remove'" :inStyle="'padding:5px 14px;'" class="md:mr-1 mb-1 md:mb-0" @click="[confirmClosing = true, confirmation={message: 'Are you sure you want to remove this shift?', type: 'remove', data: {id:item.id, index: index}}]"/>
                      <!-- removeSchedule(item.id, index) -->
                      <!-- <AppButton :label="item.appliedToAll ? 'Cancel Apply to All' : 'Apply to All'" class="md:mr-1" @click="applyToAll(item)" :disabled="item.initial"/> -->
                    </div>
                  </template>
                  <!-- <p class="text-red-600 flex items-center text-sm justify-end pt-4" v-if="item.initial"><svgicon name="exclamation-mark" width="16" heigth="16" class="mr-1 fill-current"/>Not yet saved</p> -->
                </div> 
              </div>
              </transition>
            </div>
            <div class="flex items-center justify-end border-t p-4">
                <p v-if="shift_schedule && shift_schedule.length" class="text-gray-700 font-bold text-xs mx-2 px-2 flex items-center justify-center border-b-2">{{ shift_schedule.length }}</p>
                <AppButton v-if="shift_schedule && shift_schedule.length" :label="'Add Shift'" :inStyle="'padding:5px 14px;'" class="mr-1" @click="addShiftSchedule" />
                <AppButton :label="'Close'" :inStyle="'padding:5px 14px;'" @click="(shift_schedule && shift_schedule.find(item => item.initial) || editShiftId) ? [confirmClosing = true, confirmation={message: 'Discard Changes?', type: 'close'}] : closeShift('closeButton')"/>
              </div>
          </div>
        </div>
      </transition>
		<div class="w-full">
			<AppMultipleDates
				v-model="schedule_dates"
				:name="'dates'"
				:label="'Job Dates'"
				is-after
				multipleSelection
				required
				:overlayData="overlayData"
				@focus="setOverlayData"
				:error="formError.find(err => err.field === 'dates') ? formError.find(err => err.field === 'dates') : formError.find(err => err.field === 'schedules')"
			/>
		</div>
		<AppButton
			:label="'Manage Shifts'"
			@click="showShifts = true"
			:inStyle="'padding:5px 14px;'"
			v-if="schedule.length"
		/>
		<div v-if="schedule.length" class="w-full pt-4">
			<p class="font-bold">Job Dates</p>
			<div class="overflow-x-hidden overflow-y-auto" ref="selectionWrapper" style="max-height: 350px;">
				<div v-for="(sched, index) in schedule" :key="index">
					<p
						:class="shift_schedule.length && shift_schedule.filter(sched => !sched.initial).length ? '-mb-4' : ''"
					>{{ $moment(sched.date).format('DD/MM/YYYY') }}</p>
					<AppInput
						v-if="shift_schedule.length && shift_schedule.filter(sched => !sched.initial).length"
						v-model="sched.shift_id"
						:type="'multi-checkbox'"
						:name="`shift-${index+1}`"
						:placeholder="''"
						:isHorizontal="true"
						:lists="shift_schedule.filter(sched => !sched.initial)"
						@checked="shiftCheckAction('checked', sched.shift_id, index, $event)"
						@unchecked="shiftCheckAction('unchecked', sched.shift_id, index, $event)"
						@uncheckAll="shiftCheckAction('unCheckAll', sched.shift_id, index, $event)"
					/>
				</div>
			</div>
			<div class="flex mt-2" v-if="!shift_schedule.length">
				<svgicon
					name="exclamation-mark"
					width="18"
					height="18"
					class="fill-current text-orange-500 mr-2"
				/>
				<p class="text-sm">
					It seems like your shifts hasn't been set-up yet.
					<br />Click
					<span
						class="underline text-blue-500 cursor-pointer hover:text-blue-700"
						@click="showShifts=true"
					>here</span> to add shift.
				</p>
			</div>
		</div>
	</div>
</template>
<script>
import AppInput from "@/components/Base/AppInput";
import AppTime from "@/components/Base/AppTime";
import AppMultipleDates from "@/components/Base/AppMultipleDates";
import AppButton from "@/components/Base/AppButton";
import AppConfirmationModal from "@/components/Base/AppConfirmationModal";
export default {
	components: {
		AppInput,
		AppTime,
		AppMultipleDates,
		AppButton,
		AppConfirmationModal
	},
	// props: ["formError", "shifts", "rate_lists"],
	props: {
		value: Array,
		formError: Array,
		shifts: Array,
		rate_lists: Array,
		scheduleTemplates: Array,
		jobSchedule: Array
	},
	data() {
		return {
			// SPLIT JOBS
			schedule_dates: [],
			shift_schedule: [],
			schedules: [],
			schedule: [],
			overlayData: [],
			showShifts: false,
			editShiftId: "",
			shift_saving: "",
			confirmClosing: false,
			shiftError: [],
			applyLoadedData: false,
			loadedSchedule: []
		};
	},
	created() {
		if(this.scheduleTemplates) {
			this.scheduleTemplates.forEach((shift, i) => {
			  this.shift_schedule.push({...shift, 
			    value: (i+1).toString(),
			    label: shift.name
			  })
			})
		}
		if (this.jobSchedule) {
			this.loadedSchedule = this.jobSchedule
			this.jobSchedule.forEach((sched, i) => {
				let shift_id = this.shift_schedule.findIndex(shift => shift.name === sched.schedule_template_name)
				let isExistingDate = this.schedule.find(item => item.date === sched.date)
				if (isExistingDate) {
					isExistingDate.shift_id.push((shift_id).toString())
				}else {
					this.schedule_dates.push(sched.date)
					this.schedule.push({
						date: sched.date,
						shift_id: [(shift_id+1).toString()]
					})
				}
			})
		}
	},
	watch: {
		schedule_dates(value) {
			if (value.length) {
				let removedAnItem = false;
				this.schedule.forEach((sched, index) => {
					let dateStillExist = value
						.map(date => sched.date === date)
						.includes(true);
						if (!dateStillExist) {
							this.schedule.splice(index, 1);
							removedAnItem = true;
						}
					});
					if (!removedAnItem) {
						let isExisting = this.schedule.find(item => item.date === value[value.length - 1])
						if (!isExisting){
							this.schedule.push({ date: value[value.length - 1], shift_id: [] });
							 this.$nextTick(() => {
									this.$refs.selectionWrapper.scrollTop = this.$refs.selectionWrapper.scrollHeight;
								});
						}
					}
			}
		}
	},
	methods: {
		setOverlayData(){
			console.log(this.schedule)
			this.schedule.forEach(sched => {
				sched.shift_id.forEach(id => {
					let shift = this.shift_schedule.find(item => item.value === id)
					this.overlayData.push({
						date: sched.date, ...shift
					})
				})
			})
		},
		addShiftSchedule() {
			this.shift_schedule.push({
				value: (this.shift_schedule.length + 1).toString(),
				label: '',
				shift_id: "",
				time_start: '',
				time_end: '',
				locum_detail_rate_type_id: 0,
				rate: 0,
				edit_label: '',
				edit_shift: "",
				edit_time_start: '',
				edit_time_end: '',
				edit_locum_detail_rate_type_id: 0,
				edit_rate: 0,
				appliedToAll: false,
				initial: true
			})
				this.$nextTick(() => {
				this.$refs.scheduleWrapper.scrollTop = this.$refs.scheduleWrapper.scrollHeight;
			});
		},
		saveShiftSchedule(shift, index) {
			this.shiftError = []
			if (!shift.label) {
				this.shiftError.push({ field: `label-${index}`, message: 'Shift Name is required.'})
			}else {
				if (this.shift_schedule.find((item, i) => item.label === shift.label && index !== i)) {
					this.shiftError.push({ field: `label-${index}`, message: 'Shift Name already exist.'})
				}
			}
			if (shift.locum_detail_rate_type_id === 0) {
				this.shiftError.push({ field: `locum_detail_rate_type_id-${index}`, message: 'Rate type is required.'})
			}
			if (shift.rate === 0) {
				this.shiftError.push({ field: `rate-${index}`, message: 'Rate is required.'})
			}
			if (!shift.shift_id) {
				this.shiftError.push({ field: `shift-${index}`, message: 'Shift is required.'})
			}
			if (!shift.time_start) {
				this.shiftError.push({ field: `time_start-${index}`, message: 'Start Time is required.'})
			}
			if (!shift.time_end) {
				this.shiftError.push({ field: `time_end-${index}`, message: 'End Time is required.'})
			}
			if (!this.shiftError.length) {
					shift.initial=false
					this.shift_saving = index
					setTimeout(() => {
						this.shift_saving = ''
					}, 1000);
			}
		},
		editShift(action, item, index) {
			if (action === 'edit') {
				item.edit_label = item.label
				item.edit_locum_detail_rate_type_id = item.locum_detail_rate_type_id
				item.edit_rate = item.rate
				item.edit_shift = item.shift_id
				item.edit_time_start = item.time_start
				item.edit_time_end = item.time_end
				this.editShiftId = item.value
			}else if (action === 'save') {
				this.shiftError = []
				if (!item.edit_label) {
					this.shiftError.push({ field: `label-${index}`, message: 'Shift Name is required.'})
				}
				if (item.edit_locum_detail_rate_type_id === 0) {
					this.shiftError.push({ field: `locum_detail_rate_type_id-${index}`, message: 'Rate type is required.'})
				}
				if (item.edit_rate === 0 || item.edit_rate === '') {
					this.shiftError.push({ field: `rate-${index}`, message: 'Rate is required.'})
				}
				if (!item.edit_shift) {
					this.shiftError.push({ field: `shift-${index}`, message: 'Shift is required.'})
				}
				if (!item.edit_time_start) {
					this.shiftError.push({ field: `time_start-${index}`, message: 'Start Time is required.'})
				}
				if (!item.edit_time_end) {
					this.shiftError.push({ field: `time_end-${index}`, message: 'End Time is required.'})
				}
				if (!this.shiftError.length) {
				item.label = item.edit_label
					item.locum_detail_rate_type_id = item.edit_locum_detail_rate_type_id
					item.rate = item.edit_rate
					item.shift_id = item.edit_shift
					item.time_start = item.edit_time_start
					item.time_end = item.edit_time_end
					this.editShiftId = ''
					this.shift_saving = index
					setTimeout(() => {
						this.shift_saving = ''
					}, 1000);
				}
			}
		},
		cancelEditing(item, index) {
			this.editShiftId = ""
		},
		removeSchedule(id, index) {
			let schedule = this.schedules.filter(sched => sched.shift_schedule !== id)
			this.schedules = schedule
			this.shift_schedule.splice(index, 1)
			if (this.select_dates) this.select_dates =false
		},
		applyToAll(shift) {
			console.log(shift)
			shift.appliedToAll = !shift.appliedToAll 
			// this.applyToAllDates = !this.applyToAllDates
			// this.selected_dates = this.schedule_dates
				this.schedule.forEach( item => {
				console.log(item)
				if (shift.appliedToAll) {
					if (!item.shift_id.includes(shift.value.toString())) {
							item.shift_id.push(shift.value.toString())
						}
				}else {
					let index = item.shift_id.findIndex(id => id === shift.value.toString())
					if (index > -1) {
						item.shift_id.splice(index, 1)
					}
				}
			}) 
			// BATO MO SA LABAS KABA MAY BAGO!!
			console.log(this.schedule)
			// this.$emit('initialSchedule', {schedule: this.schedule, shift_schedule: this.shift_schedule})

		},
		shiftCheckAction(action, shifts, i, e) {
			let shift = this.schedule.find((item,index) => index === i)
			
			if (action === 'checked') {
				shift.shift_id.push(e.toString())
			}else if (action === 'unchecked') {
				let shift_id_index = shift.shift_id.findIndex(id => id === e)
				let selectedShift = this.shift_schedule.find(item => item.value === e)
				if (selectedShift.appliedToAll) {
					selectedShift.appliedToAll = false
				}
				shift.shift_id.splice(shift_id_index, 1)
			}else if (action === 'unCheckAll') {
				shift.shift_id=[]
				this.shift_schedule.forEach(item => item.appliedToAll = false)
			}
			// BATO MO SA LABAS KABA MAY BAGO!!
			this.$emit('initialSchedule', {schedule: this.schedule, shift_schedule: this.shift_schedule})
		},
		closeShift(type, payload) {
			if (type === 'close') {
				if(this.shift_schedule.map(item => item.initial).includes(true)) {
					this.shift_schedule.forEach((shift, index) => {
						if (shift.initial) this.shift_schedule.splice(index, 1)
					})
				}
				this.showShifts = false
			}else if (type === 'remove') {
				this.removeSchedule(payload.id, payload.index)
			}else if (type === 'closeButton') {
				this.showShifts=false
				this.shiftError=[]
			}
			// BATO MO SA LABAS!!
			this.$emit('initialSchedule', {schedule: this.schedule, shift_schedule: this.shift_schedule})
			this.$emit('scheduleTemplates', this.shift_schedule)
			this.confirmClosing = false
		},
	}
};
</script>
<style scoped>
.err-shield {
    background-color: rgba(0, 0, 0, .40)
  }
</style>


