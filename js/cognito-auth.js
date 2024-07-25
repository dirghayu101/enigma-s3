var Enigma = window.Enigma || {};

(function scopeWrapper($) {
  var failRedirect = "signin.html";
  var successRedirect = "search.html"

  var poolData = {
    UserPoolId: _config.cognito.userPoolId,
    ClientId: _config.cognito.userPoolClientId,
  };

  var userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

  if (typeof AWSCognito !== "undefined") {
    AWSCognito.config.region = _config.cognito.region;
  }

  // Enigma.signOut();

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
            } else{
              window.location.href = successRedirect
            }
          }
        });
      } else {
        resolve(null);
      }
    });
  })();

  function register(email, password, onSuccess, onFailure) {
    var dataEmail = {
      Name: "email",
      Value: email,
    };
    var attributeEmail = new AmazonCognitoIdentity.CognitoUserAttribute(
      dataEmail
    );

    userPool.signUp(
      email,
      password,
      [attributeEmail],
      null,
      function signUpCallback(err, result) {
        if (!err) {
          onSuccess(result);
        } else {
          onFailure(err);
        }
      }
    );
  }

  function signin(email, password, onSuccess, onFailure) {
    var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(
      {
        Username: email,
        Password: password,
      }
    );

    var cognitoUser = createCognitoUser(email);
    cognitoUser.authenticateUser(authenticationDetails, {
      onSuccess: function signinSuccess(result) {
        var userObject = { email, ...result };
        var userString = JSON.stringify(userObject);
        localStorage.setItem("enigmaUser", userString);
        onSuccess();
      },
      onFailure: onFailure,
    });
  }

  function verify(email, code, onSuccess, onFailure) {
    createCognitoUser(email).confirmRegistration(
      code,
      true,
      function confirmCallback(err, result) {
        if (!err) {
          onSuccess(result);
        } else {
          onFailure(err);
        }
      }
    );
  }

  function createCognitoUser(email) {
    return new AmazonCognitoIdentity.CognitoUser({
      Username: email,
      Pool: userPool,
    });
  }

  $(function onDocReady() {
    $("#signinForm").submit(handleSignin);
    $("#registrationForm").submit(handleRegister);
    $("#verifyForm").submit(handleVerify);
  });

  function handleSignin(event) {
    var email = $("#emailInputSignin").val();
    var password = $("#passwordInputSignin").val();
    event.preventDefault();
    signin(
      email,
      password,
      function signinSuccess() {
        console.log("Successfully Logged In");
        window.location.href = successRedirect;
      },
      function signinError(err) {
        alert(err);
      }
    );
  }

  function handleRegister(event) {
    var email = $("#emailInputRegister").val();
    var password = $("#passwordInputRegister").val();
    var password2 = $("#password2InputRegister").val();

    var onSuccess = function registerSuccess(result) {
      var cognitoUser = result.user;
      console.log("user name is " + cognitoUser.getUsername());
      var confirmation =
        "Registration successful. Please check your email inbox or spam folder for your verification code.";
      if (confirmation) {
        window.location.href = "verify.html";
      }
    };
    var onFailure = function registerFailure(err) {
      alert(err);
    };
    event.preventDefault();

    if (password === password2) {
      register(email, password, onSuccess, onFailure);
    } else {
      alert("Passwords do not match");
    }
  }

  function handleVerify(event) {
    var email = $("#emailInputVerify").val();
    var code = $("#codeInputVerify").val();
    event.preventDefault();
    verify(
      email,
      code,
      function verifySuccess(result) {
        console.log("call result: " + result);
        console.log("Successfully verified");
        alert(
          "Verification successful. You will now be redirected to the login page."
        );
        window.location.href = failRedirect;
      },
      function verifyError(err) {
        alert(err);
      }
    );
  }
})(jQuery);
