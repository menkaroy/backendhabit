const User = require("../models/users");

// Redirects the user to the sign-up page
module.exports.signUp = async function (req, res) {
  try {
    return res.render("user_sign_up", {
      title: "Sign Up",
    });
  } catch (error) {
    console.log("Error in usersController/signUp: ", error);
    return res.redirect("back");
  }
};

// Redirects the user to the sign-in page
module.exports.signIn = async function (req, res) {
  try {
    return res.render("user_sign_in", {
      title: "Sign In",
    });
  } catch (error) {
    console.log("Error in usersController/signIn: ", error);
    return res.redirect("back");
  }
};

// Creates a new user
module.exports.create = async function (req, res) {
  try {
    if (req.body.password != req.body.confirm_password) {
      console.log("Password mismatch!");
      req.flash("error", "Password mismatch");
      return res.redirect("back");
    }

    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      await User.create(req.body);
      req.flash("success", "Account created successfully. Please sign in.");
      return res.redirect("/users/sign-in");
    }

    console.log("User is already present");
    return res.redirect("back");
  } catch (error) {
    console.log("Error in creating the user ", error);
    return res.redirect("back");
  }
};

// Signs in an existing user
module.exports.createSession = async function (req, res) {
  req.flash("success", "You are logged in!");
  return res.redirect("/");
};

// Signs out the user
// module.exports.destroySession = async function (req, res) {
//   req.logout(); // You don't need to pass a callback here
//   req.flash("success", "You are logged out!");
//   return res.redirect("/users/sign-in");
// };
module.exports.destroySession = async function (req, res) {
  req.logout(function (err) {
    if (err) {
      console.log("Error during logout:", err);
    }
  });
  req.flash("success", "You are logged out!");
  return res.redirect("/users/sign-in");
};
// Redirects the user to the forget password page
module.exports.forgetPassword = async function (req, res) {
  try {
    return res.render("forget_password", {
      title: "Reset Password",
    });
  } catch (error) {
    console.log("Error in usersController/forgetPassword: ", error);
    return res.redirect("back");
  }
};

// Reset password
module.exports.resetPassword = async function (req, res) {
  try {
    let user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.redirect("/users/sign-up");
    }

    if (req.body.password == req.body.confirm_password) {
      user.password = req.body.password;
      await user.save(); // Use save() to update the document
      req.flash("success", "Password changed successfully");
      return res.redirect("/users/sign-in");
    }
  } catch (error) {
    console.log("Error in usersController/resetPassword: ", error);
    return res.redirect("back");
  }
};
