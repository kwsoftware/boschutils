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
// Route 3 : Update existing record using: PUT "/api/auth/updaterecord". Login required

router.put('/updaterecord/:id', fetchuser,async (req, res)=>{
    const {shift, machineno, faultdescription, action, actionby, status, remark} = req.body;
    try {
        //Create a newRecord object
        const newRecord = {};
        if(shift){newRecord.shift = shift};
        if(machineno){newRecord.machineno = machineno};
        if(faultdescription){newRecord.faultdescription = faultdescription};
        if(action){newRecord.action = action};
        if(actionby){newRecord.actionby = actionby};
        if(status){newRecord.status = status};
        if(remark){newRecord.remark = remark};
    
        // find the record to be updated and update it.
        let record = await DailyDiary.findById(req.params.id);
        if(!record){return res.status(404).send("not found")};
        // console.log(JSON.stringify(record.userid).toString())
        // console.log((req.user.id).toString())
    
        if(record.userid.toString() !== req.user.id){
            return res.status(401).send("not allowed");
        }
    
        record = await DailyDiary.findByIdAndUpdate(req.params.id,{$set: newRecord},{new:true});
        res.json(record);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server error');
    }


})
// Route 4 : delete existing record using: DELETE "/api/dailydiary/deleterecord". Login required

router.delete('/deleterecord/:id', fetchuser,async (req, res)=>{
    try {
        // find the record to be deleted and delete it.
        let record = await DailyDiary.findById(req.params.id);
        if(!record){return res.status(404).send("not found")};
        // console.log(JSON.stringify(record.userid).toString())
        // console.log((req.user.id).toString())
    
        if(record.userid.toString() !== req.user.id){
            return res.status(401).send("not allowed");
        }
    
        record = await DailyDiary.findByIdAndDelete(req.params.id);
        res.json({"Success":"Record has been deleted",record:record});
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server error');
    }


})
module.exports = router