<template>
	<div id="app">
		<div class="calendar-controls">
			<div v-if="message" class="notification is-success">{{ message }}</div>

			<div class="box">
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
					<label class="label">Starting day of the week</label>
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
					<label class="checkbox">
						<br>
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
			</div>

			<div class="box">
				<div class="field">
					<label class="label">Title</label>
					<div class="control">
						<input v-model="newItemTitle" class="input" type="text" />
					</div>
				</div>

				<div class="field">
					<label class="label">Start date</label>
					<div class="control">
						<input v-model="newItemStartDate" class="input" type="date" />
					</div>
				</div>

				<div class="field">
					<label class="label">Start time</label>
					<div class="control">
						<input v-model="newItemStartTime" class="input" type="time" />
					</div>
				</div>

				<div class="field">
					<label class="label">End date</label>
					<div class="control">
						<input v-model="newItemEndDate" class="input" type="date" />
					</div>
				</div>

				<div class="field">
					<label class="label">End time</label>
					<div class="control">
						<input v-model="newItemEndTime" class="input" type="time" />
					</div>
				</div>

				<br>
				<button class="button is-info" @click="addItem">
					Add Item
				</button>

				<p>
					<br>
					<router-link to="/">Back to home page</router-link>
				</p>
			</div>
		</div>
		<div class="calendar-parent">
			<calendar-view
				:items="items"
				:show-date="showDate"
				:time-format-options="{ hour: 'numeric', minute: '2-digit' }"
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
import config from '../_helpers/server.config.js'
import {authHeader} from '../_helpers/auth-header.js'
import axios from 'axios';

export default {
	name: "Calendar",
	components: {
		CalendarView,
		CalendarViewHeader,
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
			selectionStart: null,
			selectionEnd: null,
			newItemTitle: "",
			newItemStartDate: "",
			newItemStartTime: "",
			newItemEndDate: "",
			newItemEndTime: "",
			newId: 0,
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
		ignoreTimeZoneIssue(date){
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
				this.items=response.data
				this.message= `Event fetched between: ${newPeriod.displayFirstDate.toLocaleDateString()} and ${newPeriod.displayLastDate.toLocaleDateString()}`
			}).catch(error=>this.message=JSON.stringify(error.response.data))
		},
		thisMonth(d, h, m) { // set datetime
			const t = new Date()
			return new Date(t.getFullYear(), t.getMonth(), d, h || 0, m || 0)
		},
		onClickDay(d) { // show message when day clicked
			this.selectionStart = null
			this.selectionEnd = null
			this.message = `You clicked: ${d.toLocaleDateString()}`
		},
		onClickItem(e) { // show message when event clicked
			this.message = `You clicked: ${e.title}`
		},
		setShowDate(d) { // show message for period changed
			this.message = `Changing calendar view to ${d.toLocaleDateString()}`
			this.showDate = d
		},
		setSelection(dateRange) { // can select multiple days
			this.selectionEnd = dateRange[1]
			this.selectionStart = dateRange[0]
		},
		finishSelection(dateRange) { // show message when selection ended
			this.setSelection(dateRange)
			this.message = `You selected: ${this.selectionStart.toLocaleDateString()} -${this.selectionEnd.toLocaleDateString()}`
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
			try{
				let newStartDate = new Date(this.newItemStartDate + " " + this.newItemStartTime)
				let newEndDate = new Date(this.newItemEndDate + " " + this.newItemEndTime)
				const newEvent = {
					startDate: this.ignoreTimeZoneIssue(newStartDate).toISOString(),
					endDate: this.ignoreTimeZoneIssue(newEndDate).toISOString(),
					title: this.newItemTitle,
					description: "",
				}
				const request = {
					url: config.DEFAULT_ROUTE + "/event/createEvent",
					method: 'POST',
					data : newEvent,
					headers: authHeader()
				}
				axios(request).then(response => {
						this.newId = response.id
						this.message = response
						this.items.push({
							startDate: newStartDate,
							endDate: newEndDate,
							title: this.newItemTitle,
							description: "",
							id: this.newId
						})
						this.message = "You added a calendar item!"
					}).catch(error => this.message = JSON.stringify(error.response.data))
			}
			catch(e){
				this.message = e
				return
			}
		},
	},
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
	width: 95vw;
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
/* For long calendars, ensure each week gets sufficient height. The body of the calendar will scroll if needed */
.cv-wrapper.period-month.periodCount-2 .cv-week,
.cv-wrapper.period-month.periodCount-3 .cv-week,
.cv-wrapper.period-year .cv-week {
	min-height: 6rem;
}
/* These styles are optional, to illustrate the flexbility of styling the calendar purely with CSS. */
/* Add some styling for items tagged with the "birthday" class */
.theme-default .cv-item.birthday {
	background-color: #e0f0e0;
	border-color: #d7e7d7;
}
.theme-default .cv-item.birthday::before {
	content: "\1F382"; /* Birthday cake */
	margin-right: 0.5em;
}
/* The following classes style the classes computed in myDateClasses and passed to the component's dateClasses prop. */
.theme-default .cv-day.ides {
	background-color: #ffe0e0;
}
.ides .cv-day-number::before {
	content: "\271D";
}
.theme-default .cv-day.do-you-remember.the-21st .cv-day-number::after {
	content: "\1F30D\1F32C\1F525";
}
</style>
