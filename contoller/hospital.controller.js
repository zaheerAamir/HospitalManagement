import express from "express";
import { bookAppointmentService, createAppointmentService, doctorSignUpService, userSignUpService } from "../service/hospital.service.js";

/**
  * @param {express.Request} req 
  * @param {express.Response} res 
**/
export async function healthCheckController(req, res) {

  return res.status(200).json({
    "message": "Server is healthy!🦾"
  })

}

/**
  * @param {express.Request} req 
  * @param {express.Response} res 
**/
export async function userSignUpController(req, res) {

  /**
    * @type {import("../schema/hospital.schema").Resp}
    * **/
  const Response = {
    statusCode: 0,
    message: "",
    error: ""
  }

  try {

    /**
      * @type {import("../schema/hospital.schema").UserDTO}
      * **/
    const body = req.body;
    if (!body) {
      Response.statusCode = 400;
      Response.message = "Please Provide User details!";
      Response.error = "User Details not provided!";

      return res.status(Response.statusCode).json(Response);
    } else if (!body.name || typeof body.name !== 'string') {
      Response.statusCode = 400;
      Response.message = "Please Provide User name!";
      Response.error = "User name not provided!";

      return res.status(Response.statusCode).json(Response);
    } else if (!body.email || typeof body.email !== 'string') {
      Response.statusCode = 400;
      Response.message = "Please Provide User's email!";
      Response.error = "User email not provided!";

      return res.status(Response.statusCode).json(Response);
    } else if (!body.password || typeof body.password !== 'string') {
      Response.statusCode = 400;
      Response.message = "Please Provide User's password!";
      Response.error = "User password not provided!";

      return res.status(Response.statusCode).json(Response);
    } else {
      Response.statusCode = 200;
      Response.message = "User Created Successfully!";
      Response.error = "";

      userSignUpService(body);
      return res.status(Response.statusCode).json(Response);
    }

  } catch (err) {
    Response.statusCode = 400;
    Response.message = "Something went Wrong!";
    Response.error = err.toString().replace(/Error: /g, '');

    return res.status(Response.statusCode).json(Response);
  }

}

/**
  * @param {express.Request} req 
  * @param {express.Response} res 
**/
export async function doctorSignUpController(req, res) {

  /**
    * @type {import("../schema/hospital.schema").Resp}
    * **/
  const Response = {
    statusCode: 0,
    message: "",
    error: ""
  }

  try {

    /**
      * @type {import("../schema/hospital.schema").DoctorDTO}
      * **/
    const body = req.body;
    if (!body) {
      Response.statusCode = 400;
      Response.message = "Please Provide Doctor details!";
      Response.error = "Doctor Details not provided!";

      return res.status(Response.statusCode).json(Response);
    } else if (!body.name || typeof body.name !== 'string') {
      Response.statusCode = 400;
      Response.message = "Please Provide Doctor name!";
      Response.error = "Doctor name not provided!";

      return res.status(Response.statusCode).json(Response);
    } else if (!body.email || typeof body.email !== 'string') {
      Response.statusCode = 400;
      Response.message = "Please Provide Doctor's email!";
      Response.error = "Doctor email not provided!";

      return res.status(Response.statusCode).json(Response);
    } else if (!body.password || typeof body.password !== 'string') {
      Response.statusCode = 400;
      Response.message = "Please Provide Doctor's password!";
      Response.error = "Doctor password not provided!";

      return res.status(Response.statusCode).json(Response);
    } else {
      Response.statusCode = 200;
      Response.message = "Doctor Created Successfully!";
      Response.error = "";

      doctorSignUpService(body);
      return res.status(Response.statusCode).json(Response);
    }

  } catch (err) {
    Response.statusCode = 400;
    Response.message = "Something went Wrong!";
    Response.error = err.toString().replace(/Error: /g, '');

    return res.status(Response.statusCode).json(Response);
  }

}

/**
  * @param {express.Request} req 
  * @param {express.Response} res 
**/
export async function createAppointmentController(req, res) {

  /**
    * @type {import("../schema/hospital.schema").Resp}
    * **/
  const Response = {
    statusCode: 0,
    message: "",
    error: ""
  }

  try {

    /**
      * @type {import("../schema/hospital.schema").Appointments}
    **/
    const body = req.body;
    if (!body || !body.appointmentTime || !body.doctorId) {
      Response.statusCode = 400;
      Response.message = "Please provide Appointment time and doctorId!";
      Response.error = "Appointment time and doctor id not provided!";

      return res.status(Response.statusCode).json(Response);
    } else {
      Response.statusCode = 200;
      Response.message = "Appointment Created Successfully!";
      Response.error = "";


      createAppointmentService(body);

      return res.status(Response.statusCode).json(Response);


    }
  } catch (err) {
    Response.statusCode = 400;
    Response.message = "Something went Wrong!";
    Response.error = err.toString().replace(/Error: /g, '');

    return res.status(Response.statusCode).json(Response);
  }
}

/**
  * @param {express.Request} req 
  * @param {express.Response} res 
**/
export async function bookAppointmentController(req, res) {

  /**
    * @type {import("../schema/hospital.schema").Resp}
    * **/
  const Response = {
    statusCode: 0,
    message: "",
    error: ""
  }

  try {

    const { appointmentID } = req.params;
    const { bookedBy } = req.body;

    if (!bookedBy || typeof bookedBy !== 'string') {
      Response.statusCode = 400;
      Response.message = "Please provide userId!";
      Response.error = "userId not provided!";

      return res.status(Response.statusCode).json(Response);
    }

    const result = await bookAppointmentService(appointmentID, bookedBy);
    if (result !== undefined) {
      Response.statusCode = 200;
      Response.message = result;
      Response.error = "";

      return res.status(Response.statusCode).json(Response);


    }

  } catch (err) {
    Response.statusCode = 400;
    Response.message = "Something went Wrong!";
    Response.error = err.toString().replace(/Error: /g, '');

    return res.status(Response.statusCode).json(Response);
  }


}
