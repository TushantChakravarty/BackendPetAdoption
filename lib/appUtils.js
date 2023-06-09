'use strict';

//========================== Load Modules Start ===========================

//========================== Load External Module =========================

var promise = require('bluebird');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken')

//========================== Load Modules End =============================

//========================== Export Module Start ===========================



/**
 * returns if email is valid or not
 * @returns {boolean}
 */
function isValidEmail(email) {
    var pattern = /(([a-zA-Z0-9\-?\.?]+)@(([a-zA-Z0-9\-_]+\.)+)([a-z]{2,3}))+$/;
    return new RegExp(pattern).test(email);
}



async function convertPass(password) {
    let pass = await bcrypt.hash(password, 10)
    // req.body.password = pass;
    return pass
}

function verifyPassword(user, isExist) {
    return bcrypt.compare(user.password, isExist.password);
}


function createToken(user){
    
    const token = jwt.sign(
        { user_id: user._id, email: user.email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "1h",
        }
      );

    return token;
}


//========================== Export Module Start ===========================

module.exports = {

    
    verifyPassword,

    isValidEmail,

    convertPass,

    createToken,


    
};

//========================== Export Module End===========================
