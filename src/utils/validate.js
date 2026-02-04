const express = require('express');

const validateEditProfileData = (req)=>{

    const ALLOWED_UPDATES = [
            "photoUrl","bio","about","skills","gender","password"
        ]

       const isEditAllowed =  Object.keys(req.body).every(field => ALLOWED_UPDATES.includes(field));
 return isEditAllowed;

}

module.exports = {
    validateEditProfileData,
}