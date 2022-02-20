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
    res.send(newAlcohol);

});

app.put("/updateAlcohol", async (req, res) => {
    const id = req.body.id;
    const newName = req.body.name;
    const newType = req.body.type;
    const newVolume = req.body.volume;
    const newUnit = req.body.unit;
    const newQuantity = req.body.quantity;
    const newPackaging = req.body.packaging;
    const newPrice = req.body.price;

    try {
        await AlcoholModel.findByIdAndUpdate(id, 
            {
                name: newName,
                type: newType,
                volume: newVolume,
                unit: newUnit,
                quantity: newQuantity,
                packaging: newPackaging,
                price: newPrice,
            }
        )

    } catch(e) {
        console.log(e);
    }

    res.send("Update finished");
});

app.delete("/deleteAlcohol/:id", async (req, res)=> {
    const id = req.params.id;
    //await AlcoholModel.findByIdAndRemove
    await AlcoholModel.findByIdAndRemove(id).exec();
    
    res.send("Item deleted");
});

app.listen(3001,() => {
    console.log("SERVER IS UP");
});

