const mongoose = require('mongoose');

const AlcohoSchema = new mongoose.Schema({
    name: { //Full name of product
        type: String,
        required: true,
    },
    type: { //Beer? Wine? Liquor? Cider?
        type: String,
        required: true,
    },
    unit: { //What is the minimum amount you can order? 
        type: Number,
        required: true,
    },
    volume: { //How much liquid is in it?(in mL)
        type: Number,
        required: true,
    },
    
});

const AlcoholModel = mongoose.model("alcohols", AlcohoSchema);
module.exports = AlcoholModel;