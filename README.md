```
**NOTE: Europass as developed by Cedefop is no longer maintained after June 2020. Please visit https://europass.eu**
```

# Epas2Spreadsheet

Europass to Spreadsheet is an online app that generates Excel from Europass CVs available for downloading after the conversion takes place.

## How does it work
Go to https://europass.cedefop.europa.eu/europass2spreadsheet/ and add Europass CVs into the form. Once you have added the Europass CVs you can send them into our servers to convert them into an Excel Spreadsheet presenting you all the info that CVs contains in a comparable way.

## Instructions

To build this project you have to clone it from its repository.
Inside project folder run 
```
npm install
```


## Configuration

To configure and run the service you must create a .env file in the project root folder declaring the values below

```
ENDPOINT=/ 

PORT=5201

EMAIL_USER=
EMAIL_PASSWORD=
EMAIL_HOST=

XML_EXTRACTION_URL=https://https://europass.cedefop.europa.eu/rest/v1/document/extraction
XML_TO_JSON_URL=https://https://europass.cedefop.europa.eu/rest/v1/document/to/json
```


## Run

To  run the service once the installation of node.js modules we are using PM2 (http://pm2.keymetrics.io/)

```
pm2 start app.js
```

If we want to allow PM2 to cluster into all cpu threads and load balancing the load we can start the service from the `procecces.json`

```
pm2 start processes.json
```

## Supported file types

The supported types of documents are Europass PDF generated directly from Europass Online Editor. (https://europass.cedefop.europa.eu/editors/)

## Data policy

Europass servers do not keep record of CVs, Language Passports, European Skills Passports or any other files uploaded by the users. The files are processed by the Europass servers and immediately deleted.
All processing carried out by the Europass e-service meets the requirements of Regulation (EU) 2018/1725 of the European Parliament and of the Council of 23 October 2018 on the protection of natural persons with regard to the processing of personal data by the Union institutions, bodies, offices and agencies and on the free movement of such data, and repealing Regulation (EC) No 45/2001 and Decision No 1247/2002/EC.

## More Info and Contact us
https://interop.europass.cedefop.europa.eu/documentation/web-services/europass2spreadsheet
