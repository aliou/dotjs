// ==UserScript==
// @name           Tumblr Timestamps
// @description    Show timestamps on dashboard posts
// @namespace      http://userscripts.org/users/113977
// @include        http://www.tumblr.com/dashboard*
// @include        http://tumblr.com/dashboard*
// @include        http://www.tumblr.com/tumblelog/*
// @include        http://tumblr.com/tumblelog/*
// @include        http://tumblr.com/likes
// @exclude        http://www.tumblr.com/drafts
// @exclude        http://www.tumblr.com/messages
// @exclude        http://www.tumblr.com/queue
// @exclude        http://tumblr.com/drafts
// @exclude        http://tumblr.com/messages
// @exclude        http://tumblr.com/queue
// @exclude        http://www.tumblr.com/tumblelog/*/drafts
// @exclude        http://www.tumblr.com/tumblelog/*/messages
// @exclude        http://www.tumblr.com/tumblelog/*/queue
// @exclude        http://tumblr.com/tumblelog/*/drafts
// @exclude        http://tumblr.com/tumblelog/*/messages
// @exclude        http://tumblr.com/tumblelog/*/queue
// @version        0.2.8
// @date           2011-03-03
// @creator        Jeremy Cutler
// ==/UserScript==

if (!jQuery.browser.mozilla) {
   GM_getValue = function(key,defVal) {
      var retval = window.localStorage.getItem(key);
      if (retval == undefined || retval == null || retval == "" ||
          (retval != 0 && retval != 1 && retval != "0" && retval != "1")) {
         return defVal;
      }
      if (retval == "1" || retval == 1)
         return 1;
      else
         return 0;
   }

   GM_setValue = function(key,val) {
      window.localStorage.setItem(key,val);
   }
}
else {
   GM_registerMenuCommand("Show/Hide Year (Tumblr Timestamps)",setShowYear);
}

function setShowYear() {
   var curr = GM_getValue("tts_ShowYear",1);
   if (curr == 0) curr = "N";
   else curr = "Y";

   var reply = prompt("Show year in post timestamps?\n\n(Y)es or (N)o",curr);
   if (reply == "y" || reply == "Y")
      GM_setValue("tts_ShowYear",1);
   else if (reply == "n" || reply == "N")
      GM_setValue("tts_ShowYear",0);
}

function work_113977() {
   jQuery(".s113977_stamped").each(function() {
      var tid = this.id.match(/[0-9]*$/)[0];
      jQuery("script.scr"+tid).remove();
   });
   jQuery("li.post").each(function() {
      var scrs = jQuery("script.scr"+this.id.match(/[0-9]*$/)[0]);
      if (scrs.length >= 10) scrs.remove();
      if (!(/s113977_stamped/.test(jQuery(this).attr("class"))) && this.id != "new_post")
         load_113977(jQuery(this));
   });
}

function load_113977(li) {
   var div = li.find(".post_info");
   if (div.length == 0) {
      li.find(".post_controls:first").after('<div class="post_info"></div>');
   }
   
   if (/post/.test(li.attr("class"))) {
      var scr = li.find("a.permalink:first").attr("href").match(/http:\/\/[^\/]*/)[0];
      scr += '/api/read/json?id=';
      var tid = li.attr("id").match(/[0-9]*$/)[0];
      scr += tid;
      scr += '&callback=callback_113977';
      var thes = jQuery('.s113977_tts_scr[src="' + scr + '"]');
      if (thes.length <= 10) {
         scrpt = document.createElement('script');
         scrpt.setAttribute('class','s113977_tts_scr scr'+tid);
         scrpt.setAttribute('type','text/javascript');
         scrpt.src = scr;
         document.getElementsByTagName('head')[0].appendChild(scrpt);
      }
   }
}

var callback = document.createElement('script');
callback.setAttribute('id','113977_tts_callback');
callback.setAttribute('type','text/javascript');
callback.innerHTML = "function callback_113977(json){\nvar id = json['posts'][0]['id'];\nvar ts = json['posts'][0]['unix-timestamp'];\nvar li = document.getElementById('post_'+id);\nif (/s113977_stamped/.test(li.className)) return true;\nli.className += ' s113977_stamped';\nvar divs = li.getElementsByTagName('div');\nvar div_info, div, div_controls;\nfor (i=0; i<divs.length; i++) {\nif (/post_info/.test(divs[i].className)) div_info = divs[i];\nelse if (/post_controls/.test(divs[i].className)) div_controls = divs[i];\n} div = div_info;\nvar prebr = true;\nif (div.innerHTML == '') {\nprebr=false;\n}\nvar pd = new Date(ts*1000);\nvar dt = " + (GM_getValue("tts_ShowYear",1)==1 ? "pd.getFullYear() + '-' + " : "") + "((pd.getMonth()+1) < 10 ? '0' : '') + (pd.getMonth()+1) + '-' + (pd.getDate() < 10 ? '0' : '') + pd.getDate() + ' ' + (pd.getHours() < 10 ? '0' : '') + pd.getHours() + ':' + (pd.getMinutes() < 10 ? '0' : '') + pd.getMinutes();\nvar br = document.createElement('br');\nvar txt = document.createElement('span');\ntxt.style.fontWeight='normal';\ntxt.setAttribute('class','s113977_timestamp');\ntxt.innerHTML = dt;\nif (prebr) div.appendChild(br);\ndiv.appendChild(txt);\n}";
document.getElementsByTagName('head')[0].appendChild(callback);

jQuery('span.s113977_timestamp').live('click', function(e) {
   if (e.ctrlKey)
      setShowYear();
});

function tts_113977() {
   work_113977();
   window.setTimeout(tts_113977, 1000);
}
if (/drafts$/.test(location) == false &&
    /queue$/.test(location) == false &&
    /messages$/.test(location) == false)
   tts_113977();
   

   
// document.body.style.fontSize = "16px";
