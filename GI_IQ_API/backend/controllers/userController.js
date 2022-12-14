const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const appCookieName = "giInterviewQuestionsTool";
const path = require("path");
const async = require("async");
const { sendEmail } = require("../tools/sendEmail");
const jsonwebtoken = require("jsonwebtoken");

////////////////////////////////
/// Handlebars COnfig
////////////////////////////////
// const hbs = require("nodemailer-express-handlebars"),
//   email = process.env.MAILER_EMAIL_ID || "auth_email_address@gmail.com",
//   pass = process.env.MAILER_PASSWORD || "auth_email_pass";
// nodemailer = require("nodemailer");

// const smtpTransport = nodemailer.createTransport({
//   service: process.env.MAILER_SERVICE_PROVIDER || "Gmail",
//   auth: {
//     user: email,
//     pass: pass,
//   },
// });

// const handlebarsOptions = {
//   viewEngine: "handlebars",
//   viewPath: path.resolve("../templates/"),
//   extName: ".html",
// };

// smtpTransport.use("compile", hbs(handlebarsOptions));

////////////////////////////////
/// Register a User
////////////////////////////////
module.exports.register = asyncHandler(async (req, res) => {
  console.log(" --> line:8 req", req.body);
  const user = { ...req.body, isAdmin: false };
  const newUser = new User(user);

  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);
  console.log(" --> newUser", newUser);
  newUser.save(function (err, user) {
    if (err) {
      console.log(" --> Resgister err", err);
      return res.status(400).send({
        message: err,
      });
    } else {
      console.log(" --> SUCCESS user", user);
      user.hash_password = undefined;
      return res.json(user);
    }
  });
});

module.exports.sign_in = asyncHandler(async (req, res) => {
  console.log(" --> sign_in req.body", req.body);

  User.findOne(
    {
      email: req.body.email,
    },
    function (err, user) {
      console.log(" --> sign_in user", user);
      if (err) {
        console.log(" --> sign_in req.body", req.body);
        return res.status(401).json({
          message: "There was a problem with authentication: " + err,
        });
      }
      console.log(" --> sign_in user", user);
      if (!user || !user.comparePassword(req.body.password)) {
        return res.status(401).json({
          message: "Authentication failed. Invalid user or password.",
        });
      }
      try {
        if (user.isAdmin) {
          console.log("user.isAdmin", user.isAdmin);
          if (process.env.SECRET && process.env.SECRET != "undefined") {
            console.log(
              'process.env.SECRET && process.env.SECRET != "undefined"',
              process.env.SECRET && process.env.SECRET != "undefined"
            );
            return res.json({
              token: jwt.sign(
                { email: user.email, fullName: user.fullName, _id: user._id },
                process.env.SECRET,
                { expiresIn: "1 day" } // The httpOnly cookie express in 12 hours, so this would only apply if that cookie is tampered with.
              ),
              ...user._doc,
            });
          } else {
            console.log(
              "There is a temporary server issue. Please try your request again. Error: NS-UC-1"
            );
            return res.status(403).json({
              message:
                "There is a temporary issue accessing the required security data. Please try your request again. Error: NS-UC-1",
            });
          }
        } else {
          if (process.env.SECRET && process.env.SECRET != "undefined") {
            delete user._doc.isAdmin;
            return res.json({
              token: jwt.sign(
                { email: user.email, fullName: user.fullName, _id: user._id },
                process.env.SECRET,
                { expiresIn: "1 day" } // The httpOnly cookie expires in 12 hours, so this would only apply if that cookie is tampered with.
              ),

              ...user._doc,
            });
          } else {
            console.log(
              "There is a temporary server issue. Please try your request again. Error: NS-UC 2"
            );
            return res.status(403).json({
              message:
                "There is a temporary issue accessing the required security data. Please try your request again. Error: NS-UC-2",
            });
          }
        }
      } catch (err) {
        console.log(
          "There is a temporary server issue. Please try your request again. Error: NS | ",
          err
        );
        return res.status(500).json({
          message:
            "There is a temporary issue running part of the program on the server. Please try your request again and contact the website admin if the problem persists. Error: TC-UC | " +
            err,
        });
      }
    }
  );
});

