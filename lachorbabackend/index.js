import express from "express";
import bcrypt from "bcryptjs"; // Pour hacher les mots de passe
import jwt from "jsonwebtoken"; // Pour créer des tokens
import { PrismaClient } from "@prisma/client";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./src/routes/userRoutes.js";
import sendMailRoutes from "./src/routes/sendMailRoutes.js";

const prisma = new PrismaClient();
const app = express();
const port = 5000;
const jwtSecret = process.env.JWT_SECRET; // Remplacez par une variable d'environnement sécurisée en production

dotenv.config();

app.use(cors());

// Middleware pour parser les données JSON
app.use(express.json());

app.use("/users", userRoutes);
app.use("/send-email", sendMailRoutes);

// Route signup
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur dans la base de données
    const newUser = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    // Réponse au client
    res.status(201).json({
      message: "User created successfully",
      user: {
        id: newUser.id,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route signin
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  // Vérification des champs requis
  if (!email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    // Vérifier si l'utilisateur existe
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User doesn't exist" });
    }

    // Vérifier le mot de passe
    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Générer un token JWT
    const token = jwt.sign(
      {
        id: existingUser.id,
        email: existingUser.email,
      },
      jwtSecret,
      { expiresIn: "1h" } // Le token expire dans 1 heure
    );

    // Réponse au client avec le token
    res.status(200).json({
      message: "User signed in successfully",
      token,
      existingUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Lancer le serveur
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
