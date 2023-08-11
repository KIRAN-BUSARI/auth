const userModel = require("../model/userSchema"); // Importing the Schema.
const emailValidator = require("email-validator"); // Importing the dependencies the Email-Validator
const bcrypt = require("bcrypt"); // Importing the dependencies the bcrypt
const cookieParser = require("cookie-parser"); //  Importing the Cookie-parser dependencies

const signup = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body; // setting the name, email, password, confirmPassword are sent to req.body
  // console.log(name, email, password, confirmPassword);

  try {
    // Trying all possible cases and printing the error message if any
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Every Field id Required ❌",
      });
    }
    // if (name == isdigit) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Username must be only Character ❌"
    //   });
    // }
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Password and confirmPassword doesn't match ❌",
      });
    }

    var Validemail = emailValidator.validate(email);
    if (!Validemail) {
      return res.status(400).json({
        success: false,
        message: "Email is not Valid.!❌",
      });
    }

    const userInfo = userModel(req.body);
    const result = await userInfo.save();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    // If there are NO Errors then the ducces true will be set and sutaiable message will be sent
    if (e.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Account already exists",
      });
    }
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const signin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      sucess: false,
      message: "Please enter all fields ❌",
    });
  }
  try {
    // Here we are trying to get the email and the password from the database and we check for matching the both the email ,password and thw confirmPassword
    const user = await userModel
      .findOne({
        email,
      })
      .select("+password");

    if (!user || !(await bcrypt.compare(password, user.password))) {
      // comparing the password which we hav typed and the password which is encrypted using bcrypt and stored in database if not found error will be printed,
      return res.status(400).json({
        successs: false,
        message: "User not found ❌",
      });
    }

    const token = user.jwtToken(); // Token variable is created using the jwtToken
    user.password = undefined; //  The password is set to undefined bcoz

    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
    };

    res.cookie("token", token, cookieOptions);
    res.status(200).json({
      success: true,
      data: user,
    });
    console.log("LoggedIn Successfully...!🥳");
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const getuser = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await userModel.findById(userId);
    return res.status(200).json({
      sucess: true,
      data: user,
    });
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

const logout = (req, res) => {
  try {
    const cookieOptions = {
      expires: new Date(),
      httpOnly: true,
    };
    res.cookie("token", null, cookieOptions);
    res.status(200).json({
      success: true,
      message: "Logged out successfully 🙁",
    });
    console.log("Logged Out succesfully ☹️");
  } catch (e) {
    return res.status(400).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports = {
  signup,
  signin,
  getuser,
  logout,
};
