const WeeklyDetails = require('../models/weeklyModel')
const Inventory = require('../models/inventoryModel')
const Item = require('../models/itemModel')
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');

// @desc    Create new weekly details for user if it does not have one
// @route   POST '/create/:year/:week' 
// @access  Private
const createWeeklyDetails = asyncHandler(async (req, res) => {
    let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})

    if (!weeklyDetails || Details.length == 0) {
        weeklyDetails = new WeeklyDetails({
            user: req.user.id,
            week: req.params.week,
            year: req.params.year,
            itemsSold: [],
            orderReceived: [],
            orderForNextWeek: [],
        })

        await weeklyDetails.save()
        res.status(200).send(weeklyDetails)
    }
})

// @desc    Get list of items sold(this should only be necessary for previous weekly details)
// @route   GET /:year/:week/items_sold/ 
// @access  Private
const getItemsSold = asyncHandler(async (req, res) => {
    let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
    if (!weeklyDetails || weeklyDetails.length == 0) {
        res.status(400)
        throw new Error("Weekly data does not exist")
    } else {
        res.status(200).send(weeklyDetails[0].itemsSold)
    }
})

// @desc    Get order spans to populate dropdown 
// @route   GET /order_spans/
// @access  Private
const getOrderSpans = asyncHandler(async (req, res) => {
    let weeklyDetails = await WeeklyDetails.find({user: req.user.id})
    const response = []

    weeklyDetails.map(weeklyData => {
        response.push({ week: weeklyData.week, year: weeklyData.year })
    })

    res.status(200).send(response)
})


// @desc    Add to list of items sold for given week
// @route   POST /:year/:week/items_sold/
// @access  Private
const addItemSold = asyncHandler(async (req, res) => {
    let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
    
    if (!weeklyDetails || weeklyDetails.length == 0) {
        res.status(400)
        throw new Error("Weekly data does not exist")
    } else {
        weeklyDetails = weeklyDetails[0]
    }
    weeklyDetails.itemsSold.push(req.body)
    await weeklyDetails.save()

    res.status(200).send(req.body)
})

// @desc    Edit an item from list of items sold for given week
// @route   PUT /:year/:week/items_sold/
// @access  Private
const editItemSold = asyncHandler(async (req, res) => {
    
    let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
    
    if (!weeklyDetails || weeklyDetails.length == 0) {
        res.status(400)
        throw new Error("Weekly data does not exist")
    } else {
        weeklyDetails = weeklyDetails[0]
    }
    weeklyDetails.itemsSold.map((item) => {
        if (item._id.toString() == req.body._id) {
            item.name = req.body.name 
            item.type = req.body.type
            item.unit = req.body.unit
            item.volume = req.body.volume
            item.packaging = req.body.packaging
            item.quantity = req.body.quantity
            item.price = req.body.price
        }
    })
    await weeklyDetails.save()

    res.status(200).send(req.body)
})

// @desc    Delete an item from list of items sold for given week
// @route   DELETE /:year/:week/items_sold/:id
// @access  Private
const deleteItemSold = asyncHandler(async (req, res) => {
    const itemId = req.params.id
    
    let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
    
    if (!weeklyDetails || weeklyDetails.length == 0) {
        res.status(400)
        throw new Error("Weekly data does not exist")
    } else {
        weeklyDetails = weeklyDetails[0]
    }

    const items = weeklyDetails.itemsSold
    let index = -1;
    for (let i = 0; i < items.length; i++) {
        if (items[i]._id == itemId) {
            index = i;
            break;
        }
    }
    if (index != -1) {
        items.splice(index, 1)
        weeklyDetails.save()

        res.status(200).send("Deleted " + itemId)
    } else {
        res.status(400)
        throw new Error("Tried to delete " + itemId + " but item with this ID does not exist")
    }
})

// @desc    Get orders received for given week
// @route   GET /:year/:week/orders_received
// @access  Private
const getOrdersReceived = asyncHandler(async (req, res) => {
})

// @desc    Add to orders received for given week
// @route   POST /:year/:week/orders_received
// @access  Private
const addItemOrdered = asyncHandler(async (req, res) => {
})

// @desc    Edit an item in orders received for given week
// @route   PUT /:year/:week/orders_received
// @access  Private
const editItemOrdered = asyncHandler(async (req, res) => {
})

// @desc    Delete an item in orders received for given week and ID
// @route   DELETE /:year/:week/orders_received
// @access  Private
const deleteItemOrdered = asyncHandler(async (req, res) => {
})

const getItemToOrder = asyncHandler(async (req, res) => {
})

const addItemToOrder = asyncHandler(async (req, res) => {
})

const editItemToOrder = asyncHandler(async (req, res) => {
})

const deleteItemToOrder = asyncHandler(async (req, res) => {
})


module.exports = { createWeeklyDetails, getOrderSpans,
    getItemsSold, addItemSold, editItemSold, deleteItemSold, 
    getOrdersReceived, addItemOrdered, editItemOrdered, deleteItemOrdered,
    getItemToOrder, addItemToOrder, editItemToOrder, deleteItemToOrder }