const nodemailer = require("nodemailer");
const service = process.env;
const sendEmail = (options) => {
  transporter = nodemailer.createTransport({
    service: service.EMAIL_SERVICE,
    auth: {
      user: service.EMAIL_USERNAME,
      pas: service.EMAIL_PASSWORD,
    },
  });
};

const mailOptions = {
  from: service.EMAIL_FROM,
  to: options.to,
  subject: options.subject,
  html: options.text,
};

transporter.sendEmail(mailOptions, (error, info) => {
  if (error) {
    console.log(error);
  } else {
    console.log(info);
  }
});
// module.exports
// still working on it
