import nodemailer from "nodemailer";

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: "gmail", // Ou utilisez un autre service (Outlook, etc.)
  auth: {
    user: "takwabenabdessalem@gmail.com", // Remplacez par votre email
    pass: "Gmail**0", // Remplacez par votre mot de passe
  },
});

const sendEmail = async (req, res) => {
  const { startDate, endDate, email } = req.body;

  const attachmentContent = `Votre historique de participations du ${startDate} au ${endDate}.`;
  const mailOptions = {
    from: "takwabenabdessalem@gmail.com",
    to: email,
    subject: "Votre attestation",
    text: "Veuillez trouver votre attestation en pièce jointe.",
    attachments: [
      {
        filename: "attestation.txt",
        content: attachmentContent,
      },
    ],
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Email envoyé avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email :", error);
    res.status(500).send("Échec de l'envoi de l'email.");
  }
};

export { sendEmail };
