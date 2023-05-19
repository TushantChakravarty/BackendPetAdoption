

/*#################################            Load modules start            ########################################### */
const service = require('./userService')

/*#################################            Load modules end            ########################################### */





/**
 * Register user
 * @param {Object} details user details to get registered
 */
function register(details) {

    return service.register(details).then(data => data)
}

function saveUserDetails(details) {

    return service.saveUserDetails(details).then(data => data)
}

function addPosts(details) {

    return service.addPosts(details).then(data => data)
}

function allPosts(details) {

    return service.allPosts(details).then(data => data)
}
function getAllPosts() {

    return service.getAllPosts().then(data => data)
}


function createUserDetails(details) {

    return service.createUserDetails(details).then(data => data)
}

function createProfile(details) {

    return service.createProfile(details).then(data => data)
}



 function confirmOtp( details) {

    return service.confirmOtp( details).then(data => data)
}

function verifySecurityCode(id, details) {

    return service.verifySecurityCode(id, details).then(data => data)
}
 
function login(details) {

    return service.login(details).then(data => data)
}


function forgotPassword(emailId) {

    return service.forgotPassword(emailId).then(data => data)
}


function setNewPassword(redisId, password) {

    return service.setNewPassword(redisId, password).then(data => data)
}

function resetPassword(id, oldPassword, newPassword) {

    return service.resetPassword(id, oldPassword, newPassword).then(data => data)
}


function verifyOtp(id, details) {

    return service.verifyOtp(id, details).then(data => data)
}

function getUserProfile(details) {

    return service.getUserProfile( details).then(data => data)
}

function addMessages(details) {

    return service.addMessages( details).then(data => data)
}
module.exports = {

    createUserDetails,

    register,

    verifySecurityCode,

    login,

    forgotPassword,

    setNewPassword,

    resetPassword,

    verifyOtp,

    confirmOtp,

    saveUserDetails,

    addPosts,

    allPosts,

    getAllPosts,

    createProfile,

    getUserProfile,

    addMessages

}
//exp://wz-erk.tushant07.munziapp.exp.direct:80