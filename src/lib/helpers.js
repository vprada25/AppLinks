const becrypt = require('bcryptjs');
const helpers = {};

helpers.encryptPassword = async (password) => {
    const salt = await becrypt.genSalt(1);
    const hash = await becrypt.hash(password, salt);
    return hash;
};

helpers.macthPassword = async (password, savedPassword) => {
    try {
       return await becrypt.compare(password, savedPassword);
    } catch (error) {
        console.log(error);
    }

}

module.exports = helpers;