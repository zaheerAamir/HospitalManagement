import express from "express";
import { bookAppointmentController, createAppointmentController, doctorSignUpController, getAvailableAppointmentsController, getAvailableDoctorsController, healthCheckController, userSignUpController } from "../contoller/hospital.controller.js";

/**
  * @param {express.Express} app 
  * **/
function routes(app) {

  app.get("/healthCheck", healthCheckController);
  app.post("/userSignUp", userSignUpController);
  app.post("/doctorSignUp", doctorSignUpController);
  app.post("/createAppointment", createAppointmentController);
  app.patch("/bookAppointment/:appointmentID", bookAppointmentController);
  app.get("/getAvailableDoctors", getAvailableDoctorsController);
  app.get("/getAvailableAppointments/:doctorID", getAvailableAppointmentsController);

}

export default routes;