module.exports.setCookie = asyncHandler(async (req, res) => {
  res
    .status(202)
    .cookie(appCookieName, req.body.user.token, {
      sameSite: "strict",
      // domain: process.env.DOMAIN,  // Will not work on dev work via localhost
      path: "/",
      expires: new Date(new Date().getTime() + 43200 * 1000), // 12 hours
      httpOnly: true,
      // uncomment when moving to production
      secure: true,
    })
    .send("Cookie being initialized");
});

module.exports.deleteCookie = asyncHandler(async (req, res) => {
  res.status(202).clearCookie(appCookieName).send("Cookie cleared");
});

module.exports.getCookie = asyncHandler(async (req, res) => {
  if (req.cookies[appCookieName]) {
    res.status(202).send({ cookie: req.cookies[appCookieName] });
  } else {
    res.status(404).send(false);
  }
});

module.exports.loginRequired = asyncHandler(async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized user 1!!" });
  }
});

module.exports.get_user_by_token = asyncHandler(async (req, res, next) => {
  if (req.user && req.user._id) {
    const user = await User.findById(req.user._id);
    user.hash_password = undefined;
    res.status(200).json(user);
    next();
  } else {
    res.status(401).json({ message: "Unauthorized user 2!!" });
  }
});

//getUsers function to get all users
module.exports.getUsers = asyncHandler(async (req, res) => {
  if (req.user) {
    const users = await User.find({});
    res.json(users);
  } else {
    res.status(401).json({ message: "Unauthorized user 3!!" });
  }
});

//getUserById function to retrieve user by id
module.exports.getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  //if user id match param id send user else send error
  if (user) {
    user.hash_password = undefined;
    res.json(user);
  } else {
    res.status(404).json({ message: "User not found" });
    res.status(404);
  }
});

///////////////////////////////////
// Update User History - Export
///////////////////////////////////
module.exports.updateUserHistory = asyncHandler(async (req, res) => {
  console.log("Updating User History");
  const data = req.body.dataObj;
  console.log("data", data);
  const filter = { _id: req.user._id };
  const user = await User.findOne(filter);
  console.log("user", user);
  console.log("user._id.toString()", user._id.toString());
  console.log("req.user._id", req.user._id);

  if (user._id.toString() === req.user._id) {
    User.findOneAndUpdate(filter, { questionHistory: data }, { new: false })
      .then((doc) => {
        res.status(200).json({ message: "It worked.", doc: doc });
        res.status(200);
      })
      .catch((err) => {
        console.log("err", err);
        res.status(404).json({
          message: "Error when trying to save the user history.",
          err: err,
        });
        res.status(404);
      });
  } else {
    res.status(404).json({ message: "User not found" });
    res.status(404);
  }
});

////////////////////////////////////
// Update User History - Local Use
///////////////////////////////////
const updateUserHistoryLocalFunction = async (
  dataObj,
  requestedUser,
  callback
) => {
  console.log("Updating User History");
  console.log("dataObj", dataObj);
  const filter = { _id: requestedUser._id };
  const user = await User.findOne(filter);
  console.log("user", user);

  if (user._id.toString() === requestedUser._id.toString()) {
    User.findOneAndUpdate(filter, dataObj, { new: false })
      .then((doc) => {
        console.log("It worked! ", doc);
        callback({ status: 200, data: { message: "It worked.", doc: doc } });
        return { status: 200, data: { message: "It worked.", doc: doc } };
      })
      .catch((err) => {
        console.log("err", err);
        callback({
          message: "Error when trying to save the user history.",
          err: err,
        });
        return {
          status: 404,
          data: {
            message: "Error when trying to save the user history.",
            err: err,
          },
        };
      });
  } else {
    callback({ status: 404, data: { message: "User not found" } });
    return { status: 404, data: { message: "User not found" } };
  }
};

/////////////////////
exports.index = function (req, res) {
  return res.sendFile(path.resolve("./public/home.html"));
};

