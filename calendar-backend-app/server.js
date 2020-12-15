const express = require("express");
const path = require("path");
const cors = require("cors");
const history = require("connect-history-api-fallback");
const bodyParser = require("body-parser");
const errorHandler = require("./_middleware/error-handler");
const userRoutes = require("./routes/user.route");
const eventRoutes = require("./routes/event.route");

// Loading environment variables
const dotenv = require("dotenv");
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "../dist")));

// API routes
app.get('/', (req, res) => res.send('Hello World!'))
app.use('/user', userRoutes); 
app.use('/event', eventRoutes); 

app.use(
  history({
    verbose: true,
  })
);
app.use(express.static(path.join(__dirname, "../dist")));

// Global error handler
app.use(errorHandler);

// Initializing sending of emails for today
const dailyPostman = require('./emails/emails.js')
dailyPostman.dailyTask()

// Start server
const port = process.env.NODE_ENV === 'production' ? (process.env.PORT || 80) : 4000;
app.listen(port, () => console.log(`Start listening on port ${port}`));

