const express = require('express');
const DailyDiary = require('../models/DailyDiary');
const router = express.Router(); 
const fetchuser = require('../middleware/fetchuser');
const { body, validationResult } = require('express-validator');

// Route 1 : get all records using: GET "/api/auth/getrecords". Login required

router.get('/getrecords',fetchuser, async (req, res)=>{ 
    try {
        const records = await DailyDiary.find({user: req.user})
        res.json(records);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server error');
    }
} )
// Route 2 : add record using: POST "/api/auth/addrecord". Login required

router.post('/addrecord', fetchuser, [
    body('machineno','entervalid machine number').isLength({min: 5 }),
    body('faultdescription','enter correct fault').isLength({min:5}),
],async (req, res)=>{ 
    try {
        
        const {shift, machineno, faultdescription, action, actionby, status, remark} = req.body;
        // If there are errors, return bad request and errors
        const errors = validationResult(req);
        if (!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()});
        }
        const record = new DailyDiary({
            shift, machineno, faultdescription, action, actionby, status, remark, userid: req.user.id
        })
        const savedrecord = await record.save();
        res.json(savedrecord);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server error');
    }
} )

module.exports = router