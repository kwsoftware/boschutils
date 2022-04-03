const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "Iamtheboss";

// Route 1 : Create a User using: POST "/api/auth/". Doesn't require Auth
router.post('/CreateUser', [
    body('name', 'Name should be at least 5 characters').isLength({ min: 5 }),
    body('empno', 'enter a valid Employee Number').isLength({ min: 8 }),
    body('password', 'Password should be at least 5 Characters').isLength({ min: 5 })
], async (req, res) => {
    //if there are errors, return bad request and error
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //Check whether the user with same emp no already exist
        let user = await User.findOne({ empno: req.body.empno });
        if (user) {
            return res.status(400).json({ error: "Sorry User with this empno already exist" });
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
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server error');

    }


});

// Route 2 :Authenticate a User using : POST "/api/auth/login". No Login required
router.post('/login', [
    body('empno', 'Enter a valid Employee Number').isNumeric(),
    body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
    // if there are error, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { empno, password } = req.body;
    try {
        let user = await User.findOne({ empno });
        if (!user) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        const passwordcompare = await bcrypt.compare(password, user.password);
        if (!passwordcompare) {
            return res.status(400).json({ error: "Please try to login with correct credentials" });
        }
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET);
        res.json({ authtoken });

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server error');

    }
});

//Route 3 : Get loggedin user details using: POST "api/auth/getuser". Login required
router.post('/getuser',fetchuser, async(req,res)=>{
    try {
        userId = req.user.id;
        const user = await User.findById(userId).select("-password")
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Internal Server error');
    }
})

module.exports = router