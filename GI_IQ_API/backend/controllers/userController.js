const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const asyncHandler = require("express-async-handler");
const appCookieName = "giInterviewQuestionsTool";
const path = require("path");
const async = require("async");
const { sendEmail } = require("../tools/sendEmail");
const jsonwebtoken = require("jsonwebtoken");
const {
  usePasswordValidator,
  passwordRequirements,
} = require("../tools/usePasswordValidator");

////////////////////////////////
/// Handlebars Config
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
  const user = { ...req.body, isAdmin: false };
  const newUser = new User(user);

  newUser.hash_password = bcrypt.hashSync(req.body.password, 10);

  newUser.save(function (err, user) {
    if (err) {
      console.log(" --> Resgister err", err);
      return res.status(400).send({
        message: err,
      });
    } else {
      user.hash_password = undefined;
      return res.json(user);
    }
  });
});

////////////////////////////////
/// Sing In a User
////////////////////////////////
module.exports.sign_in = asyncHandler(async (req, res) => {
  User.findOne(
    {
      email: req.body.email,
    },
    function (err, user) {
      if (err) {
        console.log(" --> sign_in req.body", req.body);
        return res.status(401).json({
          message: "There was a problem with authentication: " + err,
        });
      }

      if (!user || !user.comparePassword(req.body.password)) {
        return res.status(401).json({
          message: "Authentication failed. Invalid user or password.",
        });
      }
      try {
        if (user.isAdmin) {
          console.log("user.isAdmin", user.isAdmin);
          if (process.env.SECRET && process.env.SECRET != "undefined") {
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

////////////////////////////////
/// Set a User's Cookie
////////////////////////////////
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

////////////////////////////////
/// Delete a User's Cookie
////////////////////////////////
module.exports.deleteCookie = asyncHandler(async (req, res) => {
  res.status(202).clearCookie(appCookieName).send("Cookie cleared");
});

////////////////////////////////
/// Get a User's Cookie
////////////////////////////////
module.exports.getCookie = asyncHandler(async (req, res) => {
  if (req.cookies[appCookieName]) {
    res.status(202).send({ cookie: req.cookies[appCookieName] });
  } else {
    res.status(404).send(false);
  }
});

////////////////////////////////
///  Login Required
////////////////////////////////
module.exports.loginRequired = asyncHandler(async (req, res, next) => {
  if (req.user) {
    next();
  } else {
    return res.status(401).json({ message: "Unauthorized user 1!!" });
  }
});

////////////////////////////////
/// Get a User By Token
////////////////////////////////
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

////////////////////////////////
/// Get All Users
////////////////////////////////
module.exports.getUsers = asyncHandler(async (req, res) => {
  if (req.user) {
    const users = await User.find({});
    res.json(users);
  } else {
    res.status(401).json({ message: "Unauthorized user 3!!" });
  }
});

////////////////////////////////
/// Get A USER BY ID
////////////////////////////////
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
  const questionHistoryData = req.body.dataObj;
  const currentFiltersData = req.body.currentFiltersObj;
  const filter = { _id: req.user._id };
  const user = await User.findOne(filter);

  if (user._id.toString() === req.user._id) {
    User.findOneAndUpdate(
      filter,
      {
        questionHistory: questionHistoryData,
        currentFilters: currentFiltersData,
      },
      { new: false }
    )
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
const updateUserHistoryLocalFunction = async (dataObj, requestedUser) => {
  let output = {};
  const filter = { _id: requestedUser._id };
  const user = await User.findOne(filter);

  if (user._id.toString() === requestedUser._id.toString()) {
    output = await User.findOneAndUpdate(filter, dataObj, { new: true });
    if (output) {
      output = { status: 200, data: { message: "Success!", doc: output } };
    } else {
      console.log("err", output);
      output = {
        status: 404,
        data: {
          message: "Error when trying to save the user history.",
          err: err,
        },
      };
    }
  } else {
    callback({ status: 404, data: { message: "User not found" } });
    output = { status: 404, data: { message: "User not found" } };
  }
  return output;
};

///////////////////////////////////
// Update Study Notes - Export
///////////////////////////////////
module.exports.updateStudyNotes = asyncHandler(async (req, res) => {
  const studyNotesData = req.body.dataObj;
  console.log("studyNotesData", studyNotesData);
  const filter = { _id: req.user._id };
  const user = await User.findOne(filter);
  console.log("user", user);
  if (user._id.toString() === req.user._id) {
    User.findOneAndUpdate(
      filter,
      {
        studyNotes: studyNotesData,
      },
      { new: false }
    )
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

////////////////////////////////
/// Send Forgotten Password HTML
////////////////////////////////
exports.render_forgot_password_template = function (req, res) {
  const thePath = path.resolve("./public/forgot-password.html");

  return res
    .set(
      "Content-Security-Policy",
      "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    )
    .set("X-Frame-Options", "")
    .sendFile(path.resolve("./public/forgot-password.html"));
};

////////////////////////////////
/// Send Reset Password HTML
////////////////////////////////
exports.render_reset_password_template = function (req, res) {
  return res
    .set(
      "Content-Security-Policy",
      "default-src *; style-src 'self' http://* 'unsafe-inline'; script-src 'self' http://* 'unsafe-inline' 'unsafe-eval'"
    )
    .sendFile(path.resolve("./public/reset-password.html"));
};

////////////////////////////////
/// Forgot Password POST Route
////////////////////////////////
exports.forgot_password = function (req, res) {
  console.log(" --> forgot_password req.body", req.body);

  User.findOne(
    {
      email: req.body.email,
    },
    function (err, user) {
      if (err) {
        console.log(" --> 1 forgot_password Find User Error", err);
        return res.status(401).json({
          message: "There was a problem with authentication: " + err,
        });
      }
      if (!user) {
        console.log(
          " --> 2 forgot_password There was a problem with authentication: User " +
            req.body.email +
            " was not found."
        );
        return res.status(401).json({
          message:
            "There was a problem with authentication: User " +
            req.body.email +
            ' was not found. Please fix the email address or, if you are not signed up yet, use the "Sign Up" button to get started.',
        });
      }

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

          const mailOptions = {
            from: process.env.MAILER_EMAIL_ID,
            to: user.email,
            template: "forgot-password-email",
            subject: "interview Questions Tool Reset Request",
            text: "That was easy!",
            context: {
              url:
                process.env.DOMAIN +
                "api/users/auth/reset_password?token=" +
                JWTToken,
              name: "Mike",
            },
          };

          sendEmail(mailOptions)
            .then((emailResponse) => {
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
/// Reset password POST Route
/////////////////////////////////////////
exports.reset_password = async (req, res, next) => {
  const { newPassword, verifyPassword, token } = req.body;
  const passwordValidator = usePasswordValidator();

  const passwordValidCheck = passwordValidator(newPassword, true);

  if (!passwordValidCheck.isValid) {
    if (process.env.NODE_ENV === "development")
      res.status(412).json({
        valid: false,
        message: `The password does not meet the requirements. It failed with these errors:\n\n${passwordValidCheck.details
          .map((error, i) => {
            const groomedMessage = error.message
              .replace("string", "password")
              .replace("digit", "number");
            return "   " + (i + 1) + ": " + groomedMessage + ". ";
          })
          .join(
            "\n"
          )}\n\nHere are all of the password requirements: ${passwordRequirements}`,
      });
  } else {
    if (newPassword === verifyPassword) {
      let tokenData = null;
      try {
        tokenData = jsonwebtoken.verify(token, process.env.SECRET);
      } catch (err) {
        if (process.env.SECRET && process.env.SECRET != "undefined") {
          console.log(
            "<><><> There is a temporary server issue. Please try your request again. Error: NS-UC1",
            err
          );
          res.status(403).json({
            message:
              "There is a temporary issue accessing the required security data. Please try your request again. Error: NS-UC2 | " +
              err,
          });
        } else {
          console.log(
            "<><><> There is an issue with the JWT. Error: JWT-UC1",
            err
          );
          res.status(401).json({
            message:
              "There is a temporary issue accessing the required security data. Please try your request again. Error: JWT-UC1 | " +
              err,
          });
        }
      }

      if (tokenData.passwordReset) {
        const groomedNewPasswordData = {
          hash_password: bcrypt.hashSync(newPassword, 10),
        };

        const filter = { email: tokenData.email };
        const user = await User.findOne(filter);
        console.log("<><><> FOUND USER ->", user);

        const updateResults = await updateUserHistoryLocalFunction(
          groomedNewPasswordData,
          user
        );

        console.log("<><><> updateResults: ", updateResults);

        if (updateResults.status < 400) {
          console.log(
            "<><><> updateResults.status < 400",
            updateResults.status < 400
          );

          if (
            groomedNewPasswordData.hash_password ===
            updateResults.data.doc.hash_password
          ) {
            res.status(200).json({
              message: updateResults.data.message,
              data: updateResults.data,
            });
          } else {
            updateResults.data.message = "error";
            res.status(403).json({
              message:
                "A problem occurred and the password was not able to be reset. Please contact teh site administrator for further assistance.",
              data: updateResults.data,
            });
          }
        }
        if (updateResults.status >= 400) {
          console.log("err", updateResults);
          res.status(404).json({
            message: "Error when trying to save the user history.",
            err: updateResults.data.message,
          });
        }
      } else {
        res.json({
          message:
            "Password reset is not allowed in this case. If you need to reset your password, please contact this site administrator.",
        });
      }
      next();
    } else {
      console.log("Passwords do not match", newPassword, verifyPassword);
      res.status(412).json({
        message:
          "The two passwords do not match. please ensure they are identical.",
      });
      next();
    }
  }

  next();
};
