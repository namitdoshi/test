const express = require('express');
const path = require('path');
const unoconv = require('awesome-unoconv');
const cors = require('cors')
const multer = require('multer');
const { diskStorage } = require('multer');

const app = express();
app.use(cors());

// handling file upload
const storage = diskStorage({
  destination: (req, file, cb) => {
    cb(null, './files/');
  },
  filename: (req, file, cb) => {
    let ext = file.originalname.split('.');
    // console.log('file: '+ JSON.stringify(file));
    cb(null, `${file.fieldname}-${ext[0]}-${Date.now()}.${ext[1]}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    console.log(file.mimetype);
    var ext = path.extname(file.originalname);
    if (ext !== '.doc' && ext !== '.docx') {
      return cb(new Error('Files with extension doc or docx ar allowed'))
    }
    cb(null, true);
  }
});


//Place your word file in source
// const sourceFilePath = path.resolve('./FAQPTR.doc');
// const outputFilePath = path.resolve('./myDoc.pdf');
 
// unoconv
//   .convert(sourceFilePath, outputFilePath)
//   .then(result => {
//     console.log(result); // return outputFilePath
//   })
//   .catch(err => {
//     console.log(err);
//   });


app.post('/doc-2-pdf', upload.single('file'), async(req, res) => {
  try {
    const file = req.file;

    const sourceFilePath = path.join(__dirname, `./files/${file.filename}`);
    const outputFilePath = path.join(__dirname, `./files/${file.filename.split('.').shift()}.pdf`);
    
    console.log('file: ' +file.filename);
    await unoconv
      .convert(sourceFilePath, outputFilePath)
      .then(result => {
        console.log(result); // return outputFilePath
        // res.download(`./files/${file.filename.split('.').shift()}.pdf`);
        console.log(`pdf name: ${file.filename.split('.').shift()}.pdf` );
        const a = await res.download(`./files/${file.filename.split('.').shift()}.pdf`)
        return res.a.status(200).json({code: 200, err: false, msg: `${file.filename.split('.').shift()}.pdf downloaded successfully`});
      })
      .catch(err => {
        console.log(err);
  });
  } catch (error) {
    
  }
})

  app.listen(8080, () => console.log('Listening on 8080...'));