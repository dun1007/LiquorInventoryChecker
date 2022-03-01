const Inventory = require('../models/inventoryModel')
const asyncHandler = require('express-async-handler')



// @desc    Set up demo account 
// @route   POST /api/inventory/demo_setup
// @access  Private
const setUpDemoData = asyncHandler(async (req, res) => {
    console.log("Setting up demo inventory")
    await Inventory.deleteMany({user: req.user.id})
    console.log("Removed previous instances of inventory")
    try {
        let inventory = new Inventory({user:req.user.id, })  
        inventory.save()
    } catch (e) {
        throw e
    }
    res.status(200).send("Setup demo data complete")
})


// @desc    Create inventory for user for first time
// @route   POST /api/inventory/create
// @access  Private
const createInventory = asyncHandler(async (req, res) => {

    let inventory = await Inventory.find({user:req.user.id})

    if (inventory.length == 0) {

        const inventory = await new Inventory({user:req.user.id, })  
        inventory.save()
        res.status(200).send("Inventory created for user " + user.name)
    } else {
        res.status(200).send("User already exists")
    }
})

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

    // Do we need to create inventory for user first? Otherwise, access first index
    if (aInventory.length == 0) {
        aInventory = new Inventory({user:id, })    
    } else {
        aInventory = aInventory[0]
    }
    aInventory.items.push(req.body)
    aInventory.save()

    res.status(200).send(req.body)
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


// @desc    Update whole inventory
// @route   PUT /api/inventory/all
// @access  Private
const updateInventory = asyncHandler(async (req, res) => {
    const id = req.user.id

    const inventory = await Inventory.find({user:id})
    inventory[0].items = req.body
    inventory[0].save()
    res.status(200).send(inventory[0].items)
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
    findItem,
    updateInventory,
    createInventory,
    setUpDemoData
}