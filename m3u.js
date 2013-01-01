/*
-------------------------------------------------------------------------------
M3U Player used by Amazon, eMusic, etc.
-------------------------------------------------------------------------------
Tested on:
	- http://amazon.com/
	- http://emusic.com/
	
Submitted by Eric Grossnickle http://mightydream.com/
-------------------------------------------------------------------------------
*/
function m3uObject()
{
	this.srcAttribute = 'href';			// which attribute to use for audio source
	this.stopAfter = false;				// open-ended streams can be manually shut off after a certain amount of time
	this.onMouseOver = onMouseOver;
	this.onMouseOut = onMouseOut;
	this.onPlay = onPlay;
	this.onPlaying = onPlaying;
	this.onPause = onPause;
	this.onEnded = onEnded;
	this.player = player;
	this.go = go;
	
	function onMouseOver(link, audio) {}
	
	function onMouseOut(link, audio) {}
	
	function onPlay(audio) {
		audio.parentNode.style.opacity = '.5';
	}
	
	function onPlaying(audio) {}
	
	function onPause(audio) {
		audio.parentNode.style.opacity = '1';
	}
	
	function onEnded(audio) {
		audio.parentNode.style.opacity = '1';
	}
	
	function player(link) {
		var self = this;
		
		var audio = new Audio();
		audio.src = link.getAttribute(this.srcAttribute);
		audio.style.display = 'none';
		audio.setAttribute('preload', 'none');
		audio.addEventListener('play', function() {
			self.onPlay(this);
		});
		audio.addEventListener('playing', function() {
			self.onPlaying(this);
		});
		audio.addEventListener('pause', function() {
			self.onPause(this);
		});
		audio.addEventListener('ended', function() {
			self.onEnded(this);
		});
		audio.addEventListener('timeupdate', function() {
			// manually stop and reset open-ended streams
			if (self.stopAfter && (this.duration == 'NaN' || this.duration == 'Infinity'))
			{
				if (Math.round(this.currentTime) >= self.stopAfter)
				{
					this.pause();
					self.onPause(this);  // not sure why this has to be manually triggered here, but it does
					this.load();  // can't reset using currentTime because it's an open-ended stream
				}
			}
		});
		link.appendChild(audio);
		
		link.onclick = function() {
			if (audio.paused) {
				audio.play();
			}
			else {
				audio.pause();
			}
			
			return false;
		}
		
		link.onmouseover = function() {
			self.onMouseOver(this, audio);
		}
		
		link.onmouseout = function() {
			self.onMouseOut(this, audio);
		}
	}
	
	function go() {
		var objects = document.querySelectorAll('a[href*=".m3u"]');
		for (var i=0; i<objects.length;i++)
		{
			this.player(objects[i]);
		}
	}
}

m3u = new m3uObject();

// customize functionality/style for certain sites
switch(document.location.hostname.replace(/^www\./i,'').toLowerCase())
{
	case 'amazon.com':
	case 'amazon.ca':
	case 'amazon.cn':
	case 'amazon.fr':
	case 'amazon.de':
	case 'amazon.co.jp':
	case 'amazon.co.uk':
		m3u.srcAttribute = 'flashurl';
		m3u.onPlay = function(audio) {
			link = audio.parentNode;
			addClass(link, 'playing');
			removeClass(link, 'paused');
		}
		m3u.onPause = function(audio) {
			link = audio.parentNode;
			addClass(link, 'paused');
			removeClass(link, 'playing');
		}
		m3u.onEnded = function(audio) {
			link = audio.parentNode;
			removeClass(link, 'playing');
		}
		m3u.go();
		break;
	
	case 'emusic.com':
		m3u.stopAfter = 30;
		m3u.onMouseOver = function(link, audio) {
			if (audio.paused) link.getElementsByTagName('img')[0].src = '/images/samplePlayer/playOver.gif';
			else link.getElementsByTagName('img')[0].src = '/images/samplePlayer/pause.gif';
		}
		m3u.onMouseOut = function(link, audio) {
			if (audio.paused) link.getElementsByTagName('img')[0].src = '/images/samplePlayer/play.gif';
			else link.getElementsByTagName('img')[0].src = '/images/samplePlayer/playThrob.gif';
		}
		m3u.onPlay = function(audio) {
			link = audio.parentNode;
			link.getElementsByTagName('img')[0].src = '/images/samplePlayer/playThrob.gif';
		}
		m3u.onPause = function(audio) {
			link = audio.parentNode;
			link.getElementsByTagName('img')[0].src = '/images/samplePlayer/play.gif';
		}
		m3u.go();
		break;
	
	default:
		m3u.go();
}

// http://www.openjs.com/scripts/dom/class_manipulation.php
function removeClass(obj, cls) {
	if (hasClass(obj, cls)) {
		var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
		obj.className = obj.className.replace(reg, ' ');
	}
}
function addClass(obj, cls) {
	if (!this.hasClass(obj, cls)) {
		obj.className += " " + cls;
 	}
}
function hasClass(obj, cls) {
	return obj.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}