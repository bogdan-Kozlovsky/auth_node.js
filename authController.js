const User = require('./models/User')
const Role = require('./models/Role')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {validationResult} = require('express-validator')
const {secret} = require('./config')
const generateAccessToken = (id, roles) => {
    const payload = {
        id,
        roles
    }

    return jwt.sign(payload, secret, {expiresIn: '24h'})
}

class authController {
    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({errors: errors.array()})
            }

            const {username, password} = req.body;
            const candidate = await User.findOne({username: username})
            if (candidate) {
                return res.status(400).json({message: 'User already exists'})
            }

            const hashedPassword = await bcrypt.hash(password, 10)
            const userRole = await User.findOne({value: 'USER'})
            const user = new User({
                username: username,
                password: hashedPassword,
                roles: [userRole]
            })
            await user.save()
            return res.status(200).json({message: 'User saved successfully'})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Registration error'})
        }
    }

    async login(req, res) {
        try {

            const {username, password} = req.body;
            const user = await User.findOne({username: username})
            if (!user) {
                return res.status(400).json({message: 'User not found'})
            }
            const validPassword = await bcrypt.compareSync(password, user.password)
            if (!validPassword) {
                return res.status(400).json({message: 'Invalid credentials'})
            }
            const token = generateAccessToken(user._id, user.roles)

            return res.json({token: token})
        } catch (e) {
            console.log(e)
            res.status(400).json({message: 'Login error'})
        }
    }

    async getUsers(req, res) {
        try {
            const users = await User.find()

            res.json(users)

            // const userRole = new Role();
            // const adminRole = new Role({value: 'ADMIN'});
            //
            // await adminRole.save()
            // await userRole.save()
            res.json('server get users json');
        } catch (e) {

        }
    }
}

module.exports = new authController();
