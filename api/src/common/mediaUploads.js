const multer = require("multer");

function mediaUploads() {
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      const path = `${process.env.MEDIA_PATH}/${getDirectoryByFile(file)}`;
      cb(null, path);
    },
    filename: function (req, file, cb) {
      const filename = `${getDirectoryByFile(file)}-${Date.now()}-${Math.round(
        Math.random() * 100
      )}`;
      const extension = file.originalname.split(".").pop();
      cb(null, `${filename}.${extension}`);
    },
  });

  return multer({ storage });
}

function getDirectoryByFile(fileInfo) {
  // Arrays get identified (at the route) by appending [].
  // Better remove [] to avoid naming folders with [], like "photos[]"
  const long = fileInfo.fieldname.length;
  const folder =
    fileInfo.fieldname.slice(-2) === "[]"
      ? fileInfo.fieldname.slice(0, long - 2)
      : fileInfo.fieldname;
  return "/" + folder;
}
module.exports = mediaUploads;
