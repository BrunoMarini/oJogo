$(document).ready(function(){
    $("#home").hide().fadeIn(900).height(function(){
        return $(window).height()*0.7;
    });
    $("#sobre").hide().fadeIn(900).height($(window).height());
    $("#ranking").hide().fadeIn(900).height($(window).height());
    $("#contato").hide().fadeIn().height();

    $("#imgTrio").height(function(){
        return $(window).width()*0.2;
    }).width(function(){
        return $(window).width()*0.3;
    });

    $(".navbar").height(function(){
        return $(window).height()*0.1;
    });

    $(".menu-link").height(function(){
        return $(".navbar").height()*0.3;
    });

    $("#imgLogo").height(function(){
        return $(window).height()*0.1;
    }).width(function(){
        return $(window).width()*0.1;
    });

    $(".hide-text").click(function(){
        $(".text").toggle();
    });

    $(".animate-me-button").click(function(){
        $(".image-one").slideToggle();
    });

    $(".image-two").mouseenter(function(){
        $(".image-two").slideUp(1000);
        $(".image-two").slideDown(1000);
    });

    $(".me-too-button").click(function(){
        $(".image-three").fadeToggle();
    });

    $(document).on('click','.menu-link', function(event) {
        event.preventDefault();
        var target = "#" + this.getAttribute('data-target');
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 2000);
    });

});