const passport = require("passport");
const Customers = require("../models/customerModel");
const Admin = require("../models/adminModel");
const JwtStrategy = require("passport-jwt").Strategy;
const authenticateSession = require("./authenticateSession");

const authJwt = (client) => {
  passport.use(
    "customer_private",
    new JwtStrategy(
      {
        secretOrKey: "customer_secret",
        jwtFromRequest: (req) => req.cookies.jwtCustomer,
      },
      async (token, done) => {
        try {
          let authData = {
            sessionId: token.customer.sessionId,
            email: token.customer.email,
          };
          authenticateSession(Customers, authData, client, done, token);
        } catch (error) {
          done(error);
        }
      }
    )
  );
  passport.use(
    "admin_private",
    new JwtStrategy(
      {
        secretOrKey: "admin_secret",
        jwtFromRequest: (req) => req.cookies.jwtAdmin,
      },
      async (token, done) => {
        try {
          let authData = {
            sessionId: token.admin.sessionId,
            email: token.admin.email,
          };
          authenticateSession(Admin, authData, client, done, token);
        } catch (error) {
          done(error);
        }
      }
    )
  );
};

module.exports = authJwt;