exports.render_forgot_password_template = function (req, res) {
  console.log("path", path);
  console.log("res", res);
  const thePath = path.resolve("./public/forgot-password.html");
  console.log("thePath", thePath);
  return res
    .set(
      "Content-Security-Policy",
      "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    )
    .sendFile(path.resolve("./public/forgot-password.html"));
};

exports.render_reset_password_template = function (req, res) {
  console.log("RESET path", path);
  console.log("RESET res", res);
  return res
    .set(
      "Content-Security-Policy",
      "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    )
    .sendFile(path.resolve("./public/reset-password.html"));
};

exports.forgot_password = function (req, res) {
  console.log(" --> forgot_password req.body", req.body);

  User.findOne(
    {
      email: req.body.email,
    },
    function (err, user) {
      console.log(" --> Found User", user);
      if (err) {
        console.log(" --> forgot_password Find User Error", err);
        return res.status(401).json({
          message: "There was a problem with authentication: " + err,
        });
      }
      if (!user) {
        console.log(" --> forgot_password User Not Find", req.body);
        return res.status(401).json({
          message: "There was a problem with authentication: " + req.body,
        });
      }
      console.log(" --> Confirming and Sending Email");

      try {
        if (process.env.SECRET && process.env.SECRET != "undefined") {
          const JWTToken = jwt.sign(
            {
              email: user.email,
              fullName: user.fullName,
              _id: user._id,
              passwordReset: true,
            },
            process.env.SECRET,
            // TODO: SE THIS TO 10 MINUTES *********
            { expiresIn: "1000 minutes" } // The httpOnly cookie expires in 10 minutes, so this would only apply if that cookie is tampered with.
          );
          console.log("JWTToken", JWTToken);

          const mailOptions = {
            from: process.env.MAILER_EMAIL_ID,
            to: "levelthreeemail@gmail.com",
            template: "forgot-password-email",
            subject: "Sending Email using Node.js",
            text: "That was easy!",
            context: {
              url:
                "http://localhost:8000/api/users/auth/reset_password?token=" +
                JWTToken,
              name: "Mike",
            },
          };

          sendEmail(mailOptions)
            .then((emailResponse) => {
              console.log("res", emailResponse);
              return res.status(250).json({
                message: "The email was sent!",
              });
            })
            .catch((err) => {
              console.log("Send email error: ", err);
              return res.status(403).json({
                message:
                  "There is an issue trying to send the email. Please try your request again. Error: EM-UC-1",
              });
            });
        } else {
          console.log(
            "There is a temporary server issue. Please try your request again. Error: NS-UC 2"
          );
          return res.status(403).json({
            message:
              "There is a temporary issue accessing the required security data. Please try your request again. Error: NS-UC-2",
          });
        }
      } catch (err) {
        console.log(
          "There is a temporary server issue. Please try your request again. Error: NS | ",
          err
        );
        return res.status(500).json({
          message:
            "There is a temporary issue running part of the program on the server. Please try your request again and contact the website admin if the problem persists. Error: TC-UC | " +
            err,
        });
      }
    }
  );
};

/////////////////////////////////////////
/// Reset password
/////////////////////////////////////////
exports.reset_password = (req, res, next) => {
  console.log("req", req.body);
  const { newPassword, verifyPassword, token } = req.body;

  if (newPassword === verifyPassword) {
    jsonwebtoken.verify(token, process.env.SECRET, function (err, decode) {
      console.log("IN TOKEN VERIFY", token);
      if (err) {
        if (process.env.SECRET && process.env.SECRET != "undefined") {
          console.log(
            "There is a temporary server issue. Please try your request again. Error: NS-UC1",
            err
          );
          return res.status(403).json({
            message:
              "There is a temporary issue accessing the required security data. Please try your request again. Error: NS-UC2 | " +
              err,
          });
        }
        // req.user = undefined;
      }
      console.log("Trying to decode the user object", req.user);
      const tokenData = decode;
      console.log("tokenData", tokenData);
      if (tokenData.passwordReset) {
        const groomedNewPasswordData = {
          hash_password: bcrypt.hashSync(newPassword, 10),
        };
        console.log("groomedNewPasswordData", groomedNewPasswordData);
        const filter = { email: tokenData.email };
        const user = User.findOne(filter).then((user) => {
          console.log("RESET PW: User: ", user);

          const updateCallback = (updateResults) => {
            if (updateResults.status < 400) {
              console.log("updateResults", updateResults);
              res.status(200).json({
                message: updateResults.data.message,
                data: updateResults.data,
              });
              res.status(200);
              res.send("test");
            }
            if (updateResults.status >= 400) {
              console.log("err", updateResults);
              res.status(404).json({
                message: "Error when trying to save the user history.",
                err: updateResults.data.message,
              });
              res.status(404);
            }
          };
          updateUserHistoryLocalFunction(
            groomedNewPasswordData,
            user,
            updateCallback
          );
        });
      }
      next();
    });
  } else {
    console.log("Passwords do not match", newPassword, verifyPassword);
  }
  next();
};
