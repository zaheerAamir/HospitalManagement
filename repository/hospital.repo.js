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
  * @param {String} email 
  * @param {String} password 
**/
export async function loginUserRepo(email, password) {

  try {

    /**
      * @type {import("../schema/hospital.schema.js").User}
      * **/
    const user = await userModel.findOne({ email: email, password: password });
    if (!user || user === null || user === undefined) {
      throw new Error("user does not exist!");
    }

    const response = {
      name: user.name,
      userId: user.userId,
      role: user.role,
      wallet: user.wallet
    }

    return response;

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
    **/
    const appointment = await appointmentModel.findOne({ appointmentID: appointmentID });

    /**
      * @type {import("../schema/hospital.schema.js").Doctor}
      * **/
    const doctor = await doctorModel.findOne({ doctorId: appointment.doctorId })


    if (!appointment || appointment === null || appointment === undefined) {
      throw new Error("Appointment does not Exist!");
    } else if (appointment.bookedBy !== "") {
      throw new Error("Appointment already booked!")
    } else {

      if (!doctor.patientsTreated.includes(user.userId)) {
        const discount = (appointment.cost * appointment.discount) / 100;
        const appointmentCharge = appointment.cost - discount;

        const update1 = await userModel.updateOne(
          { userId: bookedBy },
          {
            $set: { wallet: user.wallet - appointmentCharge }
          }
        )

        const update2 = await doctorModel.updateOne(
          { doctorId: appointment.doctorId },
          {
            $addToSet: { patientsTreated: bookedBy }
          }
        )
      } else {
        const update1 = await userModel.updateOne(
          { userId: bookedBy },
          {
            $set: { wallet: user.wallet - appointment.cost }
          }
        )
      }


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
        * @type {import("../schema/hospital.schema.js").User}
      **/
      const user2 = await userModel.findOne({ userId: bookedBy })

      /**
        * @type {import("../schema/hospital.schema.js").Doctor}
        * **/
      const doctor2 = await doctorModel.findOne({ doctorId: appointment.doctorId })

      const appointmentTIme = appointment.appointmentTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

      if (update && update.acknowledged) {
        const mailOptions = {
          from: 'aamirzaheer95@gmail.com',        // Sender email
          to: doctor2.email,   // Receiver email
          subject: "Appointment booked!",
          text: `Appointment Scheduled on Date ${appointmentTIme} with user ${user.name}.`,
        };
        //sendEmail(mailOptions);
        return `Appointment booked successfully with doctor ${doctor2.name}. Appointment time is ${appointmentTIme}. Make sure to Reach within ${appointment.gracePeriodInMins}. If not you will be marked not present in our system! Your Current Balance: ${user2.wallet}`
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
          id: doctor.doctorId,
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
          appointmentID: appointment.appointmentID,
          appointmentTime: appointment.appointmentTime.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
          available: appointment.available,
          gracePeriod: appointment.gracePeriodInMins,
          cost: appointment.cost,
          discount: appointment.discount
        }

        appointmentInfos.push(res);
      }

    }

    return appointmentInfos;

  } catch (err) {
    throw new Error(err);
  }
}
