const dotenv = require("dotenv");
const connectDB = require("./backend/config/db.js");
const userRoute = require("./backend/routes/userRoute.js");
// import User from "./backend/models/userModel";
const adminRoute = require("./backend/routes/adminRoute.js");
const interviewQuestionRoute = require("./backend/routes/interviewQuestionRoute.js");
const bodyParser = require("body-parser");
const jsonwebtoken = require("jsonwebtoken");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

/// SECURITY ///
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

//connect database
connectDB();

//dotenv config
dotenv.config();

// create express app
const app = express();

// setup route middleware

const globallimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 200, // Limit each IP to 200 requests per `window` (here, per 10 minutes)
  message:
    "Too many accounts created from this IP, please try again after an hour",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
app.use(globallimiter);

// Set user route limits
const userLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 200 requests per `window` (here, per 10 minutes)
  message:
    "Too many user requests from this IP, please try again after an hour",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Set user route limits
const questionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 10 minutes)
  message:
    "Too many user requests from this IP, please try again after an hour",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(helmet());
// console.log("Begin ------->");

const whitelist = [
  "http://localhost:3000",
  "http://localhost:3000/",
  "https://interview-questions.glassinteractive.com/",
  "https://interview-questions.glassinteractive.com",
  "https://www.interview-questions.glassinteractive.com",
  "https://www.interview-questions.glassinteractive.com/",
  "glassinteractive.com",
  "http://localhost:8000",
  "https://api-iq.glassinteractive.com",
];

const options = {
  // origin: true,
  origin: function (origin, callback) {
    console.log("origin", origin);
    // console.log("whitelist", whitelist);
    // console.log("whitelist.indexOf(origin)", whitelist.indexOf(origin));
    if (!origin || origin === undefined || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  exposedHeaders: "ratelimit-limit, ratelimit-remaining, ratelimit-reset",
  credentials: true,
  methods: ["GET", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"],
  // allowedHeaders: ["Content-Type", "Authorization"],
  maxAge: 3600,
};
app.use(cors(options));

app.set("trust proxy", 1);
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));
app.use(bodyParser.json({ limit: "10mb" }));
app.use(cookieParser());

try {
  app.use(function (req, res, next) {
    // ****************************************************************
    // *** FOR DEV ONLY REMOVE FOR PROD ***
    // ****************************************************************
    // console.log("process.env.SECRET ", process.env.SECRET);
    // console.log("process.env.PORT ", process.env.PORT);
    // console.log("process.env.DOMAIN ", process.env.DOMAIN);
    // ****************************************************************
    console.log("A request------->");
    // console.log("HEADERS -->", req.headers);
    if (
      req.headers &&
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "JWT"
    ) {
      jsonwebtoken.verify(
        req.headers.authorization.split(" ")[1],
        process.env.SECRET,
        function (err, decode) {
          if (err) {
            if (process.env.SECRET && process.env.SECRET != "undefined") {
              console.log(
                "There is a temporary server issue. Please try your request again. Error: NS-SVR",
                err
              );
              return res.status(403).json({
                message:
                  "There is a temporary issue accessing the required security data. Please try your request again. Error: NS-SVR | " +
                  err,
              });
            }
            req.user = undefined;
          }
          console.log("Trying to decode the user object", req.user);
          req.user = decode;

          next();
        }
      );
    } else {
      req.user = undefined;
      next();
    }
  });
} catch (err) {
  console.log(
    "There is a temporary server issue. Please try your request again. Error: TC-SRV",
    err
  );
}

// app.use(function (req, res) {
//   res.status(404).send({ url: req.originalUrl + " not found" });
// });

//Creating API for user
app.use("/api/users", userLimiter, userRoute);

//Creating API for AudiInterview Question Info
app.use(
  "/api/all-interview-questions",
  questionLimiter,
  interviewQuestionRoute
);

//Creating API for admin functions
app.use("/api/special-admin/", userLimiter, adminRoute);

const PORT = process.env.PORT || 8001;

//Express js listen method to run project on http://localhost:8000
app.listen(
  PORT,
  console.log(`App is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
