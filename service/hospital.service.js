import { bookAppointmentRepo, createAppointmentRepo, doctorSignUpRepo, userSignUpRepo } from "../repository/hospital.repo.js";

export function generateUserId() {
  const timestamp = Date.now().toString(36);
  const randompart = Math.random().toString(36).substring(2, 10);

  return `${timestamp}${randompart}`
}

/**
  * @param {import("../schema/hospital.schema").UserDTO} body 
**/
export async function userSignUpService(body) {

  try {
    /**
      * @type {import("../schema/hospital.schema").User}
    **/
    const user = {
      userId: generateUserId(),
      name: body.name,
      email: body.email,
      password: body.password,
    }

    console.log(user);

    userSignUpRepo(user);

  } catch (err) {
    throw new Error(err);
  }

}

/**
  * @param {import("../schema/hospital.schema").DoctorDTO} body 
**/
export async function doctorSignUpService(body) {

  try {
    /**
      * @type {import("../schema/hospital.schema").Doctor}
    **/
    const doctor = {
      doctorId: generateUserId(),
      name: body.name,
      email: body.email,
      password: body.password,
    }

    console.log(doctor);

    doctorSignUpRepo(doctor);

  } catch (err) {
    throw new Error(err);
  }

}

/**
  * @param {import("../schema/hospital.schema").Appointments} body 
**/
export async function createAppointmentService(body) {

  try {

    body.appointmentID = generateUserId();
    createAppointmentRepo(body);


  } catch (err) {
    throw new Error(err);
  }

}

/**
  * @param {String} appointmentID 
  * @param {String} bookedBy 
**/
export async function bookAppointmentService(appointmentID, bookedBy) {

  try {
    const bookedAt = new Date(); // it is UTC so convert it then return it 

    const res = await bookAppointmentRepo(appointmentID, bookedBy, bookedAt);
    if (res !== undefined) {
      return res;
    }
  } catch (err) {
    throw new Error(err);
  }


}
