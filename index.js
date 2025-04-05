const mongoose = require('mongoose');

// MongoDB connection URL (Replace with your actual database URL)
const mongoURI = "mongodb+srv://ujjawalsingh7388:nBayv1SaCP5L4FXE@dheeraj.y4iijro.mongodb.net/CarRegistrationData"; 

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
