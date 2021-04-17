var mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcrypt');
const confiq=require('../config/config').get(process.env.NODE_ENV);
const salt=10;

//defining schema
const dataSchema=mongoose.Schema({
    procedure:{
        type: String,
    },
    timestamp:{
        type: Number,
    },
    value:{
        type : Number,
    }
});


//exporting the schema model 
module.exports=mongoose.model('Data',dataSchema);