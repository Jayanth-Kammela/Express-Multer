const mongoose = require('mongoose');

const uploadModel = mongoose.Schema({
    File: { type:String }
})

uploadModel.statics.signup=async function (File) {


    if (!File) {
        throw Error('All fields must be filled')
    }
}

module.exports=mongoose.model("FileUpload",uploadModel)