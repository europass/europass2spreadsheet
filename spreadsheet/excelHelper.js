function strip_html_tags(str) {
  if (str === undefined || str === null || str === "") return false;
  else str = str.toString();
  return str.replace(/<[^>]*>/g, "");
}

function names(cv) {
  if (!cv.Identification || !cv.Identification.PersonName) {
    return "No Full Name Provided";
  }

  if (
    !cv.Identification.PersonName.FirstName &&
    !cv.Identification.PersonName.Surname
  ) {
    return "No Full Name Provided";
  }

  let name = "";
  if (cv.Identification.PersonName.FirstName) {
    name += cv.Identification.PersonName.FirstName;
  }
  if (cv.Identification.PersonName.Surname) {
    name += (name.length ? " " : "") + cv.Identification.PersonName.Surname;
  }

  return name;
}

function addresses(cv) {
  if (
    !cv.Identification ||
    !cv.Identification.ContactInfo ||
    !cv.Identification.ContactInfo.Address ||
    !cv.Identification.ContactInfo.Address.Contact
  ) {
    return "No Address Info";
  }
  const contact = cv.Identification.ContactInfo.Address.Contact;
  const contactComplex = [];
  if (contact.AddressLine) {
    contactComplex.push(contact.AddressLine);
  }
  if (contact.PostalCode) {
    contactComplex.push(" \n" + contact.PostalCode + " ");
  }
  if (contact.Municipality) {
    contactComplex.push(contact.Municipality);
  }
  if (contact.Country && contact.Country.Label) {
    contactComplex.push(" \n" + contact.Country.Label);
  }

  if (
    !contact.AddressLine &&
    !contact.PostalCode &&
    !contact.Municipality &&
    !contact.Country
  ) {
    contactComplex.push("No Address Info");
  }

  return contactComplex;
}

function emails(cv) {
  if (
    !cv.Identification ||
    !cv.Identification.ContactInfo ||
    !cv.Identification.ContactInfo.Email ||
    !cv.Identification.ContactInfo.Email.Contact
  ) {
    return "No email provided";
  } else {
    return cv.Identification.ContactInfo.Email.Contact;
  }
}

function telephones(cv) {
  if (
    !cv.Identification ||
    !cv.Identification.ContactInfo ||
    !cv.Identification.ContactInfo.Telephone
  ) {
    return "No Telephones";
  }
  telephone = "";

  cv.Identification.ContactInfo.Telephone.map(tel => {
    telephone +=
      (telephone.length ? "\n" : "") +
      (tel.Use && tel.Use.Label ? tel.Use.Label + ": " : "") +
      (tel.Contact ? tel.Contact : "");
  });

  //console.log(cv.Identification.ContactInfo.Telephone);
  return telephone;
}

function websites(cv) {
  if (
    !cv.Identification ||
    !cv.Identification.ContactInfo ||
    !cv.Identification.ContactInfo.Website
  ) {
    return "";
  }
  website = "";

  cv.Identification.ContactInfo.Website.map(site => {
    website += (website.length ? "\n" : "") + site.Contact;
  });
  //console.log(cv.Identification.ContactInfo.Telephone);
  return website;
}

function messagers(cv) {
  if (
    !cv.Identification ||
    !cv.Identification.ContactInfo ||
    !cv.Identification.ContactInfo.InstantMessaging
  ) {
    return "";
  }
  messager = "";

  cv.Identification.ContactInfo.InstantMessaging.map(provider => {
    messager +=
      (messager.length ? "\n" : "") +
      (provider.Use && provider.Use.Label ? provider.Use.Label + ": " : "") +
      (provider.Contact ? provider.Contact : "");
  });
  //console.log(cv.Identification.ContactInfo.Telephone);
  return messager;
}

function birthdate(cv) {
  if (
    !cv.Identification ||
    !cv.Identification.Demographics ||
    !cv.Identification.Demographics.Birthdate
  ) {
    return "";
  }
  let date = "";
  if (cv.Identification.Demographics.Birthdate.Date) {
    date += cv.Identification.Demographics.Birthdate.Date;
  }

  if (cv.Identification.Demographics.Birthdate.Month) {
    date +=
      (date.length ? "/" : "") + cv.Identification.Demographics.Birthdate.Month;
  }

  if (cv.Identification.Demographics.Birthdate.Year) {
    date +=
      (date.length ? "/" : "") + cv.Identification.Demographics.Birthdate.Year;
  }

  return date;
}

function gender(cv) {
  if (
    !cv.Identification ||
    !cv.Identification.Demographics ||
    !cv.Identification.Demographics.Gender ||
    !cv.Identification.Demographics.Gender.Label
  ) {
    return "";
  } else {
    return cv.Identification.Demographics.Gender.Label;
  }
}

