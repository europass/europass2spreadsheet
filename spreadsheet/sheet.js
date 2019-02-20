const xl = require("excel4node");
const helpers = require("./excelHelper");
function createWorkbook(fileNames, files) {
  // console.log(fileNames, 'Maximun cols', fileNames.length);

  const PersonNames = [];
  const Addresses = [];
  const Emails = [];
  const Telephones = [];
  const Websites = [];
  const InstantMessagers = [];
  const Birthdates = [];
  const Genders = [];
  const Nationalities = [];
  const Headlines = [];
  const WorkExperiences = [];
  const Educations = [];
  const Skills = [];
  const Achievements = [];

  files.map(cv => {
    PersonNames.push(helpers.names(cv));
    Addresses.push(helpers.addresses(cv));
    Emails.push(helpers.emails(cv));
    Telephones.push(helpers.telephones(cv));
    Websites.push(helpers.websites(cv));
    InstantMessagers.push(helpers.messagers(cv));
    Birthdates.push(helpers.birthdate(cv));
    Genders.push(helpers.gender(cv));
    Nationalities.push(helpers.nationality(cv));
    Headlines.push(helpers.headline(cv));
    WorkExperiences.push(helpers.workExperience(cv));
    Educations.push(helpers.educations(cv));
    Skills.push(helpers.skills(cv));
    Achievements.push(helpers.achievements(cv));
  });

  var excel = new xl.Workbook();
  var options = {};
  var sheet = excel.addWorksheet("Europass 2 Spreadsheet", options);
  var titleStyles = excel.createStyle({
    font: {
      bold: true
    },
    alignment: {
      vertical: ["top"],
      wrapText: true
    }
  });

  var bigTextStyles = excel.createStyle({
    alignment: {
      wrapText: true
    }
  });
  

  sheet.column(1).setWidth(30);
  sheet.row(1).setHeight(30);

  sheet.column(1).freeze(); // Freezes the first column
  sheet.row(3).freeze(); // Freezes the top 3 rows

  sheet
    .cell(1, 1)
    .string("Europass2Spreadsheet")
    .style(titleStyles);
  sheet.cell(1, 2).string("Created:");
  sheet.cell(1, 3).date(new Date());

  sheet
    .cell(2, 1)
    .string("File")
    .style(titleStyles);
  sheet
    .cell(3, 1)
    .string("Full Name")
    .style(titleStyles);
  sheet
    .cell(4, 1)
    .string("Address")
    .style(titleStyles);

  sheet
    .cell(5, 1)
    .string("Email")
    .style(titleStyles);

  sheet
    .cell(6, 1)
    .string("Telephone")
    .style(titleStyles);

  sheet
    .cell(7, 1)
    .string("Website")
    .style(titleStyles);

  sheet
    .cell(8, 1)
    .string("Instant Messaging")
    .style(titleStyles);

  sheet
    .cell(9, 1)
    .string("Birthdate")
    .style(titleStyles);

  sheet
    .cell(10, 1)
    .string("Gender")
    .style(titleStyles);

  sheet
    .cell(11, 1)
    .string("Nationality")
    .style(titleStyles);

  sheet
    .cell(12, 1)
    .string("Headline")
    .style(titleStyles);

  for (let n = 1; n <= files.length; n++) {
    sheet.column(n + 1).setWidth(50);
  }

  const wxMax = Math.max.apply(Math, WorkExperiences.map(o => o.length));
  const startWork = 13;
  const stopWork = startWork + wxMax - 1;

  if (wxMax) {
    sheet
      .cell(startWork, 1, stopWork, 1, true)
      .string("Work" + "\n" + "Experiences")
      .style(titleStyles);

    for (let n = startWork; n <= stopWork; n++) {
      sheet.row(n).setHeight(80);
    }
  }

  const eduMax = Math.max.apply(Math, Educations.map(o => o.length));
  const startEdu = stopWork + 1;
  const stopEdu = startEdu + eduMax - 1;
  if (eduMax) {
    sheet
      .cell(startEdu, 1, stopEdu, 1, true)
      .string("Education and" + "\n" + "Training")
      .style(titleStyles);

    for (let n = startEdu; n <= stopEdu; n++) {
      sheet.row(n).setHeight(80);
    }
  }

  sheet
    .cell(stopEdu + 1, 1)
    .string("Mother Tongue")
    .style(titleStyles);

  sheet.row(stopEdu + 1).setHeight(50);

  const fgnMax = Math.max.apply(
    Math,
    Skills.map(o => o.ForeignLanguage.length)
  );

  const startFgn = stopEdu + 2;
  const stopFgn = startFgn + fgnMax - 1;

  if (fgnMax) {
    sheet
      .cell(startFgn, 1, stopFgn, 1, true)
      .string("Foreign" + "\n" + "Languages")
      .style(titleStyles);

    for (let n = startFgn; n <= stopFgn; n++) {
      sheet.row(n).setHeight(120);
    }
  }

  const achMax = Math.max.apply(
    Math,
    Achievements.map(achievements => achievements.length)
  );

  sheet
    .cell(stopFgn + 1, 1)
    .string("Communication")
    .style(titleStyles);
  sheet
    .cell(stopFgn + 2, 1)
    .string("Organisational")
    .style(titleStyles);
  sheet
    .cell(stopFgn + 3, 1)
    .string("Job Related")
    .style(titleStyles);
  sheet
    .cell(stopFgn + 4, 1)
    .string("Computer")
    .style(titleStyles);
  sheet
    .cell(stopFgn + 5, 1)
    .string("Driving")
    .style(titleStyles);
  sheet
    .cell(stopFgn + 6, 1)
    .string("Other")
    .style(titleStyles);

  const startAch = stopFgn + 7;
  const stopAch = startAch + achMax;

  if (achMax) {
    sheet
      .cell(startAch, 1, stopAch, 1, true)
      .string("Achievements")
      .style(titleStyles);

    for (let n = startAch; n <= stopAch; n++) {
      sheet.row(n).setHeight(80);
    }
  }

  sheet.row(4).setHeight(45);
  sheet.row(6).setHeight(65);
  sheet.row(8).setHeight(65);
  sheet.row(12).setHeight(30);

  fileNames.map((name, i) => {
    sheet
      .cell(2, i + 2)
      .string(name)
      .style(titleStyles);
    sheet
      .cell(3, i + 2)
      .string(PersonNames[i])
      .style(titleStyles);
    sheet.cell(4, i + 2).string(Addresses[i]).style(bigTextStyles);
    sheet.cell(5, i + 2).string(Emails[i]).style(bigTextStyles);
    sheet.cell(6, i + 2).string(Telephones[i]).style(bigTextStyles);
    sheet.cell(7, i + 2).link(Websites[i]).style(bigTextStyles);
    sheet.cell(8, i + 2).string(InstantMessagers[i]).style(bigTextStyles);
    sheet.cell(9, i + 2).string(Birthdates[i]).style(bigTextStyles);
    sheet.cell(10, i + 2).string(Genders[i]).style(bigTextStyles);
    sheet.cell(11, i + 2).string(Nationalities[i]).style(bigTextStyles);
    sheet.cell(12, i + 2).string(Headlines[i]).style(bigTextStyles);
    
    if (WorkExperiences[0]) {
      WorkExperiences.map((item, index) => {
        item.wx.map((wx, j) => {
          sheet
            .cell(13 + j, index + 2)
            .string(wx)
            .style(bigTextStyles);
        });
      });
    }
    if (Educations[0]) {
      Educations.map((item, index) => {
        item.edu.map((edu, j) => {
          sheet
            .cell(startEdu + j, index + 2)
            .string(edu)
            .style(bigTextStyles);
        });
      });
    }

    if (Skills[i].MotherTongue) {
      sheet.cell(stopEdu + 1, i + 2).string(Skills[i].MotherTongue).style(bigTextStyles);
    }

    if (Skills[i].ForeignLanguage) {
      Skills[i].ForeignLanguage.map((lang, j) => {
        sheet
          .cell(stopEdu + 2 + j, i + 2)
          .string(lang)
          .style(bigTextStyles);
      });
    }

    if (Skills[i].Communication) {
      sheet.cell(stopFgn + 1, i + 2).string(Skills[i].Communication).style(bigTextStyles);
    }

    if (Skills[i].Organisational) {
      sheet.cell(stopFgn + 2, i + 2).string(Skills[i].Organisational).style(bigTextStyles);
    }

    if (Skills[i].JobRelated) {
      sheet.cell(stopFgn + 3, i + 2).string(Skills[i].JobRelated).style(bigTextStyles);
    }

    if (Skills[i].Computer) {
      sheet.cell(stopFgn + 4, i + 2).string(Skills[i].Computer).style(bigTextStyles);
    }

    if (Skills[i].Driving) {
      sheet.cell(stopFgn + 5, i + 2).string(Skills[i].Driving).style(bigTextStyles);
    }
    if (Skills[i].Other) {
      sheet.cell(stopFgn + 6, i + 2).string(Skills[i].Other).style(bigTextStyles);
    }

    if (Achievements[i]) {
      Achievements[i].map((ach, j) => {
        sheet
          .cell(startAch + j, i + 2)
          .string(ach)
          .style(bigTextStyles);
      });
    }
  });

  return excel;
}

function saveWorkbook(wb) {
  wb.write("ExcelFile.xlsx");
}

module.exports = {
  create: createWorkbook,
  save: saveWorkbook
};
