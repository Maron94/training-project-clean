import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

admin.initializeApp();

const app = express();
app.use(cors({ origin: true })); 
app.use(express.json()); //  Obsługa JSON w body


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "daniel.marona@gmail.com",
    pass: "jyvj gzfl czid pfbk",
  },
});

// Endpoint
app.post("/sendEditLink", async (req, res) => {
  try {
    const { email, token } = req.body;

    if (!email) {
      return res.status(400).send("Brak adresu email");
    }

    const mailOptions = {
      from: '"Training Project" <daniel.marona@gmail.com>',
      to: email,
      subject: "Link do edycji rezerwacji",
      text: `Kliknij, aby edytować swoją rezerwację: http://localhost:4200/edit/${token}`,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Email wysłany");
  } catch (error) {
    console.error("Błąd wysyłki maila:", error);
    res.status(500).send("Błąd serwera");
  }
});

// Eksport funkcji
export const sendEditLink = functions.https.onRequest(app);
