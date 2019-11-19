const express = require("express");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
const europassServices = require("../services/europass-services");
const excel = require("../spreadsheet/sheet");

const router = express.Router();

router.get("/api", function(req, res) {
  res.send("Welcome to epas2excel Service");
});

router.post("/api/download", upload.array("files"), function(req, res) {
  if (!req.files) {
    return res.json("No files were uploaded.");
  }
  
  const promises = [];
  const fileNames = [];
  for (file of req.files) {
    fileNames.push(file.originalname);
    if (file.mimetype === "application/pdf") {
      promises.push(europassServices.xmlExtraction(file.originalname, file.buffer));
    } else {
      promises.push(europassServices.xml2EuropassJSON(file.buffer));
    }
  }

  Promise.all(promises)
    .then(results => {
      const files = [];
      for (europass of results) {
        files.push(europass.SkillsPassport.LearnerInfo);
      }

      const file = excel.create(fileNames, files);
      file.write("Epas2Spreadsheet.xlsx", res);

    })
    .catch(error => {
      res.status(404).send(error);
    });
});

module.exports = router;
