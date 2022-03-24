const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// Create a User using: POST "/api/auth/". Doesn't require Auth
router.post('/', [
    body('name', 'Name should be at least 5 characters').isLength({ min: 5 }),
    body('empno', 'enter a valid Employee Number').isLength({min: 8}),
    body('password', 'Password should be at least 5 Characters').isLength({ min: 5 })
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    User.create({
        name: req.body.name,
        empno: req.body.empno,
        password: req.body.password,
    }).then(user => res.json(user))
    .catch(err => {console.log(err)
    res.json({error:'please enter unique value for empno',message:err.message})});

});

module.exports = router