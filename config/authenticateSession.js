const authenticateSession = (Model, authData, client, done, token) => {
  const sessionId = authData.sessionId;
  client.get(sessionId, async (err, reply) => {
    if (err) throw err;
    else if (reply === null || reply === false) {
      let findOneResponse = await Model.findOne({
        email: authData.email,
      });

      if (findOneResponse) {
        let session = findOneResponse.session;

        let result = session.find((element) => element === sessionId);

        if (result === undefined) {
          return done(null);
        } else {
          client.setex(sessionId, 60 * 60 * 24 * 5, true, (err, reply) => {
            if (err) throw err;
            else if (reply) {
              return done(null, token);
            }
          });
        }
      } else {
        return done(null);
      }
    } else {
      return done(null, token);
    }
  });
};

module.exports = authenticateSession;
