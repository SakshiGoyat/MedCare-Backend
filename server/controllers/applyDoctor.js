const Doctor = require("../models/doctorModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");

module.exports = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      email,
      specialization,
      address,
      phoneNo,
      qualification,
      feePerConsultation,
      experience,
      description,
      website,
      timings,
    } = req.body;

    const image = req.body.imageUrl;
    const doctor = await Doctor.create({
      name,
      email,
      specialization,
      address,
      phoneNo,
      qualification,
      feePerConsultation,
      experience,
      description,
      website,
      image,
      timings,
    });

    if (!doctor) {
      res.status(200).send({ message: "unsuccessful", success: false });
    }
    const adminUser = await User.findOne({ isSystemAdmin: true });

    const notification = adminUser.notification;

    notification.push({
      type: "apply-doctor-request",
      message: `${doctor.name} has applied for a doctor account.`,
      data: {
        doctorId: doctor._id,
        name: doctor.name,
        onClickPath: "/admin/doctors",
      },
    });

    await User.findByIdAndUpdate(adminUser._id, { notification });
    res.send({
      message: {
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        address: doctor.address,
        phoneNo: doctor.phoneNo,
        qualification: doctor.qualification,
        feePerConsultation: doctor.feePerConsultation,
        experience: doctor.experience,
        description: doctor.description,
        website: doctor.website,
        image: doctor.image,
        timings: doctor.timings,
      },
      success: true,
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "unsuccessful application", success: false });
  }
});
