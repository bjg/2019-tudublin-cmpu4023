const express = require('express');
const router = express.Router();
const db = require('../config/database');
const purchase_items = require('../models/purchase_items');
const path = require('path');

router.get('/',(req, res) => 
purchase_items.findAll()
    .then(purchase_items => res.json(purchase_items))
)
    

    


module.exports = router;