var LocalStrategy = require('passport-local').Strategy;
var passport = require('passport');
//var bcrypt = require('bcrypt');
var mongoose = require('mongoose');

mongoose.connect('mongodb+srv://bibinbodongti:newwind@itus@cluster0-wm9nk.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true
});

var db = mongoose.connection;
var inforSchema = new mongoose.Schema({
    username: String,
    password: String,
    // job: String
}, {
    collection: 'Account'
});
const User = db.useDb("ManagerStore").model("User", inforSchema);
// User.findOne({username:"bibinbodongti"}, (err, value) => {
//     if (err) {
//       console.log(err);
//     } else {
//         console.log(value.username);
//     }
//   })
passport.serializeUser(function (user, done) {
    done(null, user.username);
});

passport.deserializeUser(function (name, done) {
    User.findOne({username:name}).then(function (user) {
        done(null, user);
    }).catch(function (err) {
        console.log(err);
    })
});
module.exports = function (passport) {
    passport.use(new LocalStrategy(
        (username, password, done) => {
            User.findOne({
                username:username
            }).then(function (user) {    
                if(!user) return done(null,false,{message:'Tài khoản chưa được đăng ký'});
                if(password!=user.password) return done(null, false,{message:'mật khẩu không đúng'});
                return done(null,user);
            }).catch(function (err) {
                return done(err);
            })
        }
    ));
}