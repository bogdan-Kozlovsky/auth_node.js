const Router = require('express');
const router = new Router();
const controller = require('./authController');
const {check} = require('express-validator')

router.post('/register', [
    check('username', 'Имя користувача не можу бути пустим').notEmpty(),
    check('password', 'Пароль повинен бути не меншим 6 а також не більшим 10').isLength({min: 6, max: 10}),
], controller.register);
router.post('/login', controller.login);
router.get('/users', controller.getUsers);

module.exports = router;
