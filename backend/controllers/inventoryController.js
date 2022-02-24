const Inventory = require('../models/inventoryModel')
const Item = require('../models/itemModel')
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler')

// To access items, InventoryModel.items
// To access userid, InventoryModel.userid

// @desc    Get items of logged on user
// @route   GET /api/inventory
// @access  Private
const getItems = asyncHandler(async (req, res) => {
    const inventory = await Inventory.find({user: req.user.id})
    if (inventory.length == 0) {
        res.status(200).send([])
    } else {
        res.status(200).send(inventory[0].items)
    }
})

// @desc    Add an item to user's inventory
// @route   POST /api/inventory
// @access  Private
const addItem = asyncHandler(async (req, res) => {
    const id = req.user.id

    // Try to find user's inventory and ready the item
    let aInventory = await Inventory.find({user:id})
    const aItem = new Item(req.body)
    
    // Do we need to create inventory for user first? Otherwise, access first index
    if (aInventory.length == 0) {
        aInventory = new Inventory({user:id, })    
    } else {
        aInventory = aInventory[0]
    }
    aInventory.items.push(aItem)
    aInventory.save()

    res.status(200).send("Added")
})

// @desc    Update properties of an item
// @route   PUT /api/inventory/:id
// @access  Private
const updateItem = asyncHandler(async (req, res) => {
    const id = req.user.id
    const itemId = req.params.id

    const inventory = await Inventory.find({user:id})
    inventory[0].items.map((item) => {
        if (item._id == itemId) {
            item.name = req.body.name 
            item.type = req.body.type
            item.unit = req.body.unit
            item.volume = req.body.volume
            item.packaging = req.body.packaging
            item.quantity = req.body.quantity
            item.price = req.body.price
        }
    })
    inventory[0].save()

    res.status(200).send("Updated")
})

// @desc    Delete an item
// @route   DELETE /api/inventory/:id
// @access  Private
const deleteItem = asyncHandler(async (req, res) => {
    const id = req.user.id
    const itemId = req.params.id

    const inventory = await Inventory.find({user:id})

    const items = inventory[0].items
    let index = -1;
    for (let i = 0; i < items.length; i++) {
        if (items[i]._id == itemId) {
            index = i;
            break;
        }
    }
    if (index != -1) {
        items.splice(index, 1)
        inventory[0].save()

        res.status(200).send("Deleted " + id)
    } else {
        res.status(400)
        throw new Error("Tried to delete " + id + " but item with this ID does not exist")
    }
})

// @desc    Find an item (by ID)
// @route   GET /api/inventory/:id
// @access  Private
const findItem = asyncHandler(async (req, res) => {
    const id = req.user.id
    const itemId = req.params.id
    
    const inventory = await Inventory.find({user:id})

    inventory[0].items.map((item) => {
        if (item._id == itemId) {
            res.status(200).send(item)
        }
    })
})


module.exports = {
    getItems,
    addItem,
    updateItem,
    deleteItem,
    findItem
}