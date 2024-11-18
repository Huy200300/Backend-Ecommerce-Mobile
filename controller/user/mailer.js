const nodemailer = require("nodemailer");
const Mailgen = require("mailgen");
const dotenv = require("dotenv");

dotenv.config();

const option = {
  service: "gmail",
  auth: {
    user: process.env.MAIL_ACCOUNT,
    pass: process.env.MAIL_PASSWORD,
  },
};
let MailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Mailgen",
    link: "https://mailgen.js/",
  },
});
var transporter = nodemailer.createTransport(option);
async function registerMail(req, res) {
  const { username, userEmail, text, subject } = req.body;
  const email = {
    body: {
      name: username,
      intro:
        text ||
        "Welcome to Daily Tuition! We're very excited to have you on board.",
      outro:
        "Need help, or have questions? Just reply to this email, we'd love to help.",
    },
  };
  const emailBody = MailGenerator.generate(email);

  transporter.verify(function (error, success) {
    if (error) {
      res.status(500).send({ error });
    } else {
      var mail = {
        from: process.env.MAIL_ACCOUNT,
        to: userEmail,
        subject: subject,
        html: emailBody,
      };
      transporter
        .sendMail(mail)
        .then(() => {
          return res
            .status(200)
            .send({ msg: "You should receive an email from us." });
        })
        .catch((error) => res.status(500).send({ error }));
    }
  });
}

module.exports = registerMail;
