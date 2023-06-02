const mongoose = require('mongoose')
const constants = require('../../constants')
const appUtil = require('../../appUtils');


const Schema = new mongoose.Schema({
    
    posts:[
        {
            uniqueId:{type:Number},
            postNumber:{type:Number},
            user:{type:String},
            pet:{type:String},
            state:{type:String},
            city:{type:String},
            age:{type:Number},
            description:{type:String},
            healthDetails:{type:String},
            contactNo:{type:Number},
            fcmKey:{type:String},
            photoUri:[
                {path:{type:String}}
            ],
            name:{type:String},
            profilePhotoUri:{type:String}
    
   }],
   
}, {
    versionKey: false,
    timeStamp: true,
    strict: true
})

module.exports = mongoose.model('userPosts', Schema);
