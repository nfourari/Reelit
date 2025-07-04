// backend/models/Card.js
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    card: { type: String, required: true },
});

module.exports = mongoose.model('Card', cardSchema, 'Cards');
