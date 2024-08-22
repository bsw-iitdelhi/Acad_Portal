import nodemailer from "nodemailer";
// import dotenv from "dotenv";
// dotenv.config();
const verifEmail = async (email, link) => {
  try {
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "acadportalverifemail@gmail.com",
        pass: "yhlr qrxi cebr yspo",
      },
    });
    // sending email from the gmail account
    let info = transporter.sendMail({
        from: "acadportalverifemail@gmail.com", //sender mail...,
        to: "oraonsudarshan@gmail.com", // reciever mail
        subject: "Account Verification",
        text: "Welcome to The Acad Portal of BSW",
        html:`<div>
        <a href = ${link}>Click here to activate your account</a>
        <p>Thank you for registering with us. Please click on the link above to activate your account</p>
        </div>`
      });
      console.log("Message sent sucessfully...");
  } catch (err) {
    console.log(err);
  }
};
export default verifEmail;
