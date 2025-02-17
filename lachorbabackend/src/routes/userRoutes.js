import express from "express";

import {
  getAllUsersController,
  getUserByEmailController,
  putUserController,
} from "../controllers/userController.js";

const router = express.Router();

// Route pour récupérer tous les utilisateurs
router.get("/", getAllUsersController);

// Route pour récupérer un utilisateur par email
router.get("/:email", getUserByEmailController);

router.put("/:email", putUserController);

export default router;
