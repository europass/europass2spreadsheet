const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
require("dotenv").config();

// API Endpoint for extracting XML from Europass PDF/XML file.
const XML_EXTRACTION_URL = process.env.XML_EXTRACTION_URL;

/**
 * Function to extract the XML info from the Europass PDF/XML file
 * @param {ArrayBuffer} pdfArrayBuffer
 */
function xmlExtraction(fileName, pdfArrayBuffer) {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", XML_EXTRACTION_URL, true);
    xhr.setRequestHeader("accept-language", "*");
    xhr.setRequestHeader("Content-Type", "application/pdf");
    xhr.onreadystatechange = response => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var xml = xhr.responseText;
          xml2EuropassJSON(fileName, xml)
            .then(data => resolve(data))
            .catch(error => {
              reject(new Error(error));
            });
        } else {              
          reject({file: fileName, type: xhr.responseText});
        }
      }
    };
    xhr.send(pdfArrayBuffer);
  });
}

// API Endpoint for converting EUROPASS XML to JSON.
const XML_TO_JSON_URL = process.env.XML_TO_JSON_URL;

function xml2EuropassJSON(fileName, xmlArrayResult) {
  return new Promise(function(resolve, reject) {
    const xhrXmlToJson = new XMLHttpRequest();
    xhrXmlToJson.open("POST", XML_TO_JSON_URL, true);
    xhrXmlToJson.setRequestHeader("accept-language", "*");
    xhrXmlToJson.setRequestHeader("Content-Type", "application/xml");
    xhrXmlToJson.onreadystatechange = response => {
      if (xhrXmlToJson.readyState === 4 && xhrXmlToJson.status === 200) {
        xhrXmlToJson.onreadystatechange = null;
        const europassJSON = JSON.parse(xhrXmlToJson.responseText);
        resolve(europassJSON);
      } else if (xhrXmlToJson.status >= 400) {
        xhrXmlToJson.onreadystatechange = null;
        reject({file: fileName, type: xhrXmlToJson.responseText});
      }
    };
    xhrXmlToJson.send(xmlArrayResult);
  });
}

module.exports = {
  xmlExtraction,
  xml2EuropassJSON
};
