const mongoose = require('mongoose');
const connectionRequestModel =  new mongoose.Schema({
    fromUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "userModel"

    },
    toUserId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "userModel"
    },
    status:{
        type: String,
        enum: {
            values: ["ignore", "accepted","interested","rejected"],
            message: `{VALUE} is not a valid staut type.`,
        },
    }

},{
    timestamps: true,
});

connectionRequestModel.index({fromUserId: 1, toUserId: 1},{unique:true}); 

const connectionReq = new mongoose.model('connectionRequest', connectionRequestModel);

module.exports= connectionReq;