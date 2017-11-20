'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const challengerSchema = new Schema({
  challengerName: String,
  owner: {
    type: ObjectId,
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
  timelimit: Date,
  enrolled: {
    type: ObjectId,
    ref: 'User'
  }
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }
});

const Challenger = mongoose.model('Challenger', challengerSchema);

module.exports = Challenger;
