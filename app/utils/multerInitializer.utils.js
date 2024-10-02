const multer = require('multer');
const path = require('path');

function checkFileType(file, cb) {
    // Allowed ext
    const filetypes = /jpeg|jpg|png|gif/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error('I don\'t have a clue!'));
    }
}

const destination = (distanation) => {
    return (req, file, cb) => {
        cb(null, distanation)
    }
}

const filename = (foldername) => {
    return (req, file, cb) => {
        const name = `${req.session.user.username}-${foldername}-${Date.now()}-${file.originalname}`;
        cb(null, name)
    }
}
const fileFilter = (req, file, cb) => {

    checkFileType(file, cb);
}

const avatarStorage = multer.diskStorage({
    destination: destination(path.join(process.cwd(), '/public/images/avatars')),
    filename: filename('avatar')
});
const uploadAvatar = multer({
    storage: avatarStorage,
    fileFilter
});

const articlePictureStorage = multer.diskStorage({
    destination: destination(path.join(process.cwd(), '/public/images/article')),
    filename: filename('articlePicture')
});
const uploadarticlePicture = multer({
    storage: articlePictureStorage,
    fileFilter
});

module.exports = { uploadAvatar, uploadarticlePicture };
