import {
  getAllUsers,
  getUserByEmail,
  updateUser,
} from "../services/userService.js";

const getAllUsersController = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des utilisateurs" });
  }
};

const getUserByEmailController = async (req, res) => {
  try {
    const { email } = req.params; // Assurez-vous que l'email provient des paramètres

    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération de l'utilisateur" });
  }
};

const putUserController = async (req, res) => {
  try {
    const email = req.params.email;
    const {
      firstName,
      lastName,
      birthDate,
      address,
      postalCode,
      city,
      phoneNumber,
      company,
    } = req.body;
    const parsedBirthDate = birthDate ? new Date(birthDate) : null;

    const updatedUser = await updateUser(email, {
      firstName,
      lastName,
      birthDate: parsedBirthDate,
      address,
      postalCode,
      city,
      phoneNumber,
      company,
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error.message);
    res.status(500).json({ error: "Failed to update user" });
  }
};

export { getAllUsersController, getUserByEmailController, putUserController };
