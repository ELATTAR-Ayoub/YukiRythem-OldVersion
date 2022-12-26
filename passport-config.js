const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt');
const mysql = require('mysql');
// const connection = mysql.createConnection({
//     host: 'localhost',
//     user: 'root',
//     password: 'JeanAyakaayoubMySQL@000',
//     database: 'yukiRythem'
// })


// connect to the database
// connection.connect(function (error) {
//     if (error) console.log(error)
//     else console.log("connect to the database!")
// });



function initialize(passport, getUserByName, getUserById) {
    const authenticateUser = async (username, password, done) => {
        const user = null
        if (user == null) {
            return done(null, false, { message: 'No user exist with that name' })
        }

        try {
            if (await bcrypt.compare(password, user.password)) {
                return done(null, user)
            } else {
                return done(null, false, { message: 'Password is incorrect' })
            }
        }
        catch (e) {
            return done(e);
        }
    }
    passport.use(new localStrategy({ usernameField: 'username' }, authenticateUser))
    passport.serializeUser((user, done) => done(null, user.id))
    passport.deserializeUser((id, done) => {
        return done(null, getUserById(id))
    })

}

module.exports = initialize;