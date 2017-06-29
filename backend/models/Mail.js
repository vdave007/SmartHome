'use strict';
const nodemailer = require('nodemailer');


const Mail = module.exports = function () {
  // create reusable transporter object using the default SMTP transport
  this.transporter = nodemailer.createTransport({
    service: 'yahoo',
    auth: {
      user: 'iotwithchem@yahoo.com',
      pass: 'mehchtiwtoi2017'
    }
  });
  console.log('create mailer')
};


Mail.prototype.sendMail = function (to, reset_code) {
  console.log('here sending mail')
  // setup email data with unicode symbols
  let mailOptions = {
    from: 'zsebea@yahoo.com', // sender address
    to: to, // list of receivers
    subject: 'Reset code ', // Subject line
    text: reset_code, // plain text body
  };

  // send mail with defined transport object
  this.transporter.sendMail(mailOptions, (error, info) => {
    console.log('here sending mail',info)
    if (error) {
      console.log(error);
    }
    //console.log('Message %s sent: %s', info.messageId, info.response);
  });

};