function nationality(cv) {
  if (
    !cv.Identification ||
    !cv.Identification.Demographics ||
    !cv.Identification.Demographics.Nationality
  ) {
    return "";
  } else {
    let nationalities = "";
    cv.Identification.Demographics.Nationality.map(nat => {
      nationalities += (nationalities.length ? "\n" : "") + nat.Label;
    });

    return nationalities;
  }
}

function headline(cv) {
  if (!cv.Headline) {
    return "";
  } else {
    const text =
      cv.Headline.Type.Label +
      ":\n" +
      strip_html_tags(
        cv.Headline && cv.Headline.Description && cv.Headline.Description.Label
          ? cv.Headline.Description.Label
          : ""
      );
    return text;
  }
}

function workExperience(cv) {
  let wx = [];
  if (!cv.WorkExperience) {
    return {
      length: 0,
      wx: []
    };
  }
  cv.WorkExperience.map(item => {
    let experience = "";

    let period = "";
    const periodTemp = JSON.flatten(item.Period);
    period +=
      periodTemp["From.Day"] !== undefined ? periodTemp["From.Day"] : "";
    period +=
      (period.length ? "/" : "") +
      (periodTemp["From.Month"] !== undefined ? periodTemp["From.Month"] : "");
    period +=
      (period.length ? "/" : "") +
      (periodTemp["From.Year"] !== undefined ? periodTemp["From.Year"] : "");
    period +=
      period.length &&
      (periodTemp["To.Day"] || periodTemp["To.Month"] || periodTemp["To.Year"])
        ? "-"
        : "";
    period += periodTemp["To.Day"] !== undefined ? periodTemp["To.Day"] : "";
    period +=
      (period.length && periodTemp["To.Day"] ? "/" : "") +
      (periodTemp["To.Month"] !== undefined ? periodTemp["To.Month"] : "");
    period +=
      (period.length && (periodTemp["To.Day"] || periodTemp["To.Month"])
        ? "/"
        : "") +
      (periodTemp["To.Year"] !== undefined ? periodTemp["To.Year"] : "");
    period += periodTemp.Current ? " - Present" : "";
    period += period.length ? "\n" : "";

    experience += period;
    experience += item.Position.Label ? item.Position.Label + "\n" : "";
    experience +=
      item.Employer && item.Employer.Name ? item.Employer.Name + "\n" : "";
    experience +=
      (item.Employer &&
      item.Employer.ContactInfo &&
      item.Employer.ContactInfo.Address &&
      item.Employer.ContactInfo.Address.Contact &&
      item.Employer.ContactInfo.Address.Contact.Municipality
        ? item.Employer.ContactInfo.Address.Contact.Municipality
        : "") +
      (item.Employer &&
      item.Employer.ContactInfo &&
      item.Employer.ContactInfo.Address &&
      item.Employer.ContactInfo.Address.Contact &&
      item.Employer.ContactInfo.Address.Contact.Country &&
      item.Employer.ContactInfo.Address.Contact.Country.Label
        ? " " + item.Employer.ContactInfo.Address.Contact.Country.Label
        : "");
    let activities = strip_html_tags(item.Activities);
    experience += "\n\n" + activities;
    wx.push(experience);
  });
  return {
    length: cv.WorkExperience.length,
    wx: wx
  };
}

function educations(cv) {
  let edu = [];
  if (!cv.Education) {
    return {
      length: 0,
      edu: []
    };
  }
  cv.Education.map(item => {
    const eduObj = JSON.flatten(item);
    //console.log(eduObj);
    let education = "";

    let period = "";
    period +=
      eduObj["Period.From.Day"] !== undefined ? eduObj["Period.From.Day"] : "";
    period +=
      (period.length ? "/" : "") +
      (eduObj["Period.From.Month"] !== undefined
        ? eduObj["Period.From.Month"]
        : "");
    period +=
      (period.length ? "/" : "") +
      (eduObj["Period.From.Year"] !== undefined
        ? eduObj["Period.From.Year"]
        : "");
    period +=
      period.length &&
      (eduObj["Period.To.Day"] ||
        eduObj["Period.To.Month"] ||
        eduObj["Period.To.Year"])
        ? "-"
        : "";
    period += eduObj["To.Day"] !== undefined ? eduObj["To.Day"] : "";
    period +=
      (period.length && eduObj["Period.To.Day"] ? "/" : "") +
      (eduObj["Period.To.Month"] !== undefined
        ? eduObj["Period.To.Month"]
        : "");
    period +=
      (period.length && (eduObj["Period.To.Day"] || eduObj["Period.To.Month"])
        ? "/"
        : "") +
      (eduObj["Period.To.Year"] !== undefined ? eduObj["Period.To.Year"] : "");
    period += eduObj.Current ? " - Present" : "";
    period += period.length ? "\n" : "";

    education += period;
    education += item.Title ? item.Title + "\n" : "";
    education +=
      eduObj["Organisation.Name"] !== undefined
        ? eduObj["Organisation.Name"] + "\n"
        : "";

    education +=
      (eduObj["Organisation.ContactInfo.Address.Contact.AddressLine"]
        ? eduObj["Organisation.ContactInfo.Address.Contact.AddressLine"]
        : "") +
      (eduObj["Organisation.ContactInfo.Address.Contact.Country.Label"] !==
      undefined
        ? " " + eduObj["Organisation.ContactInfo.Address.Contact.Country.Label"]
        : "");
    let activities = strip_html_tags(eduObj.Activities);
    education += "\n\n" + activities;
    edu.push(education);
  });
  return {
    length: cv.Education.length,
    edu: edu
  };
}

