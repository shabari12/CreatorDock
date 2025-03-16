const mongoose = require('mongoose');


const channelSchema = new mongoose.Schema({
    channelName: {
        type: String,
        required: true,
        unique: true
    },
    channelDescription: {
        type: String,
        required: true
    },
    channelAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    editors: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Editor'
        }
    ]
});


const Channel = mongoose.model('Channel', channelSchema);

module.exports = Channel;