const nodemailer = require("nodemailer");
const notifier = require("mail-notifier");
const europassServices = require("./europass-services");
const excel = require("../spreadsheet/sheet");
require("dotenv").config();

const imap = {
  user: process.env.EMAIL_USER,
  password: process.env.EMAIL_PASSWORD,
  host: process.env.EMAIL_HOST,
  port: 993, // imap port
  tls: true, // use secure connection
  tlsOptions: { rejectUnauthorized: false }
};

function initEmailNotifier() {
  const n = notifier(imap);

  n.on("end", () => n.start())
    .on("mail", mail => {
      const senderID = mail.from[0].address + mail.receivedDate;
      const fileNames = [];
      if (mail.attachments) {
        const promises = [];
        for (attachment of mail.attachments) {
          fileNames.push(attachment.fileName);
          promises.push(europassServices.xmlExtraction(attachment.content));
        }
        Promise.all(promises)
          .then(results => {
            const files = [];
            for (europass of results) {
              files.push(europass.SkillsPassport.LearnerInfo);
            }

            const file = excel.create(fileNames, files);
            file.writeToBuffer().then(function(buffer) {
              let transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: 25,
                secure: false, // true for 465, false for other ports
                requireTLS: false
              });

              let message = {
                from:
                  '"Europass Spreadsheet Service"<europass2spreadsheet@cedefop.europa.eu>',
                to: mail.from[0].address,
                subject: "Europass to Spreadsheet Service",
                attachments: [
                  {
                    filename: "Europass2Spreadsheet.xlsx",
                    content: new Buffer.from(buffer, "utf-8"),
                    contentType:
                      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  }
                ]
              };

              transporter.sendMail(message, (error, info) => {
                if (error) {
                  return console.log(error);
                }                
              });
            });
            
          })
          .catch(e => {
            console.log(e);
          });
      }
    })
    .on("error", error => {
      console.log(error);
    })
    .start();
}

module.exports = {
  init: initEmailNotifier,
  imap: imap
};
