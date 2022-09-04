const options = {
    auth: {
        api_key: process.env.EMAIL_API
    }
}
const emailSenderClient = nodemailer.createTransport(sgTransport(options));

const bookingConfirmEmail = (bookingInfo) => {
    const { productId,
        product,
        orderQuantity,
        totalPrice,
        user,
        phone,
        address } = bookingInfo;
    const email = {
        from: process.env.EMAIL_SENDER,
        to: user,
        subject: `Your order booked for ${product}`,
        text: `Your order booked for ${product}`,
        html:
            `
        <div>
                <h2>Assalamu Alaikum Dear Sir/Mam,</h2>,
                <h1>We have receive your order.</h1>
                <h3>Your order details is :</h3>
                <ul>
                    <li>Order for: ${product}</li>
                    <li>Order quantity: ${orderQuantity}</li>
                    <li>Total price: ${totalPrice}</li>
                    <li>Contact No: ${phone}</li>
                    <li>Address: ${address}</li>
                </ul>
                <p>If you want confirm order please go to Dashboard panel and make sure payment.</p>
                <h2>Thanks for your order.</h2>
                <h2>Stay with us!</h2>
                <br />
                <br />
                <h1>A&B Group of Industries Ltd.</h1>
            </div>
        `
    };

    emailSenderClient.sendMail(email, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Message sent: ', info);
        }
    });
}
const paymentEmail = (paymentInfo) => {
    const {
        product,
        orderQuantity,
        totalPrice,
        user,
        tnxId } = paymentInfo;
    const email = {
        from: process.env.EMAIL_SENDER,
        to: user,
        subject: `Your payment is done for ${product}`,
        text: `Your payment is done for ${product}`,
        html:
            `
        <div>
                <h2>Assalamu Alaikum Dear Sir/Mam,</h2>,
                <h1>We have receive your payment.</h1>
                <h3>Your order details is :</h3>
                <ul>
                    <li>Order for: ${product}</li>
                    <li>Order quantity: ${orderQuantity}</li>
                    <li>Total price: ${totalPrice}</li>
                </ul>
                <p>Thank you for you payment. Now we are working for your order.</p>
                <h2>Stay with us!</h2>
                <br />
                <br />
                <h1>A&B Group of Industries Ltd.</h1>
            </div>
        `
    };

    emailSenderClient.sendMail(email, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Message sent: ', info);
        }
    });
}


module.exports = { bookingConfirmEmail, paymentEmail };