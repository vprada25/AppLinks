const express = require('express');
const router = express.Router();
const db = require('../database');
const { isLoggedIn } = require('../lib/auth');

router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});

router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;

    const newlink = {
        title,
        url,
        description,
        user_id : req.user.id
    };

    await db.query('INSERT INTO links set ?', [newlink]);
    req.flash('success', 'agregado correctamente');
    res.redirect('/links');
});

router.get('/', isLoggedIn, async (req, res) => {
    const links = await db.query('SELECT * FROM links where user_id = ?'[req.user.id]);
    res.render('links/list', { links });
});

router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    await db.query('DELETE  FROM links WHERE  id= ?', [id]);
    req.flash('success', ' eliminado correctamente');
    res.redirect('/links');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    console.log(id);
    const links = await db.query('SELECT * FROM links WHERE id = ?', [id]);
    res.render('links/edit', { links: links[0] });

});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id } = req.params;
    const { title, description, url } = req.body;

    const newlink = {
        title,
        description,
        url
    };

    await db.query('UPDATE links SET ? WHERE id = ? ', [newlink, id]);
    req.flash('success', 'editado correctamente');
    res.redirect('/links');
});

module.exports = router;