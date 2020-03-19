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
    res.flash('success','agregado correctamente');
    res.redirect('/links');
});

router.get('/', async (req, res) => {
    const links = await db.query('SELECT * FROM links');
    res.render('links/list', { links });
});

router.get('/delete/:id', async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE  FROM links WHERE  id= ?', [id]);
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    console.log(id);
    
    const links = await db.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', { links: links[0] });
});

router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;

    const newlink = {
        title,
        description,
        url
    };

    await db.query('UPDATE links SET ? WHERE id = ? ', [newlink, id]);
    res.redirect('/links');
});

module.exports = router;