function skills(cv) {
  let MotherTongue =
    cv.Skills && cv.Skills.Linguistic && cv.Skills.Linguistic.MotherTongue
      ? cv.Skills.Linguistic.MotherTongue.map(e => e.Description.Label).join(
          "\n"
        )
      : "";

  let ForeignLanguage = [];

  cv.Skills && cv.Skills.Linguistic && cv.Skills.Linguistic.ForeignLanguage
    ? cv.Skills.Linguistic.ForeignLanguage.map(e => {
        const language =
          e.Description && e.Description.Label ? e.Description.Label : "";

        let self_assessment = "";
        if (e.ProficiencyLevel) {
          self_assessment =
            "\nSelf assessment\n -Listening: " + e.ProficiencyLevel &&
            e.ProficiencyLevel.Listening
              ? e.ProficiencyLevel.Listening
              : "" + "\n -Reading: " + e.ProficiencyLevel &&
                e.ProficiencyLevel.Reading
              ? e.ProficiencyLevel.Reading
              : "" + "\n -Spoken Interaction: " + e.ProficiencyLevel &&
                e.ProficiencyLevel.SpokenInteraction
              ? e.ProficiencyLevel.SpokenInteraction
              : "" + "\n -Spoken Production: " + e.ProficiencyLevel &&
                e.ProficiencyLevel.SpokenProduction
              ? e.ProficiencyLevel.SpokenProduction
              : "" + "\n -Writing: " + e.ProficiencyLevel &&
                e.ProficiencyLevel.Writing
              ? e.ProficiencyLevel.Writing
              : "";
        }

        const certificates = e.Certificate
          ? "\nCertificates \n -" + e.Certificate.map(c => c.Title).join("\n -")
          : "";
        ForeignLanguage.push(language + self_assessment + certificates);
      })
    : "";

  let Communication =
    cv.Skills && cv.Skills.Communication && cv.Skills.Communication.Description
      ? strip_html_tags(cv.Skills.Communication.Description)
      : "";
  let Organisational =
    cv.Skills &&
    cv.Skills.Organisational &&
    cv.Skills.Organisational.Description
      ? strip_html_tags(cv.Skills.Organisational.Description)
      : "";
  let JobRelated =
    cv.Skills && cv.Skills.JobRelated && cv.Skills.JobRelated.Description
      ? strip_html_tags(cv.Skills.JobRelated.Description)
      : "";
  let Computer =
    cv.Skills && cv.Skills.Computer && cv.Skills.Computer.Description
      ? strip_html_tags(cv.Skills.Computer.Description)
      : "";
  let Driving =
    cv.Skills && cv.Skills.Driving && cv.Skills.Driving.Description
      ? cv.Skills.Driving.Description.map(e => e).join(",")
      : "";
  let Other =
    cv.Skills && cv.Skills.Other && cv.Skills.Other.Description
      ? strip_html_tags(cv.Skills.Other.Description)
      : "";

  return {
    MotherTongue,
    ForeignLanguage,
    Communication,
    Organisational,
    JobRelated,
    Computer,
    Driving,
    Other
  };
}

function achievements(cv) {
  let achievement = [];
  if (!cv.Achievement) {
    return "";
  }
  cv.Achievement.map(item => {
    if (item.Title && item.Title.Label && item.Description) {
      achievement.push(
        item.Title.Label + "\n" + strip_html_tags(item.Description)
      );
    }
  });

  return achievement;
}

JSON.flatten = function(data) {
  const result = {};

  function recurse(cur, prop) {
    if (Object(cur) !== cur) {
      result[prop] = cur;
    } else if (Array.isArray(cur)) {
      let l = cur.length;
      for (let i = 0; i < l; i++) recurse(cur[i], prop + "." + i);
      if (l === 0) result[prop] = [];
    } else {
      let isEmpty = true;
      for (let p in cur) {
        isEmpty = false;
        recurse(cur[p], prop ? prop + "." + p : p);
      }
      if (isEmpty && prop) result[prop] = {};
    }
  }
  recurse(data, "");
  return result;
};

module.exports = {
  names,
  addresses,
  emails,
  telephones,
  websites,
  messagers,
  birthdate,
  gender,
  nationality,
  headline,
  workExperience,
  educations,
  skills,
  achievements
};
