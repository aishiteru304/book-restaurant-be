import Table from "../models/tableModel.js";

const createTable = async (req, res) => {
    try {
        const { numberTable, maxSeat } = req.body;

        // Kiểm tra dữ liệu đầu vào
        if (!numberTable || !maxSeat) {
            return res.status(400).json({ success: false, message: "Thông tin gồm số bàn và số người có thể chứa." });
        }


        const newTable = new Table({
            numberTable,
            maxSeat
        });



        await newTable.save();

        res.json({ success: true, message: "Tạo bàn bàn thành công" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có lỗi xảy ra khi tạo bàn" });
    }
};

const getAllTable = async (req, res) => {
    try {
        // Truy vấn tất cả các bàn
        const tables = await Table.find().populate("status");

        res.json({ success: true, tables });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có lỗi xảy ra khi lấy danh sách bàn" });
    }
};

const getTableByReservationId = async (req, res) => {
    try {

        const { reservationId } = req.params;

        const table = await Table
            .findOne({ status: reservationId }) // Tìm bàn có chứa reservationId trong status
            .populate({
                path: 'status',
                match: { _id: reservationId }, // Chỉ populate reservation có _id là reservationId
                populate: {
                    path: 'userId', // Tham chiếu đến userId trong status
                    select: 'name' // Lấy trường name từ user
                }
            });

        if (!table) {
            return res.status(404).json({ success: false, message: "Không tìm thấy bàn chứa đặt bàn này." });
        }

        res.json({ success: true, table });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: "Lỗi không thể lấy thông tin từ mã đặt bàn." })

    }
}


export { createTable, getAllTable, getTableByReservationId };