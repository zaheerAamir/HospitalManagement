import { CronJob } from "cron";
import { appointmentModel, userModel } from "../schema/hospital.schema.js";
import nodemailer from "nodemailer";
import "dotenv/config.js";

const job = new CronJob(
  "40 11 * * *",
  async () => {
    console.log("Fetching alll the appointments...");

    try {
      /**
        * @type {import("../schema/hospital.schema").Appointments[]}
        * **/
      const appointments = await appointmentModel.find()
      appointments.map(async appointment => {
        const appointmentTime = appointment.appointmentTime.toLocaleString('en-IN', { timeZone: "Asia/Kolkata", hour12: false })
        const appointmentDay = appointmentTime.split(",")[0].split("/")[0];
        const appointmentMonth = appointmentTime.split(",")[0].split("/")[1];
        const month = new Date().getMonth() + 1;
        const day = new Date().getDate();
        const timeHrs = parseInt(appointmentTime.split(",")[1].split(":")[0]);
        const timeMins = parseInt(appointmentTime.split(",")[1].split(":")[1]);

        if (parseInt(appointmentMonth) === month && parseInt(appointmentDay) === day) {

          if (timeMins + appointment.gracePeriodInMins > 60) {
            const graceMins = appointment.gracePeriodInMins + timeMins - 60;
            const job2 = new CronJob(
              `${graceMins} ${timeHrs + 1} * * *`,
              async () => {
                if (appointment.missed === null) {
                  const update = await appointmentModel.updateOne(
                    { appointmentID: appointment.appointmentID },
                    {
                      $set: { missed: true }
                    }
                  )

                  if (update && update.acknowledged) {
                    /**
                      * @type {import("../schema/hospital.schema.js").User}
                    **/
                    const user = await userModel.findOne({ userId: appointment.bookedBy })
                    const mailOptions = {
                      from: 'aamirzaheer95@gmail.com',        // Sender email
                      to: user.email,   // Receiver email
                      subject: "Appointment cancelled!",
                      text: `Appointment Scheduled on Date ${appointmentTime} has been cancelled as no-show for ${appointment.gracePeriodInMins} mins. You can Reschdule for the next appointments.`,
                    };
                    sendEmail(mailOptions);
                  } else {
                    console.error("Something Went Wrong!")
                  }
                } else {
                  console.log("User Reached within Grace Period!")
                }

              }

            )
            job2.start();

          } else {
            const job2 = new CronJob(
              `${timeMins + 15} ${timeHrs} * * *`,
              async () => {
                if (appointment.missed === null) {
                  const update = await appointmentModel.updateOne(
                    { appointmentID: appointment.appointmentID },
                    {
                      $set: { missed: true }
                    }
                  )

                  if (update && update.acknowledged) {
                    /**
                      * @type {import("../schema/hospital.schema.js").User}
                    **/
                    const user = await userModel.findOne({ userId: appointment.bookedBy })
                    const mailOptions = {
                      from: 'aamirzaheer95@gmail.com',        // Sender email
                      to: user.email,   // Receiver email
                      subject: "Appointment cancelled!",
                      text: `Appointment Scheduled on Date ${appointmentTime} has been cancelled as no-show for ${appointment.gracePeriodInMins} mins. You can Reschdule for the next appointments.`,
                    };
                    sendEmail(mailOptions);
                  } else {
                    console.error("Something went wrong!")
                  }
                } else {
                  console.log("User Reached within Grace Period!")
                }

              }
            )
            job2.start();


          }

        }

      })

    } catch (err) {
      console.error(`Error Fetching appointments: ${err}`);
    }

  },

);

/**
  * @param {Object} mailOptions 
**/
export async function sendEmail(mailOptions) {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "aamirzaheer95@gmail.com",
      pass: process.env.PASS,
    }
  })

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(`Error: ${error}`);
    } else {
      console.log(`Email Sent: ${info.response}`)
    }
  })

}
export default job;
