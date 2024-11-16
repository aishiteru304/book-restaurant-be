import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
    numberTable: { type: String, unique: true, require: true },
    maxSeat: { type: Number, require: true },
    status: [{ type: mongoose.Schema.Types.ObjectId, ref: 'reservation' }]
})

const tableModel = mongoose.models.table || mongoose.model('table', tableSchema)

export default tableModel