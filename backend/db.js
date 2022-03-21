const mongoose = require('mongoose');

const mongoURL = "mongodb://localhost/mongodata";

const connectToMongo = ()=>{
    mongoose.connect(mongoURL,()=>{
        console.log("connected to mongoDB");
    })

}


module.exports = connectToMongo;