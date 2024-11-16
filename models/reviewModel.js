import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, require: true },
    comment: { type: String, require: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', unique: true },
    time: { type: Date, default: Date.now } // Trường `time` lưu thời gian tạo
})

const reviewModel = mongoose.models.review || mongoose.model('review', reviewSchema)

export default reviewModel