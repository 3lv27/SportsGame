'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const challengerSchema = new Schema({
    challengerName: String,
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    location: {
        latitud: Number,
        longitud: Number
    },
    sports: {
        type: [String],
        enum: ['SkateBoarding', 'BMX', 'Parkour', 'Fitness', 'RollerSkating']
    },
    description: String,
    linkValidation: String,
    timeLimit: Date,
    enrolled: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Challenger = mongoose.model('Challenger', challengerSchema);

module.exports = Challenger;