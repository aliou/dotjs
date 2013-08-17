// document.body.style.fontFamily = 'Avenir';

function audioHTML(audioFile)
{
	return '<audio src="'+audioFile+'" title="'+audioFile.replace(/.+\//g,'')+'" controls preload="none"></audio>';
};

/*
-------------------------------------------------------------------------------
Tumblr Audio Player <http://www.tumblr.com/>
-------------------------------------------------------------------------------
Tested on:
	- http://blog.mimeoverse.com/ 
	- http://nerdmusic.tumblr.com/
-------------------------------------------------------------------------------
*/
// Tumblr sites
var scripts = document.querySelectorAll('*[id^=audio_player_]+script');
for (var i=0; i<scripts.length;i++)
{
	var script		= scripts[i].innerHTML.replace(/(\r|\n)/g, '');
	var playerId 	= script.replace(/\s*replaceIfFlash\([0-9]+,\s*["']/, '').replace(/(audio_player_[0-9]+).+/, '$1');
	var audioFile	= script.replace(/.+audio_file=/,'').replace(/&.+/, '');
	
	// ?plead tip from @evanwalsh: http://twitter.com/#!/evanwalsh/status/612667370774530
	audioFile		+= '?plead=please-dont-download-this-or-our-lawyers-wont-let-us-host-audio';
	document.getElementById(playerId).innerHTML = audioHTML(audioFile);
};
// Tumblr Dashboard (only works for initial page load, can't seem to find an audioFile during Ajax paging)
var scripts = document.querySelectorAll('*[id^=audio_node_]+script');
for (var i=0; i<scripts.length;i++)
{
	var script		= scripts[i].innerHTML.replace(/(\r|\n)/g, '');
	var playerId 	= script.replace(/\s*replaceIfFlash\([0-9]+,\s*["']/, '').replace(/(audio_node_[0-9]+).+/, '$1');
	var audioFile	= script.replace(/.+audio_file=/,'').replace(/\\.+/, '');

	// ?plead tip from @evanwalsh: http://twitter.com/#!/evanwalsh/status/612667370774530
	audioFile		+= '?plead=please-dont-download-this-or-our-lawyers-wont-let-us-host-audio';
	document.getElementById(playerId).innerHTML = audioHTML(audioFile);
};

function pad6(str)
{
	var fill = 6 - str.length;
	while (fill > 0)
	{
		str = '0'+str;
		fill--;
	};
	return str;
};
function dec2bin(dec)
{
	return parseInt(dec).toString(2);
};
function bin2dec(bin)
{
	var dec = 0;
	for (var i=0;i<bin.length; i++)
	{
		var j = bin.charAt(i);
		if (j == '1')
		{
			dec += Math.pow(2, bin.length-1-i);
		};
	};
	return dec;
};
function AudioPlayerDecodeSource(encoded)
{
	// so very secure
	var source	= '';
	var key 	= {'A':0,'B':1,'C':2,'D':3,'E':4,'F':5,'G':6,'H':7,'I':8,'J':9,'K':10,'L':11,'M':12,'N':13,'O':14,'P':15,'Q':16,'R':17,'S':18,'T':19,'U':20,'V':21,'W':22,'X':23,'Y':24,'Z':25,'a':26,'b':27,'c':28,'d':29,'e':30,'f':31,'g':32,'h':33,'i':34,'j':35,'k':36,'l':37,'m':38,'n':39,'o':40,'p':41,'q':42,'r':43,'s':44,'t':45,'u':46,'v':47,'w':48,'x':49,'y':50,'z':51,'0':52,'1':53,'2':54,'3':55,'4':56,'5':57,'6':58,'7':59,'8':60,'9':61,'_':62,'-':63};
	var chars 	= encoded.split('');
	var mid		= '';
	
	for (var j=0; j<chars.length; j++)
	{
		var c = chars[j];
		var i = key[c];
		var b = pad6(i.toString(2));
		mid += b;
	};
	
	mid = mid.substring(0, Math.floor(mid.length/8)*8);
	
	for (var j=0; j<mid.length; j+=8)
	{
		var b = mid.substring(j, j+8);
		var i = bin2dec(b);
		var c = String.fromCharCode(i);
		source += c;
	};
	return source;
};
var scripts = document.getElementsByTagName('script');
for (var i=0; i<scripts.length;i++)
{
	var script		= scripts[i].innerHTML;
	
	/*
	-------------------------------------------------------------------------------
	WordPress Audio Player <http://wpaudioplayer.com/>
	-------------------------------------------------------------------------------
	Tested on:
		- http://www.bearmccreary.com/blog/
	-------------------------------------------------------------------------------
	*/
	if (script.match('AudioPlayer.embed'))
	{
		var exps = script.split(';');
		for (var j=0; j<exps.length; j++)
		{
			var exp = exps[j].replace(/(\r|\n)/g, '');
			var playerId 	= exp.replace(/AudioPlayer\.embed\(["']/,'').replace(/([^"']+)["'].+/, '$1');
			if (playerId.match(/^\s*$/)) continue;
			var audioFile	= exp.replace(/.+soundFile:\s*["']([^"']+).+/, '$1');
			if (audioFile.match(/^\s*$/)) continue;
			
			if (!audioFile.match(/\./))
			{
				audioFile = AudioPlayerDecodeSource(audioFile);
			};
			document.getElementById(playerId).innerHTML = audioHTML(audioFile);
		};
	}
	/*
	-------------------------------------------------------------------------------
	SWFObject, initially JWPlayer <http://www.longtailvideo.com/players/>
	-------------------------------------------------------------------------------
	Tested on:
		- http://5by5.tv/
	-------------------------------------------------------------------------------
	*/
	else if (script.match(/\.addVariable\('file'/) && script.match('.mp3'))
	{
		script = script.replace(/[\r\n]/g,'');
		var playerId = script.replace(/^.*\.write\(["']([^"']+)["'].*$/, '$1');
		if (playerId.match(/^\s*$/)) continue;
		var audioFile = script.replace(/^.*\.addVariable\(["']file["'],\s*["']([^"']+)["'].*$/, '$1');
		if (audioFile.match(/^\s*$/)) continue;
		document.getElementById(playerId).innerHTML = audioHTML(audioFile);
	}
	/*
	-------------------------------------------------------------------------------
	Guardian Audio Player <http://www.guardian.co.uk/audio>
	-------------------------------------------------------------------------------
	Tested on:
		- http://www.guardian.co.uk/audio
	-------------------------------------------------------------------------------
	*/
	else if (script.match(/guAudioPlayer\.swf/))
	{
		script = script.replace(/[\r\n]/g,'');
		var audioFile = script.replace(/^.*&file=([^&]+).*$/, '$1');
		if (audioFile.match(/^\s*$/)) continue;
		document.getElementById('flash-player').innerHTML = audioHTML(audioFile);
	}
	/*
	-------------------------------------------------------------------------------
	freesound.org Audio Player <http://www.freesound.org>
	-------------------------------------------------------------------------------
	Tested on:
		- http://www.freesound.org/samplesViewSingle.php?id=108602
		- Works on detail pages only.
	-------------------------------------------------------------------------------
	*/
	else if (script.match(/preview-player\.swf/))
	{
		script = script.replace(/[\r\n]/g,'');
		var audioFile = script.replace(/^.*\.addVariable\(["']url["'],\s*["']([^"']+)["'].*$/, '$1');
		if (audioFile.match(/^\s*$/)) continue;
		var freesoundId = audioFile.replace(/.*\/(\d+)__.*/, '$1');
		if (freesoundId.match(/^\s*$/)) continue;
		var freesoundSpanId = 'flashcontent_' + freesoundId;
		document.getElementById(freesoundSpanId).innerHTML = audioHTML(audioFile);
	};
};

var objects = document.getElementsByTagName('object');
for (var i=0; i<objects.length;i++)
{
	var object		= objects[i];
	
	/*
	-------------------------------------------------------------------------------
	AOL Audio Player used by Weblogs Inc. properties
	-------------------------------------------------------------------------------
	Tested on:
		- http://engadget.com/

	Submitted by Benjamin Mayo http://benjaminmayo.posterous.com/
	-------------------------------------------------------------------------------
	*/
	if (object.data && object.data.match(/weblogsinc/i))
	{
		var audioFile   = object.children.FlashVars.value.substr(10);
		object.innerHTML = audioHTML(audioFile);
	}
	/*
	-------------------------------------------------------------------------------
	8bit Collective Audio Player
	-------------------------------------------------------------------------------
	Tested on:
		- http://8bc.org/
	-------------------------------------------------------------------------------
	*/
	else if (object.data && object.data.match(/player_mp3_maxi\.swf/))
	{
		if (m = object.children.FlashVars.value.match(/mp3=([^&]+)/))
		{
			var audioFile   = window.decodeURIComponent(m[1]).replace(/\+/g,'%20');
			object.innerHTML = audioHTML(audioFile);
		};
	};
};
