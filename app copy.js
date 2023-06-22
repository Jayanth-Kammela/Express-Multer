// const express = require('express');
// const app = express();
// const multer = require('multer');//middleware that process files uploaded in multipart/form-data===dividing into
// const path = require('path');
// const uploadModel = require('./model/upload');
// let mongoose = require('mongoose');

// const storage = multer.diskStorage({

//     // destination	The folder to which the file has been saved	
//     // filename	The name of the file within the destination

//     destination: (req, file, cb) => {
//         cb(null, 'Upload') //to determine whrere to store the files
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}--${path.extname(file.originalname)}`) //at here we are storing date with original by using the path module
//     }
// })
// const upload = multer({ storage: storage })

// async function main() {
//     try {
//         await mongoose.connect('');
//     } catch (error) {
//         console.log(error);
//     }
// }
// main()

// app.get('/', (req, res) => {
//     return res.status(200).json({ app: "Web" })
// })

// app.post('/post', upload.single('File'), async (req, res) => {
//     const file = req.file;
//     // console.log({...file});
//     try {
//         const users = new uploadModel(req.body);
//         users.save()
//         const arr=[];
//         arr.push(file,users)
//         return res.status(200).send(arr);
//     } catch (error) {
//         return res.status(422).json(error);

//     }

// })
    


// // async (req,res)=>{
// //     try {
// //         const users=new uploadModel(req.body);
// //         users.save();
// //         return res.status(200).json(users)
// //     } catch (error) {

// //     }
// // }




// app.listen(8084, () => {
//     console.log('runing on 8084');
// })







const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const mongoose = require('mongoose');
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
const methodOverride = require('method-override');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

const mongoURI = '';

const conn = mongoose.createConnection('');

let gfs;

// conn.once(() => {
//     gfs = Grid(conn.db, mongoose.mongo);
//     gfs.collection('uploads')})

const storage = new GridFsStorage({
  url: mongoURI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });


app.get('/', (req, res) => {
  gfs.files.find().toArray((err, files) => {
    // Check if files
    if (!files || files.length === 0) {
      res.render('index', { files: false });
    } else {
      files.map(file => {
        if (
          file.contentType === 'image/jpeg' ||
          file.contentType === 'image/png'
        ) {
          file.isImage = true;
        } else {
          file.isImage = false;
        }
      });
      res.render('index', { files: files });
    }
  });
});

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ file: req.file });
});
