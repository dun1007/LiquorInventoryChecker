const WeeklyDetails = require('../models/weeklyModel')
const asyncHandler = require('express-async-handler');

// @desc    Create new weekly details for user if it does not have one
// @route   POST '/create/:year/:week' 
// @access  Private
const createWeeklyDetails = asyncHandler(async (req, res) => {
    let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})

    if (!weeklyDetails || weeklyDetails.length == 0) {
        weeklyDetails = new WeeklyDetails({
            user: req.user.id,
            week: req.params.week,
            year: req.params.year,
            itemsSold: [],
            orderReceived: [],
            orderForNextWeek: [],
        })

        await weeklyDetails.save()
        res.status(200).send("Initiated weekly details: Week " + req.params.week + ", year " + req.params.year  + " for user " + req.user.id)
    }
})

// @desc    Get order spans for given ID 
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

    //are we supposed to add batch items?
    if (Array.isArray(req.body)) {
        weeklyDetails.itemsSold = weeklyDetails.itemsSold.concat(req.body)
    } else {
        weeklyDetails.itemsSold.push(req.body)
    }
    await weeklyDetails.save()

    res.status(200).send("Succesfully added an item to Items Sold")
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

// @desc    Delete all items in items sold for given week and ID
// @route   DELETE /:year/:week/items_sold
// @access  Private
const flushItemSold = asyncHandler(async (req, res) => {
	let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
	
	if (!weeklyDetails || weeklyDetails.length == 0) {
			res.status(400)
			throw new Error("Weekly data does not exist")
	} else {
			weeklyDetails = weeklyDetails[0]
	}

	weeklyDetails.itemsSold = []
	weeklyDetails.save()
})

// @desc    Get orders received for given week
// @route   GET /:year/:week/orders_received
// @access  Private
const getOrdersReceived = asyncHandler(async (req, res) => {
    let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
    if (!weeklyDetails || weeklyDetails.length == 0) {
        res.status(400)
        throw new Error("Weekly data does not exist")
    } else {
        res.status(200).send(weeklyDetails[0].orderReceived)
    }
})

// @desc    Add to orders received for given week
// @route   POST /:year/:week/orders_received
// @access  Private
const addItemOrdered = asyncHandler(async (req, res) => {
    let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
    
    if (!weeklyDetails || weeklyDetails.length == 0) {
        res.status(400).send(null)
        //throw new Error("Weekly data does not exist")
    } else {
        weeklyDetails = weeklyDetails[0]
    }

		if (Array.isArray(req.body)) {
			req.body.map((item) => {
				weeklyDetails.orderReceived.push(item)
			})
		} else {
			weeklyDetails.orderReceived.push(req.body)
		}
    await weeklyDetails.save()

    res.status(200).send(req.body)
})

