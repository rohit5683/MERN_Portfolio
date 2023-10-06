const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const fs = require("fs");
const path = require("path");

//dotenv configuartion
dotenv.config();

//port
const PORT = process.env.PORT || 8080;

//rest object
const app = express();

//midlewares
app.use(cors());
app.use(express.json());

//static files
app.use(express.static(path.join(__dirname, "./frontend/build")));

//send mail
function sendMail(name, email, sub, msg) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAILID,
      pass: process.env.PASSWORD,
    },
  });

  const subject = sub;
  const to = email;
  const from = process.env.EMAILID;
  const temp = handlebars.compile(
    fs.readFileSync(path.join(__dirname, "templates/template.hbs"), "utf8")
  );
  const html = temp({ name: name, msg: msg });

  const mailOptions = {
    from,
    to,
    subject,
    html,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      console.log(error);
    } else {
      res.status(200).send({
        success: true,
        message: "Mail Sent Successfully",
      });
    }
  });
}

//routes
app.post("/", (req, res) => {
  const { name, email, sub, msg } = req.body;
  sendMail(name, email, sub, msg);
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./frontend/build/index.html"));
});

//listen
app.listen(PORT, () => {
  console.log(`Server Runnning On PORT http://localhost:${PORT} `);
});
