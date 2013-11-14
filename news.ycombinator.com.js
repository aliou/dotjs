if (window.location.pathname == '/') {
  $('table table tbody tr:nth-child(n+45)').css('display','none');

  $('table table:nth-child(2)').append('<a id="moar" href="">More</a>');

  $('#moar').click(function() {
    $('table table:nth-child(1) tr').css('display','table-row');
    $(this).hide();
    return false;
  }).css('padding', '25px');
}

// (function() {
//   var st = document.createElement('link');
//   st.type = "text/css";
//   st.href = "https://raw.github.com/Primigenus/Cleaner-Hacker-News/master/cleaner-hn.css";
//   st.rel = "stylesheet";
//   document.body.appendChild(st)
// })();
