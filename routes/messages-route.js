import express from "express";
import { encryptMessage, decryptMessage} from "../controllers/messages-control.js";

const router = express.Router();

router.route("/encrypt")
  .post(encryptMessage);
router.route("/decrypt")
  .post(decryptMessage);

export default router;