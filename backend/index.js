const mongoose = require('mongoose');

// MongoDB connection URL (Replace with your actual database URL)
const mongoURI = "mongodb://https://ren-car-k1ze.vercel.app/CarRentalDB";

// Connect to MongoDB
mongoose.connect(mongoURI)
.then(() => {
    console.log("MongoDB connected successfully");
})
.catch((error) => {
    console.error("MongoDB connection error:", error);
});

// Export the connection
module.exports = mongoose;
