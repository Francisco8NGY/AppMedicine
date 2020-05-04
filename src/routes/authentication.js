const express = require('express');
const router = express.Router();

const nodemailer = require('nodemailer');
var moment = require('moment');
const pool = require('../database');

const passport = require('passport');
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');

router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});

router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});

router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    })(req, res, next);
});

router.get('/profile', isLoggedIn, async (req, res) => {
    const medicine = await pool.query('SELECT * FROM medicine WHERE user_id = ?', [req.user.id]);
    var now = moment();
    medicine.forEach(x => {
        if (now > x.dateExpire) {
            if (x.noti == 0) {
                //Step 1
                let transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'paco888444@gmail.com',
                        pass: 'TECNOLOGICO'
                    }
                });

                //Step 2
                let mailOptions = {
                    from: 'paco888444@gmail.com',
                    to: req.user.username,
                    subject: 'Hello, Your medicine already expire',
                    text: x.name
                };

                //Step 3
                transporter.sendMail(mailOptions, function (err, data) {
                    if (err) {
                        console.log('Error Occurs', err);
                    } else {
                        console.log('Email sent!!!');
                    }
                });

                updates(medicine, x.id);

            }

        }
    });
    res.render('profile');
});

async function updates(data, ids) {
    console.log(ids)
    data[0].noti = 1
    const noti = data[0].noti;
    const newMedicine = {
        noti,
    };
    await pool.query('UPDATE medicine set ? WHERE id = ?', [newMedicine, ids]);
}

router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;