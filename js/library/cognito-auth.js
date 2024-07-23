const poolData = {
  UserPoolId: _config.cognito.userPoolId,
  ClientId: _config.cognito.userPoolClientId,
};
const redirectURL = "signin.html";
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

if (typeof AWSCognito !== "undefined") {
  AWSCognito.config.region = _config.cognito.region;
}

try {
 authorization = (async () => {
    let cognitoUser = await userPool.getCurrentUser();
    console.log("User value received: ", cognitoUser)
    if(cognitoUser){
        let {session} = await cognitoUser.getSession()
        console.log("Session value received: ", session);
        return session.getIdToken().getJwtToken();
    }
    throw new Error("User value doesn't exist.");
  });
} catch (error) {
  console.error("Error in retrieving authorization token.", error);
  window.location.href = redirectURL;
}

/*
Enigma.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
  var cognitoUser = userPool.getCurrentUser();
  console.log("Current User: ", cognitoUser);
  if (cognitoUser) {
    cognitoUser.getSession(function sessionCallback(err, session) {
      if (err) {
        console.error("Error occurred while retrieving user session: ", err);
        // window.location.href = redirectURL
      } else if (!session.isValid()) {
        window.location.href = redirectURL;
        resolve(null);
      } else {
        resolve(session.getIdToken().getJwtToken());
      }
    });
  } else {
    window.location.href = redirectURL;
    resolve(null);
  }
});
*/