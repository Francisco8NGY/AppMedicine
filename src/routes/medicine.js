const express = require('express');
const router = express.Router();

const pool = require('../database');
const { isLoggedIn } = require('../lib/auth');
var moment = require('moment');
const nodemailer = require('nodemailer');


router.get('/add', isLoggedIn, (req, res) => {
    res.render('medicine/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { name, dateExpire, description, noti } = req.body;
    const newMedicine = {
        name,
        dateExpire,
        description,
        noti,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO medicine set ?', [newMedicine]);
    req.flash('success', 'Medicine saved successfully');
    res.redirect('/medicine');
});

router.get('/', isLoggedIn, async (req, res) => {
    const medicine = await pool.query('SELECT * FROM medicine WHERE user_id = ?', [req.user.id]);

    var dict = [];
    console.log(medicine);

    medicine.forEach(x => {

        var day = moment(x.dateExpire, ["MM-DD-YYYY", "YYYY-MM-DD"]);
        const m = moment(day);



        var now = moment();
        var expire = 0;
        if (now > m) {
            expire = "red"
        } else {
            expire = 'white'
        }

        dict.push({
            id: x.id,
            name: x.name,
            dateExpire: moment(x.dateExpire).format('YYYY-MM-DD'),
            description: x.description,
            user_id: x.user_id,
            created_at: moment(x.created_at).format('YYYY-MM-DD'),
            dateEx: m.fromNow(),
            expire: expire,
        });
    });



    //res.render('medicine/list', { dict });
    res.render('medicine/list2');
});


router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await pool.query('DELETE FROM medicine WHERE ID = ?', [id]);
    req.flash('success', 'Medicine Removed successfully')
    res.redirect('/medicine');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const medicine = await pool.query('SELECT * FROM medicine WHERE id = ?', [id]);

    var dict = [];
    medicine.forEach(x => {
        dict.push({
            id: x.id,
            name: x.name,
            dateExpire: moment(x.dateExpire).format('YYYY-MM-DD'),
            description: x.description,
        });
    });
    console.log(dict)
    res.render('medicine/edit', { medicine: dict });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { name, description, dateExpire } = req.body;
    const newMedicine = {
        name,
        description,
        dateExpire
    };
    await pool.query('UPDATE medicine set ? WHERE id = ?', [newMedicine, id]);
    req.flash('success', 'Link updated successfully');
    res.redirect('/medicine');
});


router.get('/products', isLoggedIn, async (req, res) => {
    const medicine = await pool.query('SELECT * FROM medicine WHERE user_id = ?', [req.user.id]);

    var dict = [];
    console.log(medicine);

    medicine.forEach(x => {

        var day = moment(x.dateExpire, ["MM-DD-YYYY", "YYYY-MM-DD"]);
        const m = moment(day);



        var now = moment();
        var expire = 0;
        if (now > m) {
            expire = "red"
        } else {
            expire = 'white'
        }

        dict.push({
            id: x.id,
            name: x.name,
            dateExpire: moment(x.dateExpire).format('YYYY-MM-DD'),
            description: x.description,
            user_id: x.user_id,
            created_at: moment(x.created_at).format('YYYY-MM-DD'),
            dateEx: m.fromNow(),
            expire: expire,
        });
    });

    res.json(dict);


});

module.exports = router;