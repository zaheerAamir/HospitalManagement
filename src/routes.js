import express from "express";
import { bookAppointmentController, createAppointmentController, doctorSignUpController, healthCheckController, userSignUpController } from "../contoller/hospital.controller.js";

/**
  * @param {express.Express} app 
  * **/
function routes(app) {

  app.get("/healthCheck", healthCheckController);
  app.post("/userSignUp", userSignUpController);
  app.post("/doctorSignUp", doctorSignUpController);
  app.post("/createAppointment", createAppointmentController);
  app.patch("/bookAppointment/:appointmentID", bookAppointmentController);

}

export default routes;
