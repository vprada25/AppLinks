const becrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await becrypt.genSalt(10);
    const hash = await becrypt.hash(password, salt);
    return hash;
};

helpers.macthPassword = async (password, savedPassword) => {
    try {
        await becrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }

}

module.exports = helpers;