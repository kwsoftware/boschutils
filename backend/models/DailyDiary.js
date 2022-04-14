const mongoose = require('mongoose');
const { Schema } = mongoose;
const DailyDiarySchema = new Schema({
    userid:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user'

    },
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
    faultdescription:{
        type:String,
        required:true
    },
    action:{
        type:String,
        required:true
    },
    actionby:{
        type:String,
        required:true
    },
    status:{
        type:String,
    },
    remark:{
        type:String,
    }
});

module.exports = mongoose.model('dailydiary', DailyDiarySchema);
