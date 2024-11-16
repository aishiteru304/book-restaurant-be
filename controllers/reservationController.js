import Reservation from "../models/reservationModel.js";
import moment from "moment/moment.js";
import Table from "../models/tableModel.js";

const createReservation = async (req, res) => {
    try {
        const { time, numberPeople, note } = req.body;
        const userId = req.userId; // Lấy từ middleware xác thực

        // Kiểm tra dữ liệu đầu vào
        if (!time || !numberPeople) {
            return res.status(400).json({ success: false, message: "Thông tin gồm thời gian và số người." });
        }

        // Chuyển chuỗi thời gian thành đối tượng Date
        const reservationTime = moment(time, "HH:mm DD-MM-YYYY").toDate();
        const currentTime = new Date();

        // Kiểm tra nếu thời gian đặt trước thời gian hiện tại
        if (reservationTime < currentTime) {
            return res.status(400).json({ success: false, message: "Không thể đặt bàn trước thời gian hiện tại" });
        }

        const tables = await Table
            .find({
                maxSeat: { $gt: numberPeople - 1 },
            })
            .sort({ maxSeat: 1 })
            .populate('status');

        // Kiểm tra xem có bàn nào không có reservation với time đã cho
        // const availableTables = tables.filter(table => {
        //     return !table.status.some(reservation => reservation.time == time);
        // });

        const availableTables = tables.filter(table => {
            return !table.status.some(reservation => {
                const reservationTime = moment(reservation.time, "HH:mm DD-MM-YYYY").toDate();;
                const targetTime = moment(time, "HH:mm DD-MM-YYYY").toDate();

                return Math.abs(reservationTime - targetTime) < 3 * 60 * 60 * 1000 // thời gian của 3h sang mili giây
            });
        });

        if (availableTables.length === 0) {
            return res.status(400).json({ success: false, message: "Không có bàn phù hợp." });
        }
        // Tạo mới một reservation
        const newReservation = new Reservation({
            userId,
            time,
            numberPeople,
            note
        });

        // // // Lưu reservation vào database
        await newReservation.save();

        // // Cập nhật status của bàn đầu tiên với id của reservation vừa tạo
        await Table.updateOne(
            { _id: availableTables[0]._id },
            { $push: { status: newReservation._id } } // Push id của reservation vào status
        );

        res.json({ success: true, message: "Đặt bàn thành công", reservation: newReservation });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có lỗi xảy ra khi đặt bàn" });
    }
};

const getAllReservation = async (req, res) => {
    try {
        // Truy vấn tất cả các đơn đặt bàn
        const reservations = await Reservation.find().populate('userId', 'name');

        res.json({ success: true, reservations });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Có lỗi xảy ra khi lấy danh sách đặt bàn." });
    }
};



export { createReservation, getAllReservation };