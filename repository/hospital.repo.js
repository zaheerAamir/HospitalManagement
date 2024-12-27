import { sendEmail } from "../cron/cron.js";
import { appointmentModel, doctorModel, userModel } from "../schema/hospital.schema.js";

/**
  * @param {import("../schema/hospital.schema").User} user 
**/
export async function userSignUpRepo(user) {

  try {

    const newUser = new userModel(user);
    newUser.save();

  } catch (err) {
    throw new Error(err);
  }

}

/**
  * @param {import("../schema/hospital.schema.js").Doctor} doctor 
**/
export async function doctorSignUpRepo(doctor) {

  try {

    const newUser = new doctorModel(doctor);
    newUser.save();

  } catch (err) {
    throw new Error(err);
  }

}

/**
  * @param {import("../schema/hospital.schema.js").Appointments} body 
  * **/
export async function createAppointmentRepo(body) {

  try {

    const newAppointment = new appointmentModel(body);
    newAppointment.save();

  } catch (err) {
    throw new Error(err);
  }

}

/**
  * @param {String} appointmentID 
  * @param {String} bookedBy 
  * @param {Date} bookedAt 
  * **/
export async function bookAppointmentRepo(appointmentID, bookedBy, bookedAt) {

  try {

    /**
      * @type {import("../schema/hospital.schema.js").User}
      * **/
    const user = await userModel.findOne({ userId: bookedBy })
    if (!user || user === null || user === undefined) {
      throw new Error("user does not exist!");
    }

    /**
      * @type {import("../schema/hospital.schema.js").Appointments}
      * **/
    const appointment = await appointmentModel.findOne({ appointmentID: appointmentID });
    if (!appointment || appointment === null || appointment === undefined) {
      throw new Error("Appointment does not Exist!");
    } else if (appointment.bookedBy !== "") {
      throw new Error("Appointment already booked!")
    } else {

      const update = await appointmentModel.updateOne(
        { appointmentID: appointmentID },
        {
          $set:
          {
            available: false,
            bookedBy: bookedBy,
            bookedAt: bookedAt
          }
        }
      )

      /**
        * @type {import("../schema/hospital.schema.js").Doctor}
        * **/
      const doctor = await doctorModel.findOne({ doctorId: appointment.doctorId })

      const appointmentTIme = appointment.appointmentTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      if (update && update.acknowledged) {
        const mailOptions = {
          from: 'aamirzaheer95@gmail.com',        // Sender email
          to: doctor.email,   // Receiver email
          subject: "Appointment booked!",
          text: `Appointment Scheduled on Date ${appointmentTIme} with user ${user.name}.`,
        };
        sendEmail(mailOptions);
        return `Appointment booked successfully with doctor ${doctor.name}. Appointment time is ${appointmentTIme}. Make sure to Reach within ${appointment.gracePeriodInMins}. If not you will be marked not present in our system!`
      }
    }


  } catch (err) {
    throw new Error(err);
  }

}

export async function getAvailableDoctorsRepo() {

  try {

    /**
      * @type {import("../schema/hospital.schema.js").Doctor[]}
    **/
    const doctors = await doctorModel.find();

    const doctorInfos = [];
    if (doctors.length !== 0) {
      doctors.map(doctor => {

        const doctorInfo = {
          name: doctor.name,
          email: doctor.email,
        }

        doctorInfos.push(doctorInfo);
      })
    }
    console.log(doctorInfos)
    return doctorInfos;

  } catch (err) {
    throw new Error(err);
  }
}

/**
  * @param {string} doctorID 
  * **/
export async function getAvailableAppointmentsRepo(doctorID) {

  try {

    /**
      * @type {import("../schema/hospital.schema.js").Appointments[]}
      * **/
    const appointments = await appointmentModel.find({ doctorId: doctorID });
    const appointmentInfos = [];

    if (appointments.length !== 0) {

      for (const appointment of appointments) {
        /**
          * @type {import("../schema/hospital.schema.js").Doctor}
        **/
        const doctor = await doctorModel.findOne({ doctorId: doctorID });
        const res = {
          doctorName: doctor.name,
          appointmentTime: appointment.appointmentTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          available: appointment.available,
          gracePeriod: appointment.gracePeriodInMins
        }

        appointmentInfos.push(res);
      }

    }

    return appointmentInfos;

  } catch (err) {
    throw new Error(err);
  }
}
