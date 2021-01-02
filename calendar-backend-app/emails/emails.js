const config = require("../server.config.js");

const mailgun = require("mailgun-js");

const eventService = require("../services/event.service");
const userService = require("../services/user.service");

const cron = require("node-cron");

var DailyPostman = (module.exports = {
  dailyMail: {},
  dailyReminders: {},
  getTodayDates: function() {
    const tmp = new Date();
    const todayStart = new Date(
      tmp.getFullYear(),
      tmp.getMonth(),
      tmp.getDate(),
      0,
      30,
      0
    );
    tmp.setDate(tmp.getDate() + 1);
    const todayEnd = new Date(
      tmp.getFullYear(),
      tmp.getMonth(),
      tmp.getDate(),
      0,
      29,
      59
    );
    return [todayStart, todayEnd];
  },
  addDailyMail: async function(event, email) {
    const dates = this.getTodayDates();
    if (
      event.notify &&
      dates[0].getTime() <= event.startDate &&
      event.startDate <= dates[1].getTime()
    ) {
      if (this.dailyMail[email] == undefined) this.dailyMail[email] = [];
      this.dailyMail[email].push(event);
    }
  },
  modifyDailyMail: async function(event, email) {
    const dates = this.getTodayDates();
    if (
      event.notify &&
      dates[0].getTime() <= event.startDate &&
      event.startDate <= dates[1].getTime()
    ) {
      this.dailyMail[email].forEach((e) => {
        if (e.id == event.id) {
          const index = this.dailyMail[email].indexOf(e);
          this.dailyMail[email][index] = event;
          return;
        }
      });
    }
  },
  getDailyMail: async function(email) {
    const dates = this.getTodayDates();
    const datesObj = {
      startDate: dates[0],
      endDate: dates[1],
    };
    const events = await eventService.getEvents(datesObj, email, true);
    this.dailyMail[email] = events;
  },
  setDailyReminder: async function(email) {
    this.dailyReminders[email] = cron.schedule("*/5 * * * *", () => {
      const events = this.dailyMail[email];
      events.forEach((event) => {
        const now = new Date();
        const diffMins = Math.round(
          (((event.startDate - now) % 86400000) % 3600000) / 60000
        );
        if (diffMins > 0 && diffMins <= 30) {
          this.sendMail(diffMins, event, email);
          const index = this.dailyMail[email].indexOf(event);
          if (index > -1) {
            this.dailyMail[email].splice(index, 1);
          }
        }
      });
    });
  },
  sendMail: async function(diffMins, event, email) {
    const mg = mailgun({ apiKey: config("API_KEY"), domain: config("DOMAIN") });
    const data = {
      from: "The Calendar Team <awesome.calendar.team@gmail.com>",
      to: email,
      subject: event.title,
      text:
        "Reminder: you have the event '" +
        event.title +
        "' in " +
        diffMins +
        " minutes",
    };
    mg.messages().send(data, function(error, body) {
      console.log(body);
    });
  },
  dailyTask: async function() {
    this.dailyMail = {};
    this.dailyReminders = {};
    const users = new Set(await userService.getUsers());
    users.forEach((user) => DailyPostman.getDailyMail(user.email));
    users.forEach((user) => DailyPostman.setDailyReminder(user.email));
  },
});

cron.schedule("1 0 * * *", () => {
  DailyPostman.dailyTask();
});

cron.schedule("0 0 * * *", () => {
  DailyPostman.dailyReminders.forEach((reminder) => reminder.stop());
});
