const mongoose = require('mongoose')
const constants = require('../../constants')
const appUtil = require('../../appUtils');


const Schema = new mongoose.Schema({
    emailId: { type: String, required: false },
    password:{type: String, required: false},
    name:{type: String, required: false},
    city:{type: String, required: false},
    state:{type: String, required: false},
    profilePhotoUri:{type:String,require:false},
    phoneNumber:{type:String,required:false},
    bio:{type:String, required:false},
    posts:[
        {
            pet:{type:String},
            state:{type:String},
            city:{type:String},
            age:{type:Number},
            description:{type:String},
            healthDetails:{type:String},
            contactNo:{type:Number},
            photoUri:[
                {path:{type:String}}
            ]
    
   }],
    token:{type:String}
}, {
    versionKey: false,
    timeStamp: true,
    strict: true
})

module.exports = mongoose.model(constants.DB_MODEL_REF.USERS, Schema);