const fs = require("fs");
const path = require("path");
const transporter = require("../Config/Transporter");
// const sgMail = require("../Config/Transporter");
// Single Email Function

// async function sendReporterEmailTemplate(reporter, password) {


//   if (!reporter?.email) {
//     return {
//       success: false,
//       message: "Reporter email is missing",
//     };
//   }

//   try {
//     const receiverTemplatePath = path.join(
//       __dirname,
//       "../Templates/Registration.html"
//     );

//     const receiverTemplate = fs.readFileSync(receiverTemplatePath, "utf-8");

//     const replacements = {
//       "{{email}}": reporter.email,
//       "{{password}}": password,
//     };

//     let receiverContent = receiverTemplate;
//     for (const placeholder in replacements) {
//       receiverContent = receiverContent.replace(
//         new RegExp(placeholder, "g"),
//         replacements[placeholder]
//       );
//     }

//     const userMsg = {
//       to: reporter.email,
//       from: process.env.MAIL,
//       subject: "Registration Details",
//       html: receiverContent,
//     };

//     await sgMail.send(userMsg);
//     return { success: true, message: `Email sent to ${reporter.email}` };
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return {
//       success: false,
//       message: "Failed to send email",
//       error: error.message,
//     };
//   }
// }

// const sendMail = async ({ to, subject, html }) => {
//   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//   const mailOptions = {
//     from: process.env.MAIL,
//     to,
//     subject,
//     html,

//   };

//   try {
//     console.log("Sending email via SendGrid...");
//     const response = await sgMail.send(mailOptions);

//     console.log("SendGrid response received ✅");
//     if (Array.isArray(response)) {
//       console.log("[Debug] SendGrid StatusCode:", response[0]?.statusCode);
//       console.log("[Debug] SendGrid Headers:", response[0]?.headers);
//     } else {
//       console.log("[Debug] SendGrid Response:", response);
//     }

//     console.log(`Mail sent successfully to: ${to}`);
//     console.log("=== [SendMail] END ===");
//     return { success: true };
//   } catch (error) {
//     console.error("❌ SendGrid threw an error");
//     console.error("[sendMail] Error message:", error.message);

//     if (error.response) {
//       console.error(
//         "[Debug] SendGrid Response Body:",
//         JSON.stringify(error.response.body, null, 2)
//       );
//       console.error(
//         "[Debug] SendGrid Response Headers:",
//         error.response.headers
//       );
//     } else {
//       console.error("[Debug] No response body found from SendGrid.");
//     }

//     console.log("[SendMail] FAILED END");
//     return { success: false, error: error.message };
//   }
// };

// module.exports = { sendReporterEmailTemplate, sendMail };
// Single Email Function with Nodemailer
async function sendReporterEmailTemplate(reporter, password) {
    if (!reporter?.email) {
        return {
            success: false,
            message: "Reporter email is missing",
        };
    }

    try {
        const receiverTemplatePath = path.join(
            __dirname,
            "../Templates/Registration.html"
        );

        const receiverTemplate = fs.readFileSync(receiverTemplatePath, "utf-8");

        const replacements = {
            "{{email}}": reporter.email,
            "{{password}}": password,
        };

        let receiverContent = receiverTemplate;
        for (const placeholder in replacements) {
            receiverContent = receiverContent.replace(
                new RegExp(placeholder, "g"),
                replacements[placeholder]
            );
        }

        const mailOptions = {
            from: process.env.MAIL,
            to: reporter.email,
            subject: "Registration Details",
            html: receiverContent,
        };

        await transporter.sendMail(mailOptions);

        return { success: true, message: `Email sent to ${reporter.email}` };
    } catch (error) {
        console.error("Error sending email:", error);
        return {
            success: false,
            message: "Failed to send email",
            error: error.message,
        };
    }
}

// General Email Sending Function with Nodemailer
const sendMail = async ({ to, subject, html }) => {
    const mailOptions = {
        from: process.env.MAIL,
        to,
        subject,
        html,
    };

    try {
        console.log("Sending email via Nodemailer...");
        const info = await transporter.sendMail(mailOptions);

        console.log("Nodemailer response received ✅");
        console.log("[Debug] Nodemailer MessageId:", info.messageId);
        console.log(`Mail sent successfully to: ${to}`);
        console.log("=== [SendMail] END ===");
        return { success: true };
    } catch (error) {
        console.error("❌ Nodemailer threw an error");
        console.error("[sendMail] Error message:", error.message);

        console.log("[SendMail] FAILED END");
        return { success: false, error: error.message };
    }
};

module.exports = { sendReporterEmailTemplate, sendMail };
