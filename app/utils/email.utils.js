
const nodemailer = require('nodemailer');
const sendMail = async (from, subject, text) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "sa.ghofraniivari@gmail.com",
            pass: "09211953839"
        }
    });
    message = {
        from: `${from}`,
        to: "sa.ghofraniivari@gmail.com",
        subject: `${subject}`,
        text: `${text}`
    }
    return transporter.sendMail(message, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log(info);
        }
    })
};
module.exports = sendMail;