import express, { Router } from 'express'
const router: Router = express.Router();

import { signUp, login } from "../controllers/Auth"

router.post("/signup", signUp)
router.post("/login", login)

export default router;