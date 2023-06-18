const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    name: {
      type: String,
      required: [true, "full name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
    },
    image: {
      type: String,
      default:
        "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
    },
    phoneNo: {
      type: String,
      required: [true, "phone no is required"],
    },
    website: {
      type: String,
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    specialization: {
      type: String,
      required: [true, "specialization is require"],
    },
    experience: {
      type: String,
      required: [true, "experience is required"],
    },
    qualification: {
      type: String,
      required: [true, "qualification is required"],
    },
    feePerConsultation: {
      type: Number,
      required: [true, "fee is required"],
    },
    application: {
      type: String,
      default: "pending",
    },
    timings: {
      type: Object,
      required: [true, "work timing is required"],
    },
    description: {
      type: String,
      required: [true, "description about the department is required"],
    },
  },
  { timestamps: true }
);

const doctorModel = mongoose.model("doctors", doctorSchema);
module.exports = doctorModel;
