require('dotenv').config(); 

module.exports = {
    secret: process.env.AUTH_SECRET || "fallback_secret_key" 
};
