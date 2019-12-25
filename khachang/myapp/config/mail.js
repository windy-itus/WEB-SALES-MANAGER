var nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt=require('jsonwebtoken');
var transporter = nodemailer.createTransport({ // config mail server
    service: 'Gmail',
    auth: {
      user: 'ad.appcreater@gmail.com',
      pass: 'qwertyuiop@123456789'
    }
});
module.exports.SendMail=(email,subject,html)=>{
    return new Promise((resolve,reject)=>{
          var mainOptions = { // thiết lập đối tượng, nội dung gửi mail
            from: 'Đăng Khoa Store',
            to: email,
            subject: subject,
            text: 'Đăng Khoa Store',
            html: html
          }
          transporter.sendMail(mainOptions, function (err, info) {
              if(err) resolve(false);
              else {
                console.log('Message sent: ' + info.response);
                resolve(true);
              }
          });
    });
}