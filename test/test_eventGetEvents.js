const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const history = require("connect-history-api-fallback");
const bodyParser = require("body-parser");
const request = require('supertest');
const { expect } = require('chai');
const errorHandler = require("../calendar-backend-app/_middleware/error-handler");
const userRoutes = require("../calendar-backend-app/routes/user.route");
const eventRoutes = require("../calendar-backend-app/routes/event.route");
const db = require("../calendar-backend-app/_helpers/db");


function createExpress () {
    const dotenv = require("dotenv");
    dotenv.config();
    const app = express()
    app.disable("x-powered-by");
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(cookieParser());
    var corsOptions = {
        origin: ["http://localhost:4000", "http://calendarefrei.herokuapp.com"],
        optionsSuccessStatus: 200,
        credentials: true,
    };
    app.use(cors(corsOptions));
    app.use(express.static(path.join(__dirname, "../dist")));
    app.use("/user", userRoutes);
    app.use("/event", eventRoutes);
    app.use(
        history({
            verbose: true,
        })
    );
    app.use(express.static(path.join(__dirname, "../dist")));
    app.use(errorHandler);

    const agent = request.agent(app)
    return agent
}

describe('GET event/getEvents', () => {
  let agent

  beforeEach(() => agent = createExpress());

  after(async () => {
    let event1 = await db.Event.findOne({ where: { title: 'Hello World', email:'getEvents@gmail.com' } });
    await event1.destroy();
    let event2 = await db.Event.findOne({ where: { title: 'Hello Wowld', email:'getEvents@gmail.com' } });
    await event2.destroy();
    let user = await db.User.findOne({ where: { email: 'getEvents@gmail.com' } });
    await user.destroy();
  })

  it('should successfully get events in the given period', async () => {
    await agent
        .post('/user/register')
        .send({ email: 'getEvents@gmail.com', password: 'testSecret' })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body.message).to.equal('Registration successful')
        })
    await agent
        .post('/user/login')
        .send({ email: 'getEvents@gmail.com', password: 'testSecret' })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body.email).to.equal('getEvents@gmail.com')
        })
    await agent
        .post('/event/createEvent')
        .send({ startDate: '2020-12-27T00:00:00.000Z', endDate: '2020-12-27T00:23:59.000Z', title: 'Hello World', description: '', notify: false })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body.id).to.be.a("number");
            expect(response.body.startDate).to.equal('2020-12-27T00:00:00.000Z')
            expect(response.body.endDate).to.equal('2020-12-27T00:23:59.000Z')
            expect(response.body.title).to.equal('Hello World')
            expect(response.body.notify).to.equal(false)
            expect(response.body.description).to.equal('')
            expect(response.body.email).to.equal('getEvents@gmail.com')
        })
    await agent
        .post('/event/createEvent')
        .send({ startDate: '2019-12-27T00:00:00.000Z', endDate: '2019-12-27T00:23:59.000Z', title: 'Hello Wowld', description: '', notify: false })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body.id).to.be.a("number");
            expect(response.body.startDate).to.equal('2019-12-27T00:00:00.000Z')
            expect(response.body.endDate).to.equal('2019-12-27T00:23:59.000Z')
            expect(response.body.title).to.equal('Hello Wowld')
            expect(response.body.notify).to.equal(false)
            expect(response.body.description).to.equal('')
            expect(response.body.email).to.equal('getEvents@gmail.com')
        })
    return agent
        .get('/event/getEvents?startDate=2020-12-26T00:00:00.000Z&endDate=2020-12-28T00:00:00.000Z')
        .expect('Content-Type', /json/)
        .expect(200)
        .then((response) => {
            expect(response.body).to.be.an('array').of.length(1)
            expect(response.body[0].id).to.be.a("number");
            expect(response.body[0].startDate).to.equal('2020-12-27T00:00:00.000Z')
            expect(response.body[0].endDate).to.equal('2020-12-27T00:23:59.000Z')
            expect(response.body[0].title).to.equal('Hello World')
            expect(response.body[0].notify).to.equal(false)
            expect(response.body[0].description).to.equal('')
            expect(response.body[0].email).to.equal('getEvents@gmail.com')
        })
  })
})