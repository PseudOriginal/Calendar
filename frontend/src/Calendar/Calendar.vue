<template>
	<div>
        <div id="app">
		<h1>Mon calendrier</h1>
		<calendar-view
			:show-date="showDate"
			:displayPeriodUom="format"
			:items="item"
			displayWeekNumbers=true
			enableDateSelection=true
			weekdayNameFormat="long"
			showTimes=true
			class="theme-default holiday-us-traditional holiday-us-official">
			<calendar-view-header
				slot="header"
				slot-scope="t"
				:header-props="t.headerProps"
				@input="setShowDate" />
		</calendar-view>
        <br>
        <p>
            <router-link to="/">Back to home page</router-link>
        </p>
		<label>Choose calendar format : </label>
		<select v-model="format" id="formatPicker" name="format">
			<option value="week">week</option>
			<option value="month">month</option>
			<option value="year">year</option>
		</select>
		<br>
		<button v-on:click="addItem">New event</button>
        </div>
	</div>
</template>
<script>
import { format } from 'path'
	import { CalendarView, CalendarViewHeader } from "vue-simple-calendar"
	// The next two lines are processed by webpack. If you're using the component without webpack compilation,
	// you should just create <link> elements for these. Both are optional, you can create your own theme if you prefer.
	require("vue-simple-calendar/static/css/default.css")
	require("vue-simple-calendar/static/css/holidays-us.css")

	export default {
		name: 'Calendar',
		data: function() {
			return { showDate: new Date(), format: "month", item:/*store calendar event*/ [{
				id:0,
				startDate: new Date(),
				title:"My first event",
			}] }
		},
		components: {
			CalendarView,
			CalendarViewHeader,
		},
		methods: {
			setShowDate(d) {
				this.showDate = d;
			},
			addItem(){
				alert("TODO");
			}
		}
	}
</script>
<style>
	#app {
		font-family: 'Avenir', Helvetica, Arial, sans-serif;
		color: #502c2c;
		height: 200%;
		width: 200%;
		margin-left: auto;
		margin-right: auto;
	}
</style>