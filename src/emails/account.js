const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'maxim.taina@gmail.com',
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
    });
};

const sendCancelationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'maxim.taina@gmail.com',
        subject: 'Cancelation of account!',
        text: `${name}, your account was actually removed. Why did you leave us?`
    });
}

module.exports = { 
    sendWelcomeEmail,
    sendCancelationEmail
}