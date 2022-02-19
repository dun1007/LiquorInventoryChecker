const express = require("express");
const app = express();
const mongoose = require('mongoose');
const AlcoholModel = require('./models/Alcohols');

const cors = require('cors');

app.use(express.json());
app.use(cors());

mongoose.connect(
    "mongodb+srv://inventorymanager:inventorymanager@inventorymanager.djx7m.mongodb.net/alcoholinventory?retryWrites=true&w=majority"
); 

app.get("/getAlcohols", (req, res) => {
    AlcoholModel.find({}, (err, result) => {
        if (err) {
            res.json(err);
        } else {
            res.json(result);
        }
    });
});

app.post("/addAlcohol", async (req, res) => {
    const alcohol = req.body;
    const newAlcohol = new AlcoholModel(alcohol);
    await newAlcohol.save();

    res.json(alcohol);
});

app.listen(3001,() => {
    console.log("SERVER IS UP");
});
