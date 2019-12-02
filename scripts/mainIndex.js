$(document).ready(function(){
    $("#home").hide().fadeIn(900).height(function(){
        return $(window).height()*0.7;
    });
    $("#sobre").hide().fadeIn(900).height(function(){
        return $(window).height()*0.7;
    });
});