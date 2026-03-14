// routes/Bookings.js
const express = require('express');
const router  = express.Router();
const bookingController = require('../controllers/Bookingcontroller');

router.post('/',   bookingController.createBooking);
router.get('/',    bookingController.getAllBookings);

// ✅ IMPORTANTE: /availability debe ir ANTES de /:bookingCode
// para que Express no lo interprete como un código de reserva
router.get('/availability', bookingController.getAvailability);

router.get('/user/:email',             bookingController.getBookingsByEmail);
router.get('/:bookingCode',            bookingController.getBookingByCode);
router.patch('/:bookingCode/cancel',   bookingController.cancelBooking);
router.patch('/:bookingCode/status',   bookingController.updateBookingStatus);

module.exports = router;