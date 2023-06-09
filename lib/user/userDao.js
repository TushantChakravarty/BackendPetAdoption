
const mongoose = require('mongoose')
let BaseDao = require('../dao/BaseDao')
const constants = require('../constants')

const User = require('../generic/models/userModel')
const userPosts = require("../generic/models/userPosts")
const usrDao = new BaseDao(User);
const userPostsDao = new BaseDao(userPosts);




/*#################################            Load modules end            ########################################### */


/**
 * Get user details
 * @param {Object} query query to find user details
 */
function getUserDetails(query) {
    

    return usrDao.findOne(query)
}

/**
 * Create user
 * @param {Object} obj user details to be registered
 */
function createUser(obj) {

    let userObj = new User(obj)
    return usrDao.save(userObj)
}




/**
 * Update user profile
 * @param {Object} query mongo query to find user to update
 * @param {Object} updateDetails details to be updated
 */
function updateProfile(query, updateDetails) {

    let update = {}
    update['$set'] = updateDetails

    let options = {
        new: true
    }
    
    return usrDao.findOneAndUpdate(query, update, options)
}

function updateOTP(query, updateDetails) {

    let update = {}
    update['$set'] = updateDetails

    let options = {
        new: true
    }
    
    return usrDao.findOneAndUpdate(query, update, options)
}

async function updateWallet(query, updateDetails) {

    let update = {}
    update['$push'] = updateDetails

    let options = {
        new: true
    }
    
    
    return usrDao.findOneAndUpdate(query, {$push:{accounts:updateDetails}},{safe: true, upsert: true, new : true})
    
}

async function updateTransaction(query, updateDetails) {

    let update = {}
    update['$push'] = updateDetails

    let options = {
        new: true
    }
    
    
    return usrDao.findOneAndUpdate(query, {$push:{transactions:updateDetails}},{safe: true, upsert: true, new : true})
    
}

async function addPosts(query, updateDetails) {

    let update = {}
    update['$push'] = updateDetails

    let options = {
        new: true
    }
    
    
    return usrDao.findOneAndUpdate(query, {$push:{posts:updateDetails}},{safe: true, upsert: true, new : true})
    
}

async function getAllWallets(details){
  const data = await usrDao.findOne(details)
  //console.log(data)
  return data
}

function getWalletdetail(query){

    return usrDao.Find({
        $and: [
            { "_id": { $ne: `${query._id}` } },
          { "walletAddress":`${query.walletAddress}`} ,
          
        ]
      })
}

function addToAllPosts (query,updateDetails){
    let update = {}
    update['$push'] = updateDetails

    let options = {
        new: true
    }
    
    
    return userPostsDao.findOneAndUpdate(query, {$push:{posts:updateDetails}},{safe: true, upsert: true, new : true})
   

}

function deleteFromAllPost (query,updateDetails){
    let update = {}
    update['$push'] = updateDetails

    let options = {
        new: true
    }
    
    
    return userPostsDao.findOneAndUpdate(query, {$pull:{posts:updateDetails}})
   

}

function deleteFromUserPosts(query,updateDetails){
    let update = {}
    update['$push'] = updateDetails

    let options = {
        new: true
    }
    
    
    return usrDao.findOneAndUpdate(query, {$pull:{posts:updateDetails}})
   

}

function getAllPosts(){
    const data = userPostsDao.find()
    console.log(data)
    return data
}

function getUserProfile(query){
    return usrDao.find({
        $and: [
          { "emailId":`${query.emailId}`} ,
          
        ]
      })
}

function addMessages(query,updateDetails){
    let update = {}
    update['$push'] = updateDetails

    let options = {
        new: true
    }
    
    
    return usrDao.findOneAndUpdate(query, {$push:{messages:updateDetails}},{safe: true, upsert: true, new : true})
   

}

module.exports = {

 
    getUserDetails,

    createUser,

    updateWallet,
    
    updateProfile,
    
    getWalletdetail,

    getAllWallets,

    updateTransaction,

    addPosts,

    addToAllPosts,

    getAllPosts,

    getUserProfile,
    
    addMessages,

    deleteFromAllPost,

    deleteFromUserPosts,

    updateOTP
}