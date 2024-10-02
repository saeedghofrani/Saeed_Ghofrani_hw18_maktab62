const fs = require('fs/promises');
const { join } = require('path');
const deletePicture = (address, picture) => {
    fs.unlink(join(address, picture));
};
module.exports = deletePicture;