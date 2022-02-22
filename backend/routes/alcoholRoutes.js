const express = require('express')
const router = express.Router()
const {getAlcohols, addAlcohol, updateAlcohol, deleteAlcohol, findAlcohol} = require('../controllers/alcoholController')

router.route('/').get(getAlcohols).post(addAlcohol)
router.route('/:id').put(updateAlcohol).delete(deleteAlcohol)
router.route('/find/:id').get(findAlcohol)
/* 
route() method allows to clear up code
router.get('/', getAlcohols)
router.post('/', addAlcohol)
router.put('/:id', updateAlcohol)
router.delete('/:id', deleteAlcohol)
*/


module.exports = router