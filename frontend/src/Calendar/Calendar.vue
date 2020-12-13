<template>
	<div id="app">
		<div class="calendar-controls">

			<div class="box">
				<div class="field">
					<router-link to="/">Back to home page</router-link>
				</div>

				<h4 class="title is-5">Options</h4>

				<div class="field">
					<label class="label">Change calendar format</label>
					<div class="control">
						<div class="select">
							<select v-model="displayPeriodUom">
								<option>month</option>
								<option>week</option>
								<option>year</option>
							</select>
						</div>
					</div>
				</div>

				<div class="field">
					<label class="label">Starting weekday</label>
					<div class="control">
						<div class="select">
							<select v-model="startingDayOfWeek">
								<option
									v-for="(d, index) in dayNames"
									:key="index"
									:value="index"
								>
									{{ d }}
								</option>
							</select>
						</div>
					</div>
				</div>

				<div class="field">
					<br>
					<label class="checkbox">
						<input v-model="displayWeekNumbers" type="checkbox" />
						Display week numbers
					</label>
				</div>

				<div class="field">
					<label class="checkbox">
						<input v-model="showTimes" type="checkbox" />
						Display hours
					</label>
				</div>

				<div class="field">
					<label class="label">Title*</label>
					<div class="control">
						<input v-model="newItemTitle" class="input-text" type="text"/>
					</div>
				</div>

				<div class="field">
					<label class="label">Description</label>
					<div class="control">
						<textarea v-model="newItemDescription" class="input-text"/>
					</div>
				</div>

				<div class="field">
					<label class="checkbox">
						<input v-model="newItemNotify" type="checkbox" />
						Notify me by email
					</label>
				</div>

				<div class="field">
					<label class="label">Start date*</label>
					<div class="control">
						<input v-model="newItemStartDate" class="input-date" type="date"  />
						<input v-model="newItemStartTime" class="input-time" type="time" />
					</div>
				</div>

				<div class="field">
					<label class="label">End date*</label>
					<div class="control">
						<input v-model="newItemEndDate" class="input-date" type="date" />
						<input v-model="newItemEndTime" class="input-time" type="time" />
					</div>
				</div>
				
				<br>	
				<div v-if="!eventSelectionState">
					<button class="button is-info" @click="addItem">
						Add Item
					</button>
					<button class="button is-info" @click="clearFields">
						Clear Fields
					</button>
				</div>
				<div v-else class="btnContainer">
  					<button class="button is-info" @click="saveEdit">
						Save Edit
					</button>
					<button class="button is-info" @click="cancel">
						Cancel
					</button>
					<button class="button is-info" @click="deleteItem">
						Delete
					</button>
				</div>
			</div>
		</div>

		<div class="calendar-parent">
			<calendar-view
				:items="items"
				:show-date="showDate"
				:time-format-options="{ hour: '2-digit', minute: '2-digit' }"
				:show-times="showTimes"
				:display-period-uom="displayPeriodUom"
				:starting-day-of-week="startingDayOfWeek"
				class="theme-default holiday-us-traditional holiday-us-official"
				:displayWeekNumbers="displayWeekNumbers"
				:enable-date-selection="true"
				:selection-start="selectionStart"
				:selection-end="selectionEnd"
				@date-selection-start="setSelection"
				@date-selection="setSelection"
				@date-selection-finish="finishSelection"
				@drop-on-date="onDrop"
				@click-item="onClickItem"
				@click-date="onClickDay"
				:periodChangedCallback = "periodChangedCallback"
			>
				<calendar-view-header
					slot="header"
					slot-scope="{ headerProps }"
					:header-props="headerProps"
					@input="setShowDate"
				/>
			</calendar-view>
		</div>
	</div>
</template>

<script>
// Load CSS from the published version
require("vue-simple-calendar/static/css/default.css")
require("vue-simple-calendar/static/css/holidays-us.css")

