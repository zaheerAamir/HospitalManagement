import mongoose from "mongoose";

/**
  * @typedef {Object} UserDTO
  * @property {String} name
  * @property {String} email
  * @property {String} password
**/

/**
  * @typedef {Object} User
  * @property {String} userId
  * @property {String} name
  * @property {String} email
  * @property {String} password
  * @property {String} role
  * @property {number} wallet
**/

/**
  * @type {mongoose.Schema<User>}
  * **/
const userSchema = new mongoose.Schema({

  userId: {
    type: String,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    unique: true
  },
  wallet: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "User"
  }

})

/**
  * @type {mongoose.Model<User>}
  * **/
export const userModel = new mongoose.model("Users", userSchema, "Users");

/**
  * @typedef {Object} DoctorDTO
  * @property {String} name
  * @property {String} email
  * @property {String} password
**/

/**
  * @typedef {Object} Doctor 
  * @property {String} doctorId
  * @property {String} name
  * @property {String} email
  * @property {String} password
  * @property {String} role
  * @property {Array<String>} patientsTreated
**/

/**
  * @type {mongoose.Schema<Doctor>}
  * **/
const doctorSchema = new mongoose.Schema({

  doctorId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  patientsTreated: {
    type: Array
  },
  role: {
    type: String,
    required: true,
    default: "Doctor"
  }

})

/**
  * @type {mongoose.Model<Doctor>}
  * **/
export const doctorModel = new mongoose.model("Doctor", doctorSchema, "Doctors");

/**
  * @typedef {Object} AppointmentsDTO
  * @property {String} appointmentTime
  * @property {String} doctorId
**/

/**
  * @typedef {Object} Appointments
  * @property {String} appointmentID
  * @property {String} doctorId
  * @property {Date} appointmentTime
  * @property {boolean} available
  * @property {boolean} missed
  * @property {number} gracePeriodInMins
  * @property {Date} bookedAt
  * @property {String} bookedBy userId
  * @property {number} cost
  * @property {number} discount
**/

/**
  * @type {mongoose.Schema<Appointments>}
  * **/
const appointmentSchema = new mongoose.Schema({
  appointmentID: {
    type: String,
    unique: true,
    required: true
  },
  doctorId: {
    type: String,
    required: true,
  },
  appointmentTime: {
    type: Date,
    required: true,
  },
  available: {
    type: Boolean,
    required: true,
    default: true
  },
  missed: {
    type: Boolean,
    default: null
  },
  gracePeriodInMins: {
    type: Number,
    required: true,
    default: 15
  },
  bookedAt: {
    type: Date,
    default: "",
  },
  bookedBy: {
    type: String,
    default: "",
  },
  cost: {
    type: Number,
    required: true
  },
  discount: {
    type: Number,
    required: true
  }
});

/**
  * @type {mongoose.Model<Appointments>}
  * **/
export const appointmentModel = new mongoose.model("Appointments", appointmentSchema, "Appointments")

/**
  * @typedef {Object} Resp
  * @property {number} statusCode
  * @property {String} message
  * @property {any} error
**/


