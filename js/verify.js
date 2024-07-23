Enigma = window.Enigma || {};

(function scopeWrapper($){
    // Declaration for cognito.
    const poolData = {
        UserPoolId: _config.cognito.userPoolId,
        ClientId: _config.cognito.userPoolClientId
    };
    const redirectURL = 'signin.html'
    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);  

    if (typeof AWSCognito !== 'undefined') {
        AWSCognito.config.region = _config.cognito.region;
    }

    Enigma.authToken = new Promise(function fetchCurrentAuthToken(resolve, reject) {
        var cognitoUser = userPool.getCurrentUser();
        console.log("Current User: ", cognitoUser)
        if (cognitoUser) {
            cognitoUser.getSession(function sessionCallback(err, session) {
                if (err) {
                    console.error("Error occurred while retrieving user session: ",err)
                    // window.location.href = redirectURL

                } else if (!session.isValid()) {
                    window.location.href = redirectURL
                    resolve(null);
                } else {
                    resolve(session.getIdToken().getJwtToken());
                }
            });
        } else {
            window.location.href = redirectURL
            resolve(null);
        }
    });

})