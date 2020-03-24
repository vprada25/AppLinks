const passport = require('passport');
const localstrategy = require('passport-local').Strategy;
const db = require('../database');
const helpers = require('./helpers');


passport.use('local.signin', new localstrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await db.query('SELECT * FROM users WHERE username = ?', [username]);
    console.log(rows);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.macthPassword(password, user.password);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenido ' + user));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El usuario no existe'));
    }
}));

passport.use('local.signup', new localstrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: 'true'
}, async (req, username, password, done) => {
    const { fullname } = req.body;
    const newUser = {
        username: username,
        password: password,
        fullname: fullname
    };
    newUser.password = await helpers.encryptPassword(password);
    const result = await db.query('INSERT INTO users SET  ? ', [newUser]);
    console.log(result);
    newUser.id = result.insertId;
    return done(null, newUser);

}));



passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, rows[0]);

});
