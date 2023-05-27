const multer = require('multer');
const boom = require('@hapi/boom');
const upload = multer({
  dest: 'uploads/',
filename: (req,file,callback) => {
   callback(null,file.originalname);
 },
  limits: {
    fields: 10,
    fieldNameSize: 50, // TODO: Check if this size is enough
    fieldSize: 50000, //TODO: Check if this size is enough
    // TODO: Change this line after compression
    fileSize: 15000000, // 150 KB for a 1080x1080 JPG 90
  },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      cb(null, true);
    } else {
      cb(null, false);

      return cb(
        boom.notAcceptable(
          'you are not permitted, Only .png, .jpg and .jpeg format allowed!'
        )
        // new Error('Only .png, .jpg and .jpeg format allowed!')
      );
    }
  },
});

module.exports = upload;
