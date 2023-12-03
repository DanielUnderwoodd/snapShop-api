const express = require("express");
const app = express();

require("dotenv").config();
const redis = require("redis");
const db = require("./config/mongoConfig");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const passport = require("passport");
const Customers = require("./models/customerModel");
const sessionCustomers = require("./models/SessionCustomer");
const sessionAdmin = require("./models/sessionAdmin");
const Admin = require("./models/adminModel");
const userAgent = require("express-useragent");
const cookieParser = require("cookie-parser");
const authJwt = require("./config/authJwt");
const rateLimit = require("./config/rateLimit");
const cors = require("cors");

//https://netbest.tk

app.use(
  cors({
    origin: "http://localhost:4002",
    credentials: true,
  })
);
//redis config
const client = redis.createClient(process.env.REDIS_URL);

app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());

//passport inistial
app.use(passport.initialize());

// load the body parser

//mongo config
// error handling for db connection
db.on("error", console.error.bind(console, "MongoDB connection error:"));

// inital db
db.once("open", () => {
  app.listen(process.env.PORT, () => console.log("server running..."));
});

client.on("error", function (error) {
  console.error(error);
});
client.on("connect", function (error) {
  console.log("Redis is connected");
});

// express-useragent config

app.use(userAgent.express());

// initial passport-jwt authnication
authJwt(client);

//import data route

const dataRoute = require("./routes/Data/DataRoutes");

app.use("/api/data", dataRoute);

// public routes admin
const publicRoutesForAdmin = require("./routes/Admin/publicRoutesForAdmin")(
  Admin,
  sessionAdmin,
  client,
  jwt,
  rateLimit
);

// use public routes admin

var unauthorizedAdmin = (req, res, next) => {
  if (req.cookies.jwtAdmin) {
    res.status(500).json("Unauthorized");
  } else {
    next();
  }
};


app.use("/api/admin/pb", unauthorizedAdmin, publicRoutesForAdmin);

// importing private routes customers
const privateRoutesForAdmin = require("./routes/Admin/privateRoutesForAdmin")(
  Admin,
  sessionAdmin,
  client,
  jwt
);
// app.use((req, res, next) => {
//   console.log(req.cookies.jwtCustomer);
// });

// protect private routes customers
app.use(
  "/api/admin/pv",
  passport.authenticate("admin_private"),
  privateRoutesForAdmin
);

//public routes customers
const publicRoutesForCustomer =
  require("./routes/Customers/publicRoutesForCustomer")(
    Customers,
    sessionCustomers,
    client,
    jwt,
    rateLimit
  );

var unauthorizedCustomer = (req, res, next) => {
  if (req.cookies.jwtCustomer) {
    res.status(500).json("Unauthorized");
  } else {
    next();
  }
};

// use public routes customers
app.use("/api/customer/pb", unauthorizedCustomer, publicRoutesForCustomer);

// importing private routes customers
const privateRoutesForCustomer =
  require("./routes/Customers/privateRoutesForCustomer")(
    Customers,
    sessionCustomers,
    client,
    jwt
  );

// protect private routes customers
app.use(
  "/api/customer/pv",
  passport.authenticate("customer_private", {
    session: false,
  }),
  privateRoutesForCustomer
);

app.use((req, res, next) => {
  res.status(404).send("404 Not Found");
});
