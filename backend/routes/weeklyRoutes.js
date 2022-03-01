const express = require('express')
const router = express.Router()
const { createWeeklyDetails, getOrderSpans, 
    getItemsSold, addItemSold, editItemSold, deleteItemSold, flushItemSold,
    getOrdersReceived, addItemOrdered, editItemOrdered, deleteItemOrdered, flushItemOrdered,
    getItemToOrder, addItemToOrder, editItemToOrder, deleteItemToOrder, flushItemToOrder,
    getAllDatasForUser, getWeeklyDataForUser, setFinalizeTrue, setUpDemoData} = require('../controllers/weeklyController')

const { protect } = require('../middleware/authMiddleware')

router.route('/create/:year/:week').post(protect, createWeeklyDetails)
router.route('/order_spans').get(protect, getOrderSpans)

router.route('/:year/:week/items_sold/').get(protect, getItemsSold).post(protect,addItemSold)
    .put(protect, editItemSold).delete(protect, flushItemSold)
router.route('/:year/:week/items_sold/:id').delete(protect, deleteItemSold)

router.route('/:year/:week/orders_received').get(protect, getOrdersReceived).post(protect,addItemOrdered)
    .put(protect, editItemOrdered).delete(protect, flushItemOrdered)
router.route('/:year/:week/orders_received/:id').delete(protect, deleteItemOrdered)

router.route('/:year/:week/order').get(protect, getItemToOrder).post(protect,addItemToOrder)
    .put(protect, editItemToOrder).delete(protect, flushItemToOrder)
router.route('/:year/:week/order/:id').delete(protect,deleteItemToOrder)

router.route('/get_all_datas').get(protect, getAllDatasForUser)
router.route('/get_all_datas/:week/:year').get(protect, getWeeklyDataForUser )

router.route('/:year/:week/finalized').put(protect, setFinalizeTrue)

router.route('/demo_setup').post(protect, setUpDemoData)

module.exports = router