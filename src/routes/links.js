const express = require('express');

const router = express.Router();

const db = require('../database');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;

    const newlink = {
        title,
        url,
        description
    };

    await db.query('INSERT INTO links set ?', [newlink]);
    res.send('recibido');
});

router.get('/', async (req, res) => {
    const links = await db.query('SELECT * FROM links');
    res.render('links/list', { links });
});


module.exports = router;