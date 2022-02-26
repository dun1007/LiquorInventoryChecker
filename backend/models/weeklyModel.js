const mongoose = require('mongoose')

const ItemSchema = new mongoose.Schema(
    {
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
            default: 0,
        },
        volume: { //How much liquid is in it?(in mL)
            type: Number,
            default: 0,
        },
        packaging: {
            type: String,
            default: "",
        },
        quantity: {
            type: Number,
            default: 0,
        },
        price: {
            type: Number,
            default: 0,
        },   
    },
)

const WeeklySchema = new mongoose.Schema(
    {
        user: { //The owning user's name (hexcode)
            type: mongoose.Schema.Types.ObjectId,
            required: [true, 'Need user ID'],
            ref: 'User',
        },
        year: { type: Number, required: [true, 'Need year which this date was created']},
        week: { type: Number, required: [true, 'Need which week this data is about']},
        itemsSold: [ItemSchema],
        orderReceived: [ItemSchema],
        ordeForNextWeek: [ItemSchema],
    },{ timestamps: true, }
)

const WeeklyDetails = mongoose.model('weeklydetails', WeeklySchema)
module.exports = WeeklyDetails