// @desc    Edit an item in orders received for given week
// @route   PUT /:year/:week/orders_received
// @access  Private
const editItemOrdered = asyncHandler(async (req, res) => {
    let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
    
    if (!weeklyDetails || weeklyDetails.length == 0) {
        res.status(400)
        throw new Error("Weekly data does not exist")
    } else {
        weeklyDetails = weeklyDetails[0]
    }
    weeklyDetails.orderReceived.map((item) => {
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

// @desc    Delete an item in orders received for given week and ID
// @route   DELETE /:year/:week/orders_received/:id
// @access  Private
const deleteItemOrdered = asyncHandler(async (req, res) => {
    const itemId = req.params.id
    
    let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
    
    if (!weeklyDetails || weeklyDetails.length == 0) {
        res.status(400)
        throw new Error("Weekly data does not exist")
    } else {
        weeklyDetails = weeklyDetails[0]
    }

    const items = weeklyDetails.orderReceived
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

// @desc    Delete all items in orders received for given week and ID
// @route   DELETE /:year/:week/orders_received
// @access  Private
const flushItemOrdered = asyncHandler(async (req, res) => {
	const itemId = req.params.id
	let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
	
	if (!weeklyDetails || weeklyDetails.length == 0) {
			res.status(400)
			throw new Error("Weekly data does not exist")
	} else {
			weeklyDetails = weeklyDetails[0]
	}

	weeklyDetails.orderReceived = []
	weeklyDetails.save()
})

// @desc    Get the next order 
// @route   GET /:year/:week/order
// @access  Private
const getItemToOrder = asyncHandler(async (req, res) => {
	let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})

    if (!weeklyDetails || weeklyDetails.length == 0) {
			res.status(400)
			throw new Error("Weekly data does not exist")
	} else {
		res.status(200).send(weeklyDetails[0].orderForNextWeek)
	}
})

// @desc    Add to next week's order for given week
// @route   POST /:year/:week/order
// @access  Private
const addItemToOrder = asyncHandler(async (req, res) => {
	let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
    
	if (!weeklyDetails || weeklyDetails.length == 0) {
			res.status(400).send(null)
			//throw new Error("Weekly data does not exist")
	} else {
			weeklyDetails = weeklyDetails[0]
	}

	if (Array.isArray(req.body)) {
		req.body.map((item) => {
			weeklyDetails.orderForNextWeek.push(item)
		})
	} else {
		weeklyDetails.orderForNextWeek.push(req.body)
	}
	await weeklyDetails.save()

	res.status(200).send(req.body)
})

// @desc    Edit an item in next week's order for given week
// @route   PUT /:year/:week/order
// @access  Private
const editItemToOrder = asyncHandler(async (req, res) => {
	let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
	
	if (!weeklyDetails || weeklyDetails.length == 0) {
			res.status(400)
			throw new Error("Weekly data does not exist")
	} else {
			weeklyDetails = weeklyDetails[0]
	}
    
	weeklyDetails.orderForNextWeek.map((item) => {
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

// @desc    Delete an item in next week's order for given week and ID
// @route   DELETE /:year/:week/order/:id
// @access  Private
const deleteItemToOrder = asyncHandler(async (req, res) => {
		const itemId = req.params.id
		
		let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
		
		if (!weeklyDetails || weeklyDetails.length == 0) {
				res.status(400)
				throw new Error("Weekly data does not exist")
		} else {
				weeklyDetails = weeklyDetails[0]
		}

		const items = weeklyDetails.orderForNextWeek
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

// @desc    Delete all items in next week's order for given week
// @route   DELETE /:year/:week/order/
// @access  Private
const flushItemToOrder = asyncHandler(async (req, res) => {
	const itemId = req.params.id
	
	let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
	
	if (!weeklyDetails || weeklyDetails.length == 0) {
			res.status(400)
			throw new Error("Weekly data does not exist")
	} else {
			weeklyDetails = weeklyDetails[0]
	}
	weeklyDetails.orderForNextWeek = []
	weeklyDetails.save()
	res.status(200).send("Deleted all")
})

// @desc    Get every weekly data for user
// @route   GET /get_all_datas
// @access  Private
const getAllDatasForUser = asyncHandler(async (req, res) => {
	let weeklyDetails = await WeeklyDetails.find({user: req.user.id})
	if (!weeklyDetails || weeklyDetails.length == 0) {
			res.status(400)
			throw new Error("Weekly data does not exist")
	} else {
		res.status(200).send(weeklyDetails)
	}
})

// @desc    Get every data for given week
// @route   GET /get_all_datas/:week/:year
// @access  Private
const getWeeklyDataForUser = asyncHandler(async (req, res) => {
	let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
	if (!weeklyDetails || weeklyDetails.length == 0) {
			res.status(400)
			throw new Error("Weekly data does not exist")
	} else {
		res.status(200).send(weeklyDetails)
	}
})

// @desc    Finalize the week for given weekspan
// @route   PUT /:year/:week/finalized
// @access  Private
const setFinalizeTrue = asyncHandler(async (req, res) => {
	let weeklyDetails = await WeeklyDetails.find({user: req.user.id, week: req.params.week, year: req.params.year})
	if (!weeklyDetails || weeklyDetails.length == 0) {
			res.status(400)
			throw new Error("Weekly data does not exist")
	} else {
        weeklyDetails = weeklyDetails[0]
	}
    weeklyDetails.isFinalized = true
    weeklyDetails.save()
    res.status(200).send("Week " + req.parms.week + " is now final")
})

// @desc    Set up demo account 
// @route   POST /demo_setup
// @access  Private
const setUpDemoData = asyncHandler(async (req, res) => {
    console.log("Setting up demo weekly details")
    await WeeklyDetails.deleteMany({user: req.user.id}) //flush first
    console.log("Deleted previous instances of weekly details")
    let newYearAndWeek = getPrevYearAndYear(req.body.week, req.body.year)

    try {
        let latestWeeklyDetails = await new WeeklyDetails({...req.body, orderReceived: [], orderForNextWeek: []})
        console.log("Created weekly details for " + latestWeeklyDetails.week)
        await latestWeeklyDetails.save()
        for (let i=0; i<5; i++) {
            let weeklyDetails = await new WeeklyDetails({
                ...req.body,
                week: newYearAndWeek.week, 
                year: newYearAndWeek.year,
                itemsSold: randomizeQuantity(req.body.itemsSold),
                orderReceived: randomizeQuantity(req.body.orderReceived),
                orderForNextWeek: randomizeQuantity(req.body.orderForNextWeek),                
            })
            await weeklyDetails.save()
            console.log("Created weekly details for " + weeklyDetails.week)
            newYearAndWeek = getPrevYearAndYear(newYearAndWeek.week, newYearAndWeek.year)
        }

        res.status(200).send("Setup demo data complete")
    } catch (e) {
        throw e
    }
})

// Helper functions
const getPrevYearAndYear = (week, year) => {
    return week == 1 ? { week: 52, year: year-1} : { week: week-1, year: year}
}

const randomIntFromInterval = (min, max) => { 
    return Math.ceil(Math.random() * (max - min + 1) + min)
}

const randomizeQuantity = (items) => {
    return items.map((item) => {
        return {
            ...item,
            quantity: randomIntFromInterval(1, item.quantity)
        }
    })
}
module.exports = { createWeeklyDetails, getOrderSpans,
    getItemsSold, addItemSold, editItemSold, deleteItemSold, flushItemSold,
    getOrdersReceived, addItemOrdered, editItemOrdered, deleteItemOrdered, flushItemOrdered,
    getItemToOrder, addItemToOrder, editItemToOrder, deleteItemToOrder, flushItemToOrder,
    getAllDatasForUser, getWeeklyDataForUser, setFinalizeTrue, setUpDemoData }