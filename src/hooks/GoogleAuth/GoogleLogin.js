import { firebase } from "firebase/app";

const dbLogInHandler = async function () {
  const provider = new firebase.auth.GoogleAuthProvider();
  const response = await firebase
    .auth()
    .signInWithPopup(provider)
    .then(function (result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;

      //   const curStatusElm = document.getElementById("db-login-status");
      //   curStatusElm.innerText = `${user.displayName} has been authorized`;
      console.log(
        "%c --> %cline:15%cuser.displayName",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(1, 77, 103);padding:3px;border-radius:2px",
        user.displayName
      );
      console.log(
        "%c --> %cline:16%cuser",
        "color:#fff;background:#ee6f57;padding:3px;border-radius:2px",
        "color:#fff;background:#1f3c88;padding:3px;border-radius:2px",
        "color:#fff;background:rgb(89, 61, 67);padding:3px;border-radius:2px",
        user
      );

      return user;
    })
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log("errorCode", errorCode);

      const curStatusElm = document.getElementById("db-login-status");
      curStatusElm.innerText = `Log in error: ${errorMessage}`;

      return { errorMessage, email, credential };
    });
};

export default dbLogInHandler;
