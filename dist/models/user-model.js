"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const movieSchema = new mongoose_1.Schema({
    adult: { type: Boolean, required: true },
    backdrop_path: { type: String, required: true },
    genre_ids: [{ type: Number, required: true }],
    id: { type: Number, required: true },
    media_type: { type: String },
    original_language: { type: String, required: true },
    original_title: { type: String },
    overview: { type: String, required: true },
    popularity: { type: Number, required: true },
    poster_path: { type: String, required: true },
    release_date: { type: String },
    title: { type: String, required: true },
    video: { type: Boolean, required: true },
    vote_average: { type: Number, required: true },
    vote_count: { type: Number, required: true },
});
const UserSchema = new mongoose_1.Schema({
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    isActivated: { type: Boolean, default: false },
    activationLink: { type: String },
    plan: {
        type: {
            name: { type: String, required: true },
            monthlyPrice: { type: Number, required: true },
            videoQuality: { type: String, required: true },
            resolution: { type: String, required: true },
            multideviceViewing: { type: Boolean, required: true },
        },
        default: {
            name: 'Basic',
            videoQuality: 'Good',
            monthlyPrice: 4.99,
            resolution: '720p',
            multideviceViewing: true
        },
    },
    watchLaterMovies: {
        type: [movieSchema],
        default: [],
        required: true,
    },
    likedMovies: {
        type: [movieSchema],
        default: [],
        required: true,
    }
});
exports.default = (0, mongoose_1.model)('User', UserSchema);
//# sourceMappingURL=user-model.js.map