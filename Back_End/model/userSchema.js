const mongoose = require("mongoose");
const { Schema } = mongoose;
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "User name is required"],
      minLength: [5, "Name must be atleast 5 characters"],
      maxLength: [50, "Name must be less than 50 characters"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "User email is required"],
      lowercase: true,
      unique: [true, "Email already exists"],
    },
    password: {
      type: String,
      select: false,
    },
    forgotPasswordToken: {
      type: String,
    },
    forgotPasswordExpiryDate: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Hashing the password before saving it to database and compare with hashed value on login attempt
userSchema.pre("save", async function (next) {
  const saltRounds = 10;
  // hashing the plain text password
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, saltRounds);
  return next();
});

userSchema.methods = {
  jwtToken() {
    return JWT.sign({ id: this._id, email: this.email }, process.env.SECRET, {
      expiresIn: "24h",
    });
  },
};

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;
