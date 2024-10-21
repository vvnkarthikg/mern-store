//passwords must be encrypted, so use bcrypt
//bcrypt operation is irreversible

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const checkAuth = require('../middlewares/check-auth');
const user = require("../models/user");

router.post("/signup", (req, res) => {
  if(!req.body.email || !req.body.password){
    return res.status(400).json({message : "Provide the req details"});
  }
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
          return res.status(500).send({ message: 'Error hashing password' });
        }
    
        const newUser = new user({
          email:req.body.email,
          password: hash,
          isAdmin : req.body.isAdmin
        });
    
        newUser
          .save()
          .then(() => {
            res.status(201).json({ message: 'User created successfully' });
          })
          .catch((err) => {
            if (err.code === 11000) { // MongoDB duplicate key error code
              return res.status(409).json({ message: 'Email already exists' });
            }
            console.log(err);
            res.status(500).json({ error: 'Error saving user' });
          });
      });
});

//generating jwt 

router.post('/signin', (req, res) => {
  if(!req.body.email || !req.body.password){
    return res.status(400).json({message : "Provide the req details"});
  }

  user.find({ email: req.body.email })
    .then(users => {
      if (users.length === 0) {
        return res.status(401).json({ message: 'Email not found' });
      }
      bcrypt.compare(req.body.password, users[0].password, (err, result) => {
        if (err) {
          return res.status(500).json({ message: 'Error comparing passwords' });
        }
        if (!result) {
          return res.status(401).json({ message: 'Invalid password' });
        }
        const token = jwt.sign({
           userId: users[0]._id,
           isAdmin : users[0].isAdmin
        }, process.env.JWT_KEY, {
          expiresIn: "1h"
        });
        return res.status(200).json({ message:"signed in successfully",
          token,
          isAdmin: users[0].isAdmin
         });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ message: 'Server error' });
    });
});


router.get('/profile', checkAuth, async (req, res) => {
  try {
      const userId = req.userData.userId; // Assuming you have middleware that sets this
      const userProfile = await user.findById(userId).select('-password'); // Exclude password from response

      if (!userProfile) {
          return res.status(404).json({ message: 'User not found' });
      }

      res.status(200).json({
          id: userProfile._id,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          email: userProfile.email,
          profilePicture: userProfile.profilePicture,
          dateOfBirth: userProfile.dateOfBirth,
          createdAt: userProfile.createdAt,
          updatedAt: userProfile.updatedAt
      });


  } catch (error) {
      res.status(500).json({ message: error.message });
  }
});

// Patch route to update user details
// Assuming you have already imported necessary modules
router.patch('/', checkAuth, async (req, res) => {
  try {
      const { email, updateFields } = req.body;

      // Ensure email is provided and updateFields is not empty
      if (!email || !updateFields || Object.keys(updateFields).length === 0) {
          return res.status(400).json({ message: "Provide the email and details to update" });
      }

      // Find the user by email and update specified fields
      const updatedUser = await user.findOneAndUpdate(
          { email }, // Find user by email
          { $set: updateFields }, // Update fields specified in updateFields
          { new: true, runValidators: true } // Return the updated document
      );

      if (!updatedUser) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Return updated user data excluding sensitive information
      const { password, ...userData } = updatedUser.toObject(); // Exclude password
      res.status(200).json({ message: 'User updated successfully', user: userData });
  } catch (error) {
      console.error('Error updating user:', error); // Log error for debugging
      res.status(500).json({ message: error.message });
  }
});




router.delete('/',checkAuth,async(req,res)=>{
  try {
    if(!req.body.email ){
      return res.status(400).json({message : "Provide the req details"});
    }
      const deleted = await user.findOneAndDelete({email:req.body.email});

      if (!deleted) {
          return res.status(404).send({ message: 'user not found' });
      }

      res.status(200).send({ message: 'user deleted successfully' });
  } catch (error) {
      res.status(500).send({ message: error.message });
  }
});


router.delete('/:id',checkAuth,async(req,res)=>{
    try {
      
        const { id } = req.params;
        const deleted = await user.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).send({ message: 'user not found',
              id});
        }

        res.status(200).send({ message: 'user deleted successfully' ,id});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});




module.exports = router;
