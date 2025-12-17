// require("dotenv").config();
// const sgMail = require("@sendgrid/mail");
// if (!process.env.SENDGRID_API_KEY) {
//     throw new Error("SENDGRID_API_KEY is missing");
// }
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// module.exports = sgMail;

const nodeMailer = require("nodemailer");

const transporter = nodeMailer.createTransport({
    host: "smtp.gmail.com", //  SMTP host (e.g., "smtp.gmail.com" for Gmail)
    port: 587, //  SMTP port (e.g., 587 for Gmail)
    secure: false,
    auth: {
        user: process.env.MAIL,
        pass: process.env.PASS,
    },
});

module.exports = transporter;
