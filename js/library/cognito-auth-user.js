var Enigma = window.Enigma || {};

(function scopeWrapper($) {
  var failRedirect = "signin.html";

  var poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId,
  };

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  if (typeof AWSCognito !== "undefined") {
    AWSCognito.config.region = _config.cognito.region;
  }

  Enigma.signOut = function signOut() {
    var currentUser = userPool.getCurrentUser()
    if (currentUser) {
      currentUser.signOut();
    }
    localStorage.removeItem("enigmaUser");
    window.location.href = failRedirect;
  };

  Enigma.authToken = (function () {
    return new Promise(function fetchCurrentAuthToken(resolve, reject) {
      var cognitoUser = userPool.getCurrentUser();
      if (cognitoUser) {
        cognitoUser.getSession(function sessionCallback(err, session) {
          if (err) {
            localStorage.removeItem("enigmaUser");
            reject(err);
          } else if (!session.isValid()) {
            localStorage.removeItem("enigmaUser");
            resolve(null);
          } else {
            // User is logged in.
            const enigmaUserData = localStorage.getItem("enigmaUser");
            if (!enigmaUserData) {
              resolve(null);
            }
            resolve(session.getIdToken().getJwtToken());
          }
        });
      } else {
        resolve(null);
      }
    });
  })();

  Enigma.authToken.then(function(res) {
    if (!res) {
      window.location.href = failRedirect;
    }
  }).catch(function(err) {
    console.error("Failed to get auth token:", err);
    window.location.href = failRedirect;
  });

})(jQuery);