import {
	CalendarView,
	CalendarViewHeader,
	CalendarMathMixin,
} from "vue-simple-calendar" // published version
import VueSimpleAlert from 'vue-simple-alert'
import config from '../_helpers/server.config.js'
import {authHeader} from '../_helpers/auth-header.js'
import axios from 'axios'
import Vue from "vue"

Vue.use(VueSimpleAlert)

export default {
	name: "Calendar",
	components: {
		CalendarView,
		CalendarViewHeader,
		CalendarMathMixin
	},
	mixins: [CalendarMathMixin],
	data() {
		return {
			/* Show the current month, and give it some fake items to show */
			showDate: new Date(), // today date
			message: "",
			startingDayOfWeek: 0, // set sunday for starting day of week
			displayPeriodUom: "month",
			displayWeekNumbers: false,
			showTimes: true, // display hours for events
			newItemNotify: false,
			selectionStart: null,
			selectionEnd: null,
			eventSelectionState: false,
			newItemTitle: "",
			newItemDescription: "",
			newItemStartDate: "",
			newItemStartTime: "",
			newItemEndDate: "",
			newItemEndTime: "",
			tempItem: {
				title: "",
				description: "",
				startDate: "",
				endDate: ""
			},
			selectedItemId: 0,
			items: [],
		}
	},
	computed: {
		userLocale() {
			return this.getDefaultBrowserLocale
		},
		dayNames() { // day names for starting day options list
			return this.getFormattedWeekdayNames(this.userLocale, "long", 0)
		},
	},
	mounted() { // set date of today as default in start/end date inputs
		this.newItemStartDate = this.isoYearMonthDay(this.today())
		this.newItemStartTime = "00:00"
		this.newItemEndDate = this.isoYearMonthDay(this.today())
		this.newItemEndTime = "23:59"
	},
	methods: {
		clearFields() {
			this.reset(this.today())
			this.clearTempItem()
		},
		reset(d) {
			this.eventSelectionState = false
			this.newItemTitle = ""
			this.newItemDescription = ""
			this.newItemStartDate = this.isoYearMonthDay(d)
			this.newItemStartTime = "00:00"
			this.newItemEndDate = this.isoYearMonthDay(d)
			this.newItemEndTime = "23:59"
		},
		clearTempItem() {
			this.tempItem = {
				title: "",
				description: "",
				startDate: "",
				endDate: ""
			}
		},
		checkChanges() {
			const { title, description, startDate, endDate } = this.tempItem
			let newStartDate = this.newItemStartDate + " " + this.newItemStartTime
			let newEndDate = this.newItemEndDate + " " + this.newItemEndTime

			if (title == this.newItemTitle && description == this.newItemDescription
			&& startDate == newStartDate && endDate == newEndDate)
				return false 
			else 
				return true
		},
		checkTitle() {
			if (this.newItemTitle.replace(/\s+/g, '') == "") {
				this.message = "Error: title cannot be empty."
				return false 
			} else {
				return true
			}
		},
		checkDateTimes() {
			if (this.newItemStartDate == this.newItemEndDate) {
				if (this.newItemStartTime >= this.newItemEndTime) {
					this.message = "Error: startTime cannot be equal or after endTime for same date."
					return false	
				} else {
					return true
				}
			} else {
				if (this.newItemStartDate > this.newItemEndDate) {
					this.message = "Error: startDate cannot be after endDate."
					return false
				} else {
					return true
				}
			}
		},
		ignoreTimeZoneIssue(date) {
			return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
		},
		periodChangedCallback(newPeriod) {
			// Demo does nothing with this information, just including the method to demonstrate how
			// you can listen for changes to the displayed range and react to them (by loading items, etc.)
			const fetchBetween = {
				startDate : this.ignoreTimeZoneIssue(newPeriod.displayFirstDate).toISOString(),
				endDate : this.ignoreTimeZoneIssue(newPeriod.displayLastDate).toISOString(),
			}

			const request = {
				url: config.DEFAULT_ROUTE + "/event/getEvents",
				method: 'GET',
				params : fetchBetween,
				headers: authHeader()
			}
			
			axios(request).then(response=>{
				this.items = response.data
				//this.message = `Event fetched between: ${newPeriod.displayFirstDate.toLocaleDateString()} and ${newPeriod.displayLastDate.toLocaleDateString()}`
			}).catch(error=>this.$fire({ 
					title: "There is a problem with the server.",
					type: 'error',
					width: 400,
					timer: 3000
				}).then(this.$router.push('/login')))
		},
		thisMonth(d, h, m) { // set datetime
			const t = new Date()
			return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
		},
		onClickDay(d) { // show message when day clicked
			this.reset(d)
			this.selectionStart = null
			this.selectionEnd = null
		},
		onClickItem(e) { // show message when event clicked
			this.eventSelectionState = true
			
			let i = e.originalItem

			this.selectedItemId = i.id
			this.newItemTitle = i.title
			this.newItemDescription = i.description

			this.newItemStartDate = i.startDate.substring(0, 10)
			this.newItemEndDate = i.endDate.substring(0, 10)
			
			this.newItemStartTime = i.startDate.substring(11, 16)
			this.newItemEndTime = i.endDate.substring(11, 16)

			let newStartDate = this.newItemStartDate + " " + this.newItemStartTime
			let newEndDate = this.newItemEndDate + " " + this.newItemEndTime

			this.tempItem = {
				title: i.title,
				description: i.description,
				startDate: newStartDate,
				endDate: newEndDate,
			}
		},
		setShowDate(d) { // show message for period changed
			this.reset(d)
			this.eventSelectionState = false
			this.showDate = d
		},
		setSelection(dateRange) { // can select multiple days
			this.selectionEnd = dateRange[1]
			this.selectionStart = dateRange[0]
		},
		finishSelection(dateRange) { // show message when selection ended
			this.setSelection(dateRange)
			this.message = `You selected: ${this.selectionStart.toLocaleDateString()} -${this.selectionEnd.toLocaleDateString()}`

			this.newItemStartDate = this.isoYearMonthDay(this.selectionStart)
			this.newItemEndDate = this.isoYearMonthDay(this.selectionEnd)
		},
		onDrop(item, date) {
			this.message = `You dropped ${item.id} on ${date.toLocaleDateString()}`
			// Determine the delta between the old start date and the date chosen,
			// and apply that delta to both the start and end date to move the item.
			const eLength = this.dayDiff(item.startDate, date)
			item.originalItem.startDate = this.addDays(item.startDate, eLength)
			item.originalItem.endDate = this.addDays(item.endDate, eLength)
		},
		addItem() { // add a calendar event
			if (!this.checkTitle() || !this.checkDateTimes()) {
				this.$fire({ 
						title: this.message,
						type: 'error',
						width: 400,
						timer: 3000
				})
			} else {
				this.$fire({ 
					title: 'New event added.',
					type: 'success',
					width: 400,
					timer: 3000
				})

				let newStartDate = new Date(this.newItemStartDate + " " + this.newItemStartTime)
				let newEndDate = new Date(this.newItemEndDate + " " + this.newItemEndTime)
				
				const newEvent = {
					id: 0,
					startDate: this.ignoreTimeZoneIssue(newStartDate).toISOString(),
					endDate: this.ignoreTimeZoneIssue(newEndDate).toISOString(),
					title: this.newItemTitle,
					notify: this.newItemNotify,
					description: this.newItemDescription
				}

				const request = {
					url: config.DEFAULT_ROUTE + "/event/createEvent",
					method: 'POST',
					data : newEvent,
					headers: authHeader()
				}

				axios(request).then(response => {
					this.message = response

					const { data } = request
					data.id = response.data.id
					
					this.items.push(data)
				
					this.message = "You added a calendar item!"
								
				}).catch(error => this.message = JSON.stringify(error.response.data.message))
				
				this.$forceUpdate()
				this.clearFields()
			}	
		},
		saveEdit() { // update a calendar event
			if (!this.checkTitle() || !this.checkDateTimes()) {
				this.$fire({ 
						title: this.message,
						type: 'error',
						width: 400,
						timer: 3000
				})
			} else {
				this.$fire({ 
					title: 'Event updated.',
					type: 'success',
					width: 400,
					timer: 3000
				})

				let newStartDate = new Date(this.newItemStartDate + " " + this.newItemStartTime)
				let newEndDate = new Date(this.newItemEndDate + " " + this.newItemEndTime)
				
				const existingEvent = {
					id: this.selectedItemId,
					startDate: this.ignoreTimeZoneIssue(newStartDate).toISOString(),
					endDate: this.ignoreTimeZoneIssue(newEndDate).toISOString(),
					title: this.newItemTitle,
					description: this.newItemDescription,
				}

				const request = {
					url: config.DEFAULT_ROUTE + "/event/modifyEvent",
					method: 'POST',
					data: existingEvent,
					headers: authHeader()
				}

				axios(request)
					.then(response => {
						this.message = response

						let index = this.items.map(item => { return item.id }).indexOf(this.selectedItemId)
						this.items[index].startDate = existingEvent.startDate
						this.items[index].endDate = existingEvent.endDate
						this.items[index].title = existingEvent.title
						this.items[index].description = existingEvent.description
		
						this.message = "You edited a calendar item!"
					})
					.catch(error => alert(this.message = JSON.stringify(error.response.data.message)))

				this.clearFields()
			}	
		},
		cancel() { // abort changes and return to previous interface	
			if (this.checkChanges()) {
				this.$fire({
					title: 'Cancel your edits?',
					text: "You won't be able to revert this operation!",
					type: 'warning',
					showCancelButton: true,
					confirmButtonColor: '#3085d6',
					cancelButtonColor: '#d33',
					confirmButtonText: 'OK'
				}).then((result) => {
					if (result.value) { 	
						this.clearFields()
					} 
				})
			} else {
				this.clearFields()
			}
		},
		deleteItem() { // delete a calendar event
			this.$fire({
				title: 'Delete this event?',
				text: "You won't be able to revert this operation!",
				type: 'warning',
				showCancelButton: true,
				confirmButtonColor: '#3085d6',
				cancelButtonColor: '#d33',
				confirmButtonText: 'OK'
			}).then((result) => {
				if (result.value) {
					this.$fire({ 
						title: 'Event deleted.',
						type: 'success',
						width: 400,
						timer: 3000
					}).then((result) => {

						const request = {
							url: config.DEFAULT_ROUTE + "/event/deleteEvent",
							method: 'POST',
							data: {id: this.selectedItemId},
							headers: authHeader()
						}

						axios(request).then(response => {
							this.message = response

							let index = this.items.map(item => { return item.id }).indexOf(this.selectedItemId);
							this.items.splice(index, 1)
	
							this.message = "You removed a calendar item!"
						
						}).catch(error => this.message = JSON.stringify(error.response.data.message))

						this.clearFields()
					})
				}
			})
		}
	}
}
</script>


<style>
html,
body {
	height: 100%;
	margin: 0;
	background-color: #f7fcff;
}
#app {
	display: flex;
	flex-direction: row;
	font-family: Calibri, sans-serif;
	width: 100vw;
	min-width: 30rem;
	max-width: 100rem;
	min-height: 40rem;
	margin-left: auto;
	margin-right: auto;
}
.calendar-controls {
	margin-right: 1rem;
	min-width: 14rem;
	max-width: 14rem;
}
.calendar-parent {
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	overflow-x: hidden;
	overflow-y: hidden;
	max-height: 80vh;
	background-color: white;
}
.input-text {
	width: 218px
}
.input-date {
	width: 140px
}
.input-time {
	width: 75px
}
</style>
