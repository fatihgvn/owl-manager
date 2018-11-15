function owldata(t,a,v=null) {
  if(v!=null) $(t).attr("owl-"+a,v);
  return (v==null)? t.getAttribute("owl-"+a): true;
}

$(function() {
  if($("div[owl]").length){
    //owl carousel tanımlanmış
    var ds = '"loop":true,"margin":10,"nav":true,"dots":true,"responsive":{"0":{"items":1},"600":{"items":3},"1000":{"items":5}}';
    $("div[owl]").each(function (i) {
      var s = owldata(this,"settings");
      var ns = owldata(this,"dots");
      var dotS = owldata(this,"dotsStyle");
      if(s==undefined) s = ds;// setings yoksa default ayarları çek
      var obj = $.parseJSON("{"+s+"}");
      var owl = $(this);

      if(!$(this).hasClass("owl-carousel")) $(this).addClass("owl-carousel");

      owl.owlCarousel(obj);

      if(ns){
        //dotlara numara ekle
        if(ns=="number")
          owl.find(".owl-dot").each(function (i) {
            $(this).find("span").text((i+1));
          });
        else if(ns=="image") {
          var src = [];
          owl.find(".owl-stage .owl-item").each(function () {
            if(!$(this).hasClass("cloned"))
              src.push($(this).find("img").attr("src"));
          });
          var dotL = owl.find(".owl-dot").length;
          owl.find(".owl-dot").each(function (i) {
            $(this).attr("style","width:"+(100/dotL)+"%;");
            d = document.createElement('img');
            $(d).attr("src",src[i]);
            $(d).attr("style","max-width:100%");
            if(dotS) $(this).attr(dotS);
            $(this).html(d);
          });
        }else;
      }
    });
  }
});
