let crypto = require('crypto');

class Utils {

    hashPassword(password) {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString();
        return [salt, hash].join('$');
    }

    verifyPassword(password, storedPassword) {
        const originalHash = storedPassword.split('$')[1];
        const salt = storedPassword.split('$')[0];
        const hash = crypto.pbkdf2Sync(password, salt, 2048, 32, 'sha512').toString('hex');
        return hash === storedPassword;
    }
}

module.exports = new Utils();