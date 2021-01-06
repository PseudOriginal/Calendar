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

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

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

describe('POST /event/createEvent', () => {
    const agent = createExpress();

    before(async () => {
        await agent
            .post('/user/register')
            .send({ email: 'createEvent.test@gmail.com', password: 'testSecret' })
        await agent.post('/user/login')
            .send({email : 'createEvent.test@gmail.com', password: 'testSecret' })
    })

    after(async () => {
        db.Event.destroy({
            where: {email:'createEvent.test@gmail.com'},
            truncate: true
          })
        let user = await db.User.findByPk('createEvent.test@gmail.com');
        await user.destroy();
    })

    it('should successfully create an event for the user createEvent.test@gmail.com', async () => {
        return agent.post('/event/createEvent')
            .send({
                startDate : '2020-12-27T00:00:00.000Z', 
                endDate: '2020-12-27T23:59:00.000Z',
                title: 'Hello world',
                description: '',
                notify: false
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.id).to.be.a('number')
                expect(response.body.startDate).to.equal('2020-12-27T00:00:00.000Z')
                expect(response.body.endDate).to.equal('2020-12-27T23:59:00.000Z')
                expect(response.body.title).to.equal('Hello world')
                expect(response.body.notify).to.equal(false)
                expect(response.body.description).to.equal('')
                expect(response.body.email).to.equal('createEvent.test@gmail.com')
            })
    })

})