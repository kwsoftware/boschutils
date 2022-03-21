const express = require('express');
const SpindleHistory = require('../models/SpindleHistory');
const router = express.Router(); 


// Create a User using: POST "/api/spindlehistory/". Doesn't require Auth
router.post('/', (req, res)=>{ 
    console.log(req.body);
    const user = SpindleHistory(req.body);
    user.save()
    res.send(req.body);
} )

module.exports = router