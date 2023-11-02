const uniqid = require("uniqid");

const verifyCodeLogin = (
  req,
  res,
  client,
  userModel,
  userSession,
  jwt,
  findResponse,
  role
) => {
  client.del(req.body.email, async (err, reply) => {
    if (err) throw err;
    if (reply === 1) {
      var cookieName = "";
      var secretOrKey = "";

      console.log(findResponse);
      console.log(req.body);

      var session = {
        platform: req.useragent.platform,
        os: req.useragent.os,
        browser: req.useragent.browser,
        version: req.useragent.version,
        ipAddress: req.connection.remoteAddress,
        _id: uniqid(),
        UID: findResponse.UID,
      };
      const newSession = new userSession(session);
      try {
        var saveResponseForUserSession = await newSession.save({
          new: true,
        });
        let query = {
          _id: findResponse._id,
        };
        try {
          var updateResponse = await userModel.updateOne(query, {
            $push: { session: saveResponseForUserSession._id },
          });
        } catch (err) {
          console.log(`Internal Mongodb error: ${err}`);
        }
      } catch (err) {
        if (err.code === 11000) {
          let conflictSession = {
            platform: req.useragent.platform,
            os: req.useragent.os,
            browser: req.useragent.browser,
            version: req.useragent.version,
            ipAddress: req.connection.remoteAddress,
            UID: findResponse.UID,
          };
          try {
            var findSession = await userSession.findOne(conflictSession);
          } catch (err) {
            console.log(err);
          }
        }
      }

      if (updateResponse === undefined || updateResponse.nModified === 1) {
        // const exp = Math.floor(Date.now() / 1000) + (60)

        var body = {
          _id: findResponse._id,
          firstName: findResponse.firstName,
          lastName: findResponse.lastName,
          email: findResponse.email,
          role: findResponse.role,
          phoneNumber: findResponse.phoneNumber,
          // exp
        };
        if (saveResponseForUserSession) {
          body.sessionId = saveResponseForUserSession._id;
        } else {
          body.sessionId = findSession._id;
        }
        switch (role) {
          case "customer":
            cookieName = "jwtCustomer";
            secretOrKey = "customer_secret";
            body = {
              ...body,
              address: findResponse.address,
              status: findResponse.status,
              balance: findResponse.balance,
            };
            break;
          case "admin":
            cookieName = "jwtAdmin";
            secretOrKey = "admin_secret";
        }
        const token = jwt.sign(
          {
            [role]: body,
            // exp
          },
          secretOrKey
        );

        res.cookie(cookieName, token, {
          httpOnly: true,
          maxAge: 24 * 7 * 60 * 60 * 4 * 12 * 1000,
          path: "/",
        });

        res.status(200).json(body);
      } else {
        console.log("data in mongodb hasn't modified");
      }
    }
  });
};

module.exports = verifyCodeLogin;
