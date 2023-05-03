const { default: mongoose } = require('mongoose');
const moongoose = require('mongoose');
const { Schema } = moongoose;

const NotesSchema = new Schema({
    
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'user'
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
        
    },
    tag:{
        type:String,
        default:"General"
        
    },
    date:{
        type:Date,
        default:Date.now
    },

  });

  module.exports = moongoose.model('notes', NotesSchema);