const AlcoholModel = require('../models/alcoholModel')
const mongoose = require('mongoose');

// @desc    Get alcohols
// @route   GET /api/alcohols
// @access  Private
const getAlcohols = (req, res) => {
    AlcoholModel.find({}, (err, result) => {
        if (err) {
            res.status(400).json(err);
        } else {
            res.status(200).json(result);
        }
    });
}

// @desc    Add an alcohol
// @route   POST /api/alcohols
// @access  Private
const addAlcohol = async (req, res) => {
    if (!req.body.name) {
        res.status(400);
        throw new Error('Cannot add without name')
    }
    const newAlcohol = new AlcoholModel(req.body);
    await newAlcohol.save();
    res.status(200).send(newAlcohol);
}

// @desc    Update an alcohol
// @route   PUT /api/alcohols/:id
// @access  Private
const updateAlcohol = async (req, res) => {
    try {
        await AlcoholModel.findByIdAndUpdate(req.params.id, 
            {
                name: req.body.name,
                type: req.body.type,
                volume: req.body.volume,
                unit: req.body.unit,
                quantity: req.body.quantity,
                packaging: req.body.packaging,
                price: req.body.price,
            }
        )
        
    } catch(e) {
        res.status(400)
        throw e
    }
    res.status(200).send("Updated " + req.body.name)
}

// @desc    Delete an alcohol
// @route   DELETE /api/alcohols/:id
// @access  Private
const deleteAlcohol = async (req, res) => {
    try {
        await AlcoholModel.findByIdAndDelete(req.params.id).exec()
    } catch(e) {
        res.status(400)
        throw e
    }
    res.status(200).send("Deleted " + req.params.id)
}

// @desc    Find an alcohol (by ID)
// @route   DELETE /api/alcohols/find/:id
// @access  Private
const findAlcohol = async (req, res) => {
    const id = mongoose.Types.ObjectId(req.params.id)
    const alcohol = await AlcoholModel.findById({_id:id})
    if (!alcohol) {
        res.status(400)
        throw new Error('Cannot find an item')
    } else {
        res.status(200).json(alcohol)
    }
}


module.exports = {
    getAlcohols,
    addAlcohol,
    updateAlcohol,
    deleteAlcohol,
    findAlcohol
}