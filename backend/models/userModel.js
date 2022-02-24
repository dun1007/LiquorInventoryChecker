const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema(
    {
        name: { //Full name of product
            type: String,
            required: [true, 'Please add a name'],
        },
        email: { //Beer? Wine? Liquor? Cider?
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password']
        }
    },
    {
        timestamps: true,
    }
)

const User = mongoose.model("users", UserSchema)
module.exports = User