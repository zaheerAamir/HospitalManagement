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
        return `Appointment booked successfully with doctor ${doctor.name}. Appointment time is ${appointmentTIme}. Make sure to Reach within ${appointment.gracePeriodInMins}. If not you will be marked not present in our system!`
      }
    }


  } catch (err) {
    throw new Error(err);
  }

}
