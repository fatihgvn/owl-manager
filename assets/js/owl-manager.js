function owldata(t,a,v=null) {
  if(v!=null) $(t).attr("owl-"+a,v);
  return (v==null)? t.getAttribute("owl-"+a): true;
}

$(function() {
  if($("div[owl]").length){
    //owl carousel tanımlanmış
    var ds = '"loop":true,"margin":10,"nav":true,"dots":true,"responsive":{"0":{"items":1},"600":{"items":3},"1000":{"items":5}}';
    var numberslideDotsSettings = {
      smartSpeed:150,
      fluidSpeed:false,
      dragEndSpeed:false,
      touchDrag:true,
      items:1,
      singleItem:true,
      navigation:false,
      responsiveClass:true,
      rtl:false,
      nav:false,
      loop:false,
      margin:5,
      dotsData:false,
      dots:false,
      autoplay:false,
      autoplayTimeout:30500,
      autoplayHoverPause:false,
      responsive:{
         0:{
            "items":9
         },
         480:{
            "items":12
         },
         768:{
            "items":17
         },
         992:{
            "items":20
         }
      }
    };
    var imageslideDotsSettings = {
      smartSpeed:150,
      fluidSpeed:false,
      dragEndSpeed:false,
      touchDrag:true,
      items:1,
      singleItem:true,
      navigation:false,
      responsiveClass:true,
      rtl:false,
      nav:false,
      loop:false,
      margin:5,
      dotsData:false,
      dots:false,
      autoplay:false,
      autoplayTimeout:30500,
      autoplayHoverPause:false,
      responsive:{
         0:{
            "items":3
         },
         480:{
            "items":5
         },
         768:{
            "items":7
         },
         992:{
            "items":10
         }
      }
    };
    $("div[owl]").each(function (i, owl) {
      var s = owldata(this,"settings");
      var ns = owldata(this,"dots");
      var dotS = owldata(this,"dotsStyle");
      var dotC = owldata(this,"dotsClass");
      if(s==undefined) s = ds;// setings yoksa default ayarları çek
      var obj = $.parseJSON("{"+s+"}");
      // var owl = $(this);

      if(ns!=null) ns = ns.toLowerCase();
      if(!$(this).hasClass("owl-carousel")) $(this).addClass("owl-carousel");

      if(ns){
        //dotlara numara ekle
        if(ns=="number"){
          $(owl).owlCarousel(obj); // owl başlat
          $(owl).find(".owl-dot").each(function (i) {
            $(this).find("span").text((i+1));
          });
        }
        //dotlara resim ekle
        else if(ns=="image") {
          $(owl).owlCarousel(obj); // owl başlat
          var src = [];
          $(owl).find(".owl-stage .owl-item").each(function () {
            if(!$(this).hasClass("cloned"))
              src.push($(this).find("img").attr("src"));
          });
          var dotL = $(owl).find(".owl-dot").length;
          $(owl).find(".owl-dot").each(function (i) {
            $(this).attr("style","width:"+(100/dotL)+"%;");
            d = document.createElement('img');
            $(d).attr("src",src[i]);
            $(d).attr("style","max-width:100%");
            if(dotS) $(this).attr(dotS);
            if(dotC) $(this).addClass(dotC);
            $(this).html(d);
          });
        }
        // numara slider modunda başlat
        else if(ns=="slide-number"){
          $(owl).wrap("<div class='owl-parent'></div>");
          var owlparent = $(owl).parent('.owl-parent');

          $('<div/>', {
            class: 'slide-dots'
          }).appendTo(owlparent);

          obj.onChanged = function(event){
            var dotSlider = $(event.target).next();
            var numberShowcaseSlider = owlparent.find(".slide-dots span");
            numberShowcaseSlider.trigger('to.owl.carousel', [event.item.index, 500, true]);
            $(".owl-item", dotSlider).removeClass("activeDots");
            $(".owl-item:eq(" + event.item.index + ")", dotSlider).addClass("activeDots");
          };
          obj.dots = false;
          obj.onInitialized = function(event){
            var showcaseCarousel = $(event.target);
            var dotcarouselWrp = owlparent.find(".slide-dots");
            dotcarouselWrp.append('<div class="owl-carousel"></div>');
            showcaseCarousel.after(dotcarouselWrp);
            var thumbnailShowcaseSlider = $('div', dotcarouselWrp);
            var windowsize = $( window ).width();
            var itemIndex = 0;
            $(".owl-item", showcaseCarousel).each(function(index, element) {
              var clone = $(this).hasClass("cloned");
              if(!clone){
                var span = $(document.createElement('span'));
                span.append((itemIndex+1));
                span.addClass("slide-number");
                thumbnailShowcaseSlider.append(span);
                itemIndex++;
              }
            });
            numberslideDotsSettings.onInitialized = function(event){$(".owl-item:eq(0)", thumbnailShowcaseSlider).addClass("activeDots");};
            thumbnailShowcaseSlider.owlCarousel(
              numberslideDotsSettings
            ).on('changed.owl.carousel', function (e) {
               // On change of thumbnail item to trigger main item
               showcaseCarousel.trigger('to.owl.carousel', [e.item.index, 500, true]);
            });

            if(windowsize>=768)
              owlparent.find('.owl-item').click(function () {
                // On click of thumbnail items to trigger same main item
                showcaseCarousel.trigger('to.owl.carousel', [$(this).index(), 500, true]);
              });
            else
              owlparent.find('.owl-item').hover(function () {
                // On click of thumbnail items to trigger same main item
                showcaseCarousel.trigger('to.owl.carousel', [$(this).index(), 500, true]);
              });
          }
          $(owl).owlCarousel(obj); // owl başlat
        }
        // image slider modunda başlat
        else if(ns=="slide-image"){
          $(owl).wrap("<div class='owl-parent'></div>");
          var owlparent = $(owl).parent('.owl-parent');
          var src = [];

          $(owl).find("img").each(function () {
            if(!$(this).hasClass("cloned"))
              src.push($(this).attr("src"));
          });

          $('<div/>', {
            class: 'slide-dots'
          }).appendTo(owlparent);

          obj.dots = false;
          obj.onChanged = function(event){
            var dotSlider = $(event.target).next();
            var numberShowcaseSlider = dotSlider.find("span");
            numberShowcaseSlider.trigger('to.owl.carousel', [event.item.index, 500, true]);
            $(".owl-item", dotSlider).removeClass("activeDots");
            $(".owl-item:eq(" + event.item.index + ")", dotSlider).addClass("activeDots");
          };
          obj.onInitialized = function(event){
            var showcaseCarousel = $(event.target);
            var dotcarouselWrp = owlparent.find(".slide-dots");
            dotcarouselWrp.append('<div class="owl-carousel"></div>');
            showcaseCarousel.after(dotcarouselWrp);
            var thumbnailShowcaseSlider = $('div', dotcarouselWrp);
            var windowsize = $( window ).width();
            var itemIndex = 0;
            $(".owl-item", showcaseCarousel).each(function(index, element) {
              var clone = $(this).hasClass("cloned");
              if(!clone){
                var span = $(document.createElement('span'));
                var img = $(document.createElement('img'));
                img.attr("src",src[(itemIndex+1)]);
                span.addClass("slide-image");
                span.append(img);
                thumbnailShowcaseSlider.append(span);
                itemIndex++;
              }
            });

            imageslideDotsSettings.onInitialized = function(event){$(".owl-item:eq(0)", thumbnailShowcaseSlider).addClass("activeDots");};
            console.log(thumbnailShowcaseSlider);

            thumbnailShowcaseSlider.owlCarousel(imageslideDotsSettings).on('changed.owl.carousel', function (e) {
              // On change of thumbnail item to trigger main item
              showcaseCarousel.trigger('to.owl.carousel', [e.item.index, 500, true]);
            });
            if(windowsize>=768)
              owlparent.find('.owl-item').click(function () {
                // On click of thumbnail items to trigger same main item
                showcaseCarousel.trigger('to.owl.carousel', [$(this).index(), 500, true]);
              });
            else
              owlparent.find('.owl-item').hover(function () {
                // On click of thumbnail items to trigger same main item
                showcaseCarousel.trigger('to.owl.carousel', [$(this).index(), 500, true]);
              });
          }

          $(owl).owlCarousel(obj); // owl başlat
        }else{
          $(owl).owlCarousel(obj); // owl başlat
        }
      }else{
        $(owl).owlCarousel(obj); // owl başlat
      }
    });
  }
});
