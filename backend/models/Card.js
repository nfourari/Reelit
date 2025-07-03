// backend/models/Card.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    userID: { type: Number, required: true },
    card: { type: String, required: true },
});

module.exports = mongoose.model('Card', cardSchema, 'Cards');
