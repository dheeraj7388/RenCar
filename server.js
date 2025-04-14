const express = require('express');
const mongoose = require('./index');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 5002;

// Middleware
// app.use(cors({
// //   origin: '*', // Allow all localhost ports
// //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(cors({
  origin: '*'
}));

app.use(bodyParser.json());
// Configure static file serving
app.use(express.static(path.join(__dirname, 'car-rent')));
app.use(express.static(path.join(__dirname)));

// Serve node_modules dependencies
app.use('/js/jquery', express.static(path.join(__dirname, 'node_modules/jquery/dist')));
app.use('/js/waypoints', express.static(path.join(__dirname, 'node_modules/waypoints/lib')));
app.use('/js/counterup', express.static(path.join(__dirname, 'node_modules/counterup2/dist')));

// Car Model
const carSchema = new mongoose.Schema({
    ownerName: String,
    carModel: String,
    carNumber: String,
    registrationNumber: String,
    pollutionNumber: String,
    fitness: String,
    rentPerDay: Number,
    location: String,
    imageUrl: String,
    category: String,
    seats: Number,
    transmission: String,
    fuelType: String
});

const Car = mongoose.model('Car', carSchema);

// Booking Model
const bookingSchema = new mongoose.Schema({
    carId: { type: mongoose.Schema.Types.ObjectId, ref: 'Car' },
    renterName: String,
    renterEmail: String,
    renterPhone: String,
    aadhaarNumber: String,
    dlNumber: String,
    startDate: Date,
    endDate: Date,
    request: String,
    totalCost: Number,
    status: { type: String, default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

// Cars Endpoint
app.get('/cars', async (req, res) => {
    try {
        const cars = await Car.find();
        res.json(cars);
        console.log("cars data", cars)

    } catch (error) {
        res.status(500).json({ message: 'Error fetching cars' });
    }
});

// Booking Endpoint
app.post('/bookings/:carId', async (req, res) => {
    try {
        const { carId } = req.params;
        const {
            renterName,
            renterEmail,
            renterPhone,
            aadhaarNumber,
            dlNumber,
            startDate,
            endDate,
            request,
        } = req.body;

        // Validate input
        if (!renterName || !renterEmail || !renterPhone || !aadhaarNumber || !dlNumber || !startDate || !endDate) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Get car details
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(404).json({ message: 'Car not found' });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        if (isNaN(start) || isNaN(end)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }
        if (start >= end) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        // Calculate total cost
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
        const totalCost = days * car.rentPerDay;

        // Create booking
        const booking = new Booking({
            carId,
            renterName,
            renterEmail,
            renterPhone,
            aadhaarNumber,
            dlNumber,
            startDate,
            endDate,
            request,
            totalCost
        });

        await booking.save();

        res.status(201).json({
            success: true,
            message: 'Booking created successfully',
            booking
        });

    } catch (error) {
        console.error('Booking error:', {
            message: error.message,
            stack: error.stack,
            requestBody: req.body,
            params: req.params
        });
        res.status(500).json({ 
            message: 'Error creating booking',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? {
                stack: error.stack,
                requestData: {
                    body: req.body,
                    params: req.params
                }
            } : undefined
        });
    }
});

// Car Registration Endpoint
app.post('/registerCar', async (req, res) => {
    try {
        const {
            ownerName,
            carModel,
            carNumber,
            registrationNumber,
            pollutionNumber,
            fitness,
            rentPerDay,
            location,
            imageUrl,
            category,
            seats,
            transmission,
            fuelType
        } = req.body;

        // Validate required fields
        if (!ownerName || !carModel || !carNumber || !registrationNumber || 
            !rentPerDay || !location || !imageUrl || !category || !seats || 
            !transmission || !fuelType) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        // Create new car
        const car = new Car({
            ownerName,
            carModel,
            carNumber,
            registrationNumber,
            pollutionNumber,
            fitness,
            rentPerDay,
            location,
            imageUrl,
            category,
            seats,
            transmission,
            fuelType
        });

        await car.save();

        res.status(201).json({
            success: true,
            message: 'Car registered successfully',
            car
        });

    } catch (error) {
        console.error('Registration error:', {
            message: error.message,
            stack: error.stack,
            requestBody: req.body,
            timestamp: new Date().toISOString()
        });
        
        res.status(500).json({ 
            message: 'Error registering car',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? {
                stack: error.stack,
                requestData: req.body
            } : undefined
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
