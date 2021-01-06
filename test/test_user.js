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

describe('POST /user/register', () => {
    let agent

    beforeEach(() => agent = createExpress());

    after(async () => {
        let user = await db.User.findOne({ where: { email: 'registerUser@gmail.com' } });
        await user.destroy();
    })

    it('should successfully create the user registerUser@gmail.com', () => {
        return agent
            .post('/user/register')
            .send({ email: 'registerUser@gmail.com', password: 'testSecret' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.message).to.equal('Registration successful')
            })
    })

    it('should fail to create an already existing user', () => {
        return agent
        .post('/user/register')
        .send({ email: 'registerUser@gmail.com', password: 'otherTestSecret' })
        .expect('Content-Type', /json/)
        .expect(400)
        .then((response) => {
            expect(response.body.message).to.equal('registerUser@gmail.com is already taken')
        })
    })

    it('should fail to create a user with a password of length < 6', () => {
        return agent
            .post('/user/register')
            .send({ email: 'registerUser2@gmail.com', password: 'hello' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then((response) => {
                expect(response.body.message).to.equal('Validation error: \"password\" length must be at least 6 characters long')
            })
    })

    it('should fail to create a user with an invalid email', () => {
        return agent
            .post('/user/register')
            .send({ email: 'registerUser3gmail.com', password: 'testSecret2' })
            .expect('Content-Type', /json/)
            .expect(400)
            .then((response) => {
                expect(response.body.message).to.equal('Validation error: \"email\" must be a valid email')
            })
    })

})