var LocalStrategy = require('passport-local').Strategy;
const passport = require('passport');
const bcrypt=require('bcryptjs');
var User= require('../models/account').getAccount;


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
module.exports =function (passport) {
    passport.use(new LocalStrategy(
        (username, password, done) => {       
            if(!username||!password)
                return done(null, false,{message:'Vui lòng điền đầy đủ thông tin'});
            User.findOne({
                username:username
            }).then(async function (user) {    
                if(!user)
                    return done(null,false,{message:'Tài khoản chưa được đăng ký'});
                bcrypt.compare(password,user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch) return done(null,user);
                    else return done(null, false,{message:'Mật khẩu không đúng'});
                });    
            }).catch(function (err) {
                return done(err);
            });
        }
    ));
}