const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT_SECRET = "Iamtheboss";

// Create a User using: POST "/api/auth/". Doesn't require Auth
router.post('/CreateUser', [
    body('name', 'Name should be at least 5 characters').isLength({ min: 5 }),
    body('empno', 'enter a valid Employee Number').isLength({min: 8}),
    body('password', 'Password should be at least 5 Characters').isLength({ min: 5 })
], async(req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try{
        //Check whether the user with same emp no already exist
        let user = await User.findOne({empno:req.body.empno});
        if (user) {
            return res.status(400).json({error:"Sorry User with this empno already exist"});
        }
        const salt = await bcrypt.genSalt(10);
        const secPass = await bcrypt.hash(req.body.password, salt);
        // Create new User
        user = await User.create({
            name: req.body.name,
            empno: req.body.empno,
            password: secPass,
        });
        const data = {
            user:{
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({authtoken});

    }catch(error){
        console.error(error.message);
        res.status(500).send('Some error occured');

    }
    

});

module.exports = router