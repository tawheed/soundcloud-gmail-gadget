jQuery(document).ready(function() {
  $(document.body).inlinePlayer( google.contentmatch.getContentMatches(),
    { callback: function(list){
        var heights = [15, 15], cnt = 0, scnt = 0, linePadding = 15;
        $.each( list, function(url, height){
          if( cnt < 3) {
            heights[0] += height + linePadding;
          }
          heights[1] += height + linePadding;
          cnt += 1;
        });
        $('li').slice(0,3).show();
        gadgets.window.adjustHeight(heights[0]);
        if( cnt > 3 ) {
          $('a')
           .click( function() {
              gadgets.window.adjustHeight(heights[(scnt+=1) % 2]);
              $('li').slice(3).add('a').toggle();
            })
           .filter('.show')
           .html('Show ' + (cnt - 3) + ' more')
           .show();
        }
      }
    }
  );
});
