//demo payment momo by "collection link"

import crypto from 'crypto'
import axios from 'axios'
import Invoice from '../models/invoiceModel.js';

var accessKey = 'F8BBA842ECF85';
var secretKey = 'K951B6PE1waDMi640xX08PD3vg6EkVlz';
var orderInfo = 'Pay with MoMo';
var partnerCode = 'MOMO';
var redirectUrl = 'https://webhook.site/b3088a6a-2d17-4f8d-a383-71389a6c600b';
const ipnUrl = `${process.env.URL_BASIC}/api/payment/invoice`;
var requestType = "payWithMethod";
// var amount = '1000';
// var orderId = partnerCode + new Date().getTime();
// var requestId = orderId;
var orderGroupId = '';
var autoCapture = true;
var lang = 'vi';

//before sign HMAC SHA256 with format
//accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType





const createPaymentLink = async (req, res) => {
    try {

        let orderId = partnerCode + new Date().getTime();
        let requestId = orderId;

        const { amount, reservationId } = req.body;

        if (!amount || !reservationId)
            return res.json({ success: false, message: "Không đủ thông tin để thanh toán." })

        const extraData = Buffer.from(JSON.stringify({ reservationId })).toString('base64');

        var rawSignature =
            'accessKey=' +
            accessKey +
            '&amount=' +
            amount +
            '&extraData=' +
            extraData +
            '&ipnUrl=' +
            ipnUrl +
            '&orderId=' +
            orderId +
            '&orderInfo=' +
            orderInfo +
            '&partnerCode=' +
            partnerCode +
            '&redirectUrl=' +
            redirectUrl +
            '&requestId=' +
            requestId +
            '&requestType=' +
            requestType;

        //signature
        var signature = crypto.createHmac('sha256', secretKey)
            .update(rawSignature)
            .digest('hex');


        const requestBody = JSON.stringify({
            partnerCode: partnerCode,
            partnerName: 'Test',
            storeId: 'MomoTestStore',
            requestId: requestId,
            amount: amount,
            orderId: orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            lang: lang,
            requestType: requestType,
            autoCapture: autoCapture,
            extraData: extraData,
            orderGroupId: orderGroupId,
            signature: signature
        });

        const options = {
            method: 'POST',
            url: 'https://test-payment.momo.vn/v2/gateway/api/create',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(requestBody),
            },
            data: requestBody,
        };

        const result = await axios(options);
        return res.json({ success: true, link: result.data });

    } catch (error) {
        console.error(error);
        return res.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};

const createInvoice = async (req, res) => {
    try {
        // const result = await req.json()
        const { extraData, amount } = req.body;
        const decodedExtraData = Buffer.from(extraData, 'base64').toString('utf-8');
        const parsedData = JSON.parse(decodedExtraData);
        const { reservationId } = parsedData
        // console.log(amount)
        // console.log(reservationId)

        const newInvoice = new Invoice({
            reservationId: reservationId._id,
            paid: amount
        });

        await newInvoice.save();

        return res.json({ success: true, message: "Thanh toán thành công." });
    } catch (error) {
        console.error(error);
        return res.json({ message: 'Internal Server Error' }, { status: 500 });
    }
};

export { createPaymentLink, createInvoice }

