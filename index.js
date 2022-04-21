const path = require('path');
const unoconv = require('awesome-unoconv');
//Place your word file in source
const sourceFilePath = path.resolve('./a.docx');
const outputFilePath = path.resolve('./myDoc.pdf');
 
unoconv
  .convert(sourceFilePath, outputFilePath)
  .then(result => {
    console.log(result); // return outputFilePath
  })
  .catch(err => {
    console.log(err);
  });