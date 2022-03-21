const mongoose = require('mongoose');
const { Schema } = mongoose;
const SpindleHistorySchema = new Schema({
    date:{
        type: Date,
        default: Date.now
    },
    shift:{
        type:String,
        required:true
    },
    machineno:{
        type:Number,
        required:true,
    },
    oldspindle:{
        type:Number,
        required:true
    },
    faultdescription:{
        type:String,
        required:true
    },
    newspindle:{
        type:Number,
        required:true
    },
    attendedby:{
        type:String,
        required:true
    },
    status:{
        type:String
    },
    remark:{
        type:String
    }
});

module.exports = mongoose.model('spindlehistory', SpindleHistorySchema);
