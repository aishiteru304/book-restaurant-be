import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', require: true },

    // Kiểu là : "HH:mm DD-MM-YYYY"
    // Ví dụ: 08:00 24-10-2024
    time: { type: String, require: true },

    numberPeople: { type: Number, require: true },
    note: { type: String },
})

const reservationModel = mongoose.models.reservation || mongoose.model('reservation', reservationSchema)

export default reservationModel