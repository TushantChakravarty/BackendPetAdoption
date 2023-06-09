

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

function sendOtp(details) {

    return service.sendOtp(details).then(data => data)
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

function updateProfile(details) {

    return service.updateProfile(details).then(data => data)
}

function sendNotification(details) {

    return service.sendNotification(details).then(data => data)
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


function forgotPassword(details) {

    return service.forgotPassword(details).then(data => data)
}


function setNewPassword(details) {

    return service.setNewPassword(details).then(data => data)
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

function deleteFromAllPosts(details) {

    return service.deleteFromAllPost( details).then(data => data)
}

function deleteFromUserPosts(details) {

    return service.deleteFromUserPosts( details).then(data => data)
}
module.exports = {

    createUserDetails,

    register,

    sendOtp,

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

    addMessages,

    deleteFromAllPosts,

    deleteFromUserPosts,

    updateProfile,

    sendNotification

}
//exp://wz-erk.tushant07.munziapp.exp.direct:80