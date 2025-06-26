const multer = require('multer');
 
 
 
const storage = multer.diskStorage({ //
 
destination: (req, file, cb) => {
 
return cb(null, "./uploads"); //product create or user create
 
},
 
filename: (req, file, cb) => {
 
const fileName = file?.originalname?.replace(/\s/g, "_"); //space lai underscore le replace garni suppose unika shakya bhayo bhane unika_shakya.pdf bhanera
//? means kei na kei aucha hai bhanera dincha 100% gurantee fileko name
cb(null, fileName); //cb=call back function
 
},
 
});
 
 
 
var fileFilter = (req, file, callback) => {
 
if (!file.originalname.match(/\.(pdf|epub|djvu|PFD|DJVU|png)$/)) { //file types
 
return callback(new Error('Invalid file format'), false)
 
}
 
callback(null, true)
 
}
 
 
 
const fileUpload = (fieldName) => (req, res, next) => {
 
multer({
 
storage, //mathi bata ako
 
fileFilter: fileFilter,
 
}).array(fieldName, 100) /*multiple file upload */ /*.single(fieldName)*/(req, res, (err) => {
 
if (err) {
 
return res.status(400).json({ error: err.message });
 
}
 
if (req.files) {
 
console.log("Uploaded Files:");
 
req.files.forEach(file => {
 
console.log(`- ${file.originalname} -> ${file.filename}`);
 
});
 
}
 
 
 
next();
 
});
 
};
 
 
module.exports = fileUpload