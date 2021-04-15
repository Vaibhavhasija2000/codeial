const User = require("../models/user");
// res.end('<h1>User Profile</h1>');
module.exports.profile = function(req,res){

    if(req.cookies.user_id){
        User.findById(req.cookies.user_id, function(err,user){
            if(user){
                res.render('user_profile',{
                    title: "User Profile",
                    user: user
                })
            }else{
            return res.redirect('/users/sign-in');
            }
        })
    }else {
        return res.redirect('/users/sign-in');
    }


}

// render the sign in page
module.exports.signUp = function(req,res){
    return res.render('user_sign_up',{
        title: "Codeial | Sign Up"
    });
}

// render the sign up page
module.exports.signIn = function(req,res){
    return res.render('user_sign_in',{
        title: "Codeial | Sign Up"
    });
}

// get sign up data
module.exports.create = function(req,res){
    if(req.body.password != req.body.conform_password){
        return res.redirect('back');
    }

    User.findOne({email:req.body.email}, function(err,user){
        if(err){console.log('error in finding user in signup'); return}

        if(!user){
            User.create(req.body,function(err,user){
                if(err){console.log('error in creating user while signing in'); return}
                
                return res.redirect('/users/sign-in');
            })
        }else{
            res.redirect('back');
        }
    });

}

// sign in and create session for the user
module.exports.createSession = function(req,res){
    // Steps to authenticate
    // find user
    User.findOne({email:req.body.email},function(err,user){
        if(err){console.log('error in finding user in signing in'); return}

        // handle user found

        if(user){

            // handle password which does not match
            if(user.password!=req.body.password){
                return res.redirect('back');
            }
            
            // handle session creation
            res.cookie('user_id',user.id);
            return res.redirect('/users/profile');
        }else{
            // handle user not found

            return res.redirect('back');
        }

    });
    
}


module.exports.signOut = function(req,res){
    res.clearCookie('user_id');
    return res.redirect('/users/sign-in');
}