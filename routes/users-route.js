import express from "express";
import { createUser, authUser } from "../controllers/users-control.js";

const router = express.Router();

router.route("/register")
  .post(createUser);

router.route("/me")
  .get(authUser)


export default router;