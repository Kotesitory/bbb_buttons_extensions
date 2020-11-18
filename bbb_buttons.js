function checkLoaded(tmr){
	let title = document.getElementById("recording-title");
	if(title != undefined){
		window.clearInterval(tmr);
		load();
	}
}

function load() {
	var videos = document.getElementsByTagName('video');
	for (i = 0; i < videos.length; i++) {
		if(videos[i].classList.contains('webcam'))
	  		var audio = videos[i];
	  	else
	  		var video = videos[i];
	}

	var playbackSpeed = 1.0;

	const max_speed = 5.0;
	const min_speed = 0.1;
	const default_seekOffset = 5.0;
	const default_speedOffset = 0.1;
	var seekOffset = 5.0;
	var speedOffset = 0.1;

	// DEV NOTE: Use [chrome] for Google chrome, use [browser] for other browsers that support storage API
	chrome.storage.sync.get({speed_offset: default_speedOffset, seek_offset: default_seekOffset},
		(res) => {
			console.log(JSON.stringify(res));
			speedOffset = parseFloat(res.speed_offset);
			seekOffset = parseFloat(res.seek_offset);
		}
	);
	
	var darkMode = false;
	var TRANSITION_DURATION = "1s";

	// colors
	var TEXT_PRIMARY = "#666666"
	var TEXT_PRIMARY_DARK_MODE = "#fafafa"
	var DARK_BACKGROUND = "#212121"
	var LIGHT_BACKGROUND = "white"

	// Creating div for viewing video speed
	var div = document.createElement('div');
	div.height = 400;
	div.width = 200;
	div.innerHTML = "Video speed:" + playbackSpeed.toFixed(2);

	function forward(){
		console.log(seekOffset);
		console.log(audio.currentTime);
		audio.currentTime += seekOffset;
	  	if(video != undefined && video != null)
	   		video.currentTime += seekOffset;
	}

	function back(){
		audio.currentTime -= seekOffset;
	  	if(video != undefined && video != null)
	   		video.currentTime -= seekOffset;
	}

	function speedUp(){
		let new_speed = audio.playbackRate;
		if(new_speed + speedOffset > max_speed)
			new_speed = max_speed;
		else
			new_speed += speedOffset;
				
		audio.playbackRate = new_speed;
	  	if(video != undefined && video != null)
	   		video.playbackRate = new_speed;

		div.innerHTML = "Video speed:" + new_speed.toFixed(2);
	}

	function slowDown(){
		let new_speed = audio.playbackRate;
		if(new_speed - speedOffset < min_speed)
			new_speed = min_speed;
		else
			new_speed -= speedOffset;

		audio.playbackRate = new_speed;
		if(video != undefined && video != null)
	    	video.playbackRate = new_speed;

		div.innerHTML = "Video speed:" + new_speed.toFixed(2);
	}

	function resetSpeed(){
		audio.playbackRate = playbackSpeed;
		if(video != undefined && video != null)
	       video.playbackRate = playbackSpeed;

		div.innerHTML = "Video speed:" + audio.playbackRate.toFixed(2);
	}

	function toggleDarkMode(){
		darkMode = !darkMode;
		if(darkMode){
			navBar.style.backgroundColor = DARK_BACKGROUND;
			recordingTitle.style.color = TEXT_PRIMARY_DARK_MODE;
			sidebarIcon.style.color = TEXT_PRIMARY_DARK_MODE;
			chat.style.backgroundColor = DARK_BACKGROUND;
			chat.style.color = TEXT_PRIMARY_DARK_MODE;
			chat_area.style.backgroundColor = DARK_BACKGROUND;
			chatAreaSecond.style.backgroundColor = DARK_BACKGROUND;
			div.style.color = TEXT_PRIMARY_DARK_MODE;
			playBack.style.backgroundColor = DARK_BACKGROUND;

			btnToggleDarkMode.innerText = "Light"
			btnToggleDarkMode.style.color = TEXT_PRIMARY;
			btnToggleDarkMode.style.backgroundColor = LIGHT_BACKGROUND;
		}
		else{
			navBar.style.backgroundColor = LIGHT_BACKGROUND
			recordingTitle.style.color = TEXT_PRIMARY;
			sidebarIcon.style.color = TEXT_PRIMARY;
			chat.style.backgroundColor = LIGHT_BACKGROUND;
			chat.style.color = TEXT_PRIMARY;
			chat_area.style.backgroundColor = LIGHT_BACKGROUND;
			chatAreaSecond.style.backgroundColor = LIGHT_BACKGROUND;
			div.style.color = TEXT_PRIMARY;
			playBack.style.backgroundColor = LIGHT_BACKGROUND;

			btnToggleDarkMode.innerHTML = "Dark";
			btnToggleDarkMode.style.color = TEXT_PRIMARY_DARK_MODE;
			btnToggleDarkMode.style.backgroundColor = DARK_BACKGROUND;
		}
	}

	function setTransitions() {
		navBar.style.transitionDuration = TRANSITION_DURATION
		recordingTitle.style.transitionDuration = TRANSITION_DURATION
		sidebarIcon.style.transitionDuration = TRANSITION_DURATION
		chat.style.transitionDuration = TRANSITION_DURATION
		chat_area.style.transitionDuration = TRANSITION_DURATION
		chatAreaSecond.style.transitionDuration = TRANSITION_DURATION
		playBack.style.transitionDuration = TRANSITION_DURATION
		div.style.transitionDuration = TRANSITION_DURATION
		btnToggleDarkMode.style.transitionDuration = TRANSITION_DURATION
	}

	function createButton(color, symbol, func, append=false){
		let btn = document.createElement('button');
		btn.width = 100;
		btn.height = 100;
		btn.style.background = color;
		btn.innerHTML = symbol;
		btn.onclick = func;
		if(append)
			btn_div.appendChild(btn);

		return btn;
	}

	var btn_div = document.createElement('div');
	btn_div.id = "btn-div";
	btn_div.style.display = "block";
	btn_div.appendChild(div);
	createButton('gray', '&larr;', back, true);
	createButton('gray', '&rarr;', forward, true);
	createButton('green', '&uarr;', speedUp, true);
	createButton('red', '&darr;', slowDown, true);
	createButton('light blue', 'Reset', resetSpeed, true);
	var btnToggleDarkMode = createButton(DARK_BACKGROUND, "Dark", toggleDarkMode, true)
	chat_area = document.getElementById('chat-area');
	chat_area.insertBefore(btn_div, chat_area.firstChild);
	document.onkeydown = checkKey;

	var navBar = document.getElementById("navbar")
	var recordingTitle = document.getElementById("recording-title")
	var sidebarIcon = document.getElementsByClassName("sidebar-icon").item(0)
	var emptyVideoArea = document.getElementById("video")
	emptyVideoArea.style.height = "1px";
	var chat = document.getElementById("chat")
	chat.style.border = "0px";
	var chatAreaSecond = document.getElementsByClassName("inner-wrap").item(0)
	var playBack = document.getElementById("main-section")

	setTransitions()

	function checkKey(e) {

	    e = e || window.event;

	    if (e.keyCode == '38') {
	    	//up key
	        speedUp();
	    }
	    else if (e.keyCode == '40') {
	    	//down key
	        slowDown();
	    }
	    else if (e.keyCode == '37') {
	    	//left key
	       	back();
	    }
	    else if (e.keyCode == '39') {
	    	//right key
	       	forward();
	    }else if (e.keyCode == '32'){
	    	//space bar
	    	if(audio.paused)
	    		audio.play();
	    	else
	    		audio.pause();
	    }
	}

	// DEV NOTE: Use [chrome] for Google chrome, use [browser] for other browsers that support storage API
	chrome.runtime.onMessage.addListener((msg, sender, response) => {
		if(msg.target == 'speed_offset'){
			speedOffset = parseFloat(msg.value);
		} else if (msg.target == 'seek_offset'){
			seekOffset = parseFloat(msg.value);
		}
	});
}

function loop() { 
	var timer = setInterval(function() {checkLoaded(timer)}, 3000); 
}

if (window.attachEvent)
{
    window.attachEvent('onload', loop() );
}
else if (window.addEventListener)
{
    window.addEventListener('load',loop(), false);
}
else
{
    document.addEventListener('load', loop(), false);
} 