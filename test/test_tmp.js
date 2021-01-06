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
    /*app.get("/", (req, res) => {
        res.send("Hello World!");
    });*/
    app.use("/user", userRoutes);
    app.use("/event", eventRoutes);
    app.use(
        history({
            verbose: true,
        })
    );
    app.use(express.static(path.join(__dirname, "../dist")));
    app.use(errorHandler);
    const port =
        process.env.NODE_ENV === "production" ? process.env.PORT || 80 : 4000;
    app.listen(port, () => console.log(`Start listening on port ${port}`));

    const agent = request.agent(app)
    return agent
}

describe('POST /user/register', () => {

    after(async () => {
        let user = await db.User.findOne({
            where: {
                email: 'john.smithtest@gmail.com'
            },
        });
        await user.destroy();
    })

    it('should successfully create the user john.smithtest@gmail.com', async () => {
        const agent = createExpress()
        await agent
            .post('/user/register')
            .send({ email: 'john.smithtest@gmail.com', password: 'testSecret' })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body.message).to.equal('Registration successful')
            })
    })

})