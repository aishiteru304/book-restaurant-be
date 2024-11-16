import Review from "../models/reviewModel.js";


// Endpoint tạo review
const createReview = async (req, res) => {
    try {
        const { rating, comment } = req.body;
        if (!rating || !comment)
            return res.json({ success: false, message: "Đánh giá cần có rating và comment" });


        // Kiểm tra xem người dùng đã đánh giá trước đó hay chưa
        const existingReview = await Review.findOne({ userId: req.userId });

        if (existingReview) {
            return res.json({ success: false, message: "Bạn đã đánh giá trước đó." });
        }

        // Tạo review mới, sử dụng req.userId làm userId
        const newReview = new Review({
            rating,
            comment,
            userId: req.userId, // Sử dụng userId từ middleware userAuth
            time: new Date() // Thời gian tạo
        });

        await newReview.save();
        res.json({ success: true, message: "Đã đánh giá thành công." });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Không thể đánh giá." });
    }
};

// Hàm lấy tất cả review
const getAllReviews = async (req, res) => {
    try {
        // Truy vấn tất cả review và populate thêm thông tin user nếu cần
        const reviews = await Review.find().populate('userId', 'name');

        res.json({ success: true, reviews });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Không thể lấy danh sách review" });
    }
};

export { createReview, getAllReviews }