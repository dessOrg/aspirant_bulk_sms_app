/*
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
[ COMMON SCRIPTS ]
AUTHOR :VIJAYAN PP
PROJECT :AMD
VERSION : 1.1
++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
*/

(function($) {
	"use strict";

	$(window).load(function(){		
	App.loader();
	});

	var App={
            init:function()
            {
                         
              App.navigate();
              App.stats()
              App.contactsubmit();
              App.screecarousel();
              App.scrollreveal();
             	
            },
    
    
    navigate:function()
    {
        $('a.page-scroll').click(function() {
        if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
          var target = $(this.hash);
          target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
          if (target.length) {
            $('html,body').animate({
              scrollTop: target.offset().top - 40
            }, 900);
            return false;
          }
        }
      });

    },
    
   
   contactsubmit:function()
   {
       $('#contact-form').submit(function(e){
		var form = $(this);
		e.preventDefault();		
		$.ajax({
			type: 'POST',
			url : 'php/sendmail.php',
			data: form.serialize(),
			success: function(data){
				form.find('.form-message').html(data).fadeIn();
		
				form.find('.btn').prop('disabled', true);
					
				if ($(data).is('.send-true')){
					setTimeout(function(){
						form.trigger('reset');
						
						form.find('.btn').prop('disabled', false);
						
						form.find('.form-message').fadeOut().delay(500).queue(function(){
							form.find('.form-message').html('').dequeue();
						});
					}, 2000);
				} else {
					form.find('.btn').prop('disabled', false);
				}
			}
		});
  });
   },
   stats:function()
   {
        $('.our-stats-box').each(function () {
        $('.our-stat-info').fappear(function (direction) {
            $('.stats').countTo();
        }, {offset: "100px"});
    });
   },
   
   screecarousel:function()
   {
     $('.carousel[data-type="multi"] .item').each(function(){
        var next = $(this).next();
        if (!next.length) {
            next = $(this).siblings(':first');
        }
        next.children(':first-child').clone().appendTo($(this));

        for (var i=0;i<2;i++) {
            next=next.next();
            if (!next.length) {
                next = $(this).siblings(':first');
            }

            next.children(':first-child').clone().appendTo($(this));
        }
    });
  
   },

   
   loader:function()
			{
                         
			 $("div.preloader").fadeOut("slow");
                         
                         
			},
                        scrollreveal:function()
    {
        window.scrollReveal = new scrollReveal();
    }
    
			
        };
        App.init();

})(jQuery);



/*+++++++++++++++++++++++++COMMON FUNCTIONS++++++++++++++++++++++++++++*/

/*KENBERG SLIDER*/

 var fullscreenslider=function()
  {
      $("section.main-gallery").vegas({
	delay: 3000,
    slides: [
        { src: "images/bak3.jpg" },
        { src: "images/bak2.jpg" },
        { src: "images/bak1.jpg" },
        { src: "images/bak4.jpg" }
    ],animation: 'kenburns'
});
  }