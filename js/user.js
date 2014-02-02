$(document).ready(init);

var myRootRef;
var auth;
var userid;

function init(){
    myRootRef = new Firebase('https://YOURFIREBASE.firebaseio.com/users/');

    auth = new FirebaseSimpleLogin(myRootRef, function(error, user) {
        if (error) {
            // an error occurred while attempting login
            alert("Error logging in: "+ error);
        } else if (user) {
            userid=user.id;
            getUserData(userid, user.email);
        } else {
            //not logged in
            showLogin();
        }
    });
    $("#loginbtn").click(function(){
        doLogin($("#loginemail").val(),$("#loginpass").val());
    })
    $("#signupbtn").click(function(){
        createNewUser($("#newemail").val(),$("#newpass").val());
    })
    $("#forgotbtn").click(function(){
        doForgotPassword($("#forgotemail").val());
    })
}

function createNewUser(email,pass){
    console.log(email+ " " +pass);
    auth.createUser(email, pass, function(error, user) {
        if (!error) {
            doLogin(email,pass);
        } else {
            alert("Could not create user: "+error);
        }
    });
}

function showSignup(){
    $("#loginbox").hide();
    $("#signupbox").show();
}

function showLogin(){
    $("#loginbox").show();
    $("#forgotbox").hide();
    $("#signupbox").hide();
    $("#userdata").hide();
}

function showForgotPassword(){
    $("#loginbox").hide();
    $("#forgotbox").show();
}

function getUserData(userid,useremail){
    $("#loginbox").hide();
    $("#signupbox").hide();
    console.log("getting user data for id "+userid);
    //add some way to show loading
    myRootRef.child(userid).once('value', function(snapshot) {
        var email=null;
        email=snapshot.val().email;
        if(email==null){
            email=useremail;
            saveDataForUser('email',email);
        }
        showUser(email);
    });
}


function showUser(email){
    $("#loginbox").hide();
    $("#signupbox").hide();
    $("#userdata").show();
    $("#emaildata").html(email);
}

function doLogin(email,pass){
    auth.login('password', {
        email: email,
        password: pass
    });
}

function doForgotPassword(email){
    auth.sendPasswordResetEmail(email, function(error,success){
        if(!error){
            alert("Password reset email sent, check your inbox!");
            showLogin();
        } else {
            alert("Error sending reset: "+error);
        }
    });
}

function doLogout(){
    auth.logout();
}

function saveDataForUser(key,value){
    myRootRef.child(userid).update({key:value});
}
