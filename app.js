//draft for the entire process of sending emails

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");

const details = require("./details.json");

const app = express();
app.use(cors({ origin: "*" }));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("The server started on port 3000 !!!!!!");
});

app.get("/", (req, res) => {
  res.send(
    "<h1 style='text-align: center'>Message has been sent! <br><br>😃👻😃👻😃👻😃👻😃</h1>"
  );
});

app.post("/sendmail", (req, res) => {
  console.log("request came");
  let user = req.body;
  sendMail(user, info => {
    console.log(`The mail to has been send 😃 and the id is ${info.messageId}`);
    res.send(info);
  });
});

async function sendMail(user, callback) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    pool: true,
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: details.email,
      pass: details.password
    }
  });

  // verify connection configuration
  transporter.verify(function (error, success) {
    if (error) {
      console.log(error);
      return;
    } else {
      console.log("Server is ready to take our messages");
    }
  });
  let mailOptions = {
    from: '"A client from 🎻OpenBookPlatform.com"', // sender address
    to: 'omegasquadleesin@gmail.com', // list of receivers to change for OfficialOpenBook@mail.com account 
    subject: "👉" + "OpenBookPlatform.com : nouveau message de " + user.name + "👈", // Subject line
    html: `<h1>L'utilisateur ${user.name}, vous a écris!</h1><br>
    <p>${user.message}</p>
    <p>Vous pouvez me rejoindre au ${user.email}.</p>
    <p>${user.phone}</p>
    <h4>Bonne journée 😊</h4>`
  };

  // send mail with defined transport object
  let info = await transporter.sendMail(mailOptions);

  callback(info);
}