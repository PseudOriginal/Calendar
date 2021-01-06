const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const history = require("connect-history-api-fallback");
const bodyParser = require("body-parser");
const request = require("supertest");
const { expect } = require("chai");
const errorHandler = require("../calendar-backend-app/_middleware/error-handler");
const userRoutes = require("../calendar-backend-app/routes/user.route");
const eventRoutes = require("../calendar-backend-app/routes/event.route");
const db = require("../calendar-backend-app/_helpers/db");

function createExpress() {
  const dotenv = require("dotenv");
  dotenv.config();
  const app = express();
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

  const agent = request.agent(app);
  return agent;
}

describe("POST /user/login", () => {
  let agent;

  beforeEach(() => (agent = createExpress()));

  after(async () => {
    //let user = await db.User.findOne({ where: { email: 'registerUser@gmail.com' } });
    //await user.destroy();
  });

  it("should successfully login if user alex@gmail.com exists", async () => {
    const agent = createExpress();
    await agent
      .post("/user/login")
      .send({ email: "alex@gmail.com", password: "123456" })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((response) => {
        expect(response.text).to.equal('{"email":"alex@gmail.com"}');
      });
  });

  it("should fail if user john.smithtest@gmail.com does not exist", async () => {
    const agent = createExpress();
    await agent
      .post("/user/login")
      .send({ email: "john.smithtest@gmail.com", password: "testSecret" })
      .expect("Content-Type", /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).to.equal(
          "Email and/or password is incorrect!!"
        );
      });
  });

  it("should fail if email and/or password is empty", async () => {
    const agent = createExpress();
    await agent
      .post("/user/login")
      .send({ email: "", password: "" })
      .expect("Content-Type", /json/)
      .expect(400)
      .then((response) => {
        expect(response.body.message).to.equal(
          'Validation error: "email" is not allowed to be empty, "password" is not allowed to be empty'
        );
      });
  });
});
