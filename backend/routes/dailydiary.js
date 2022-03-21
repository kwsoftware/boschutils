const express = require('express');
const DailyDiary = require('../models/DailyDiary');
const router = express.Router(); 


// Create a User using: POST "/api/dailydiary/". Doesn't require Auth
router.post('/', (req, res)=>{ 
    console.log(req.body);
    const user = DailyDiary(req.body);
    user.save()
    res.send(req.body);
} )

module.exports = router