function setSliderAndLabelValues(slider, label, value){
	slider.value = value;
	label.textContent = value;
}

document.addEventListener('DOMContentLoaded', function() {
	let speed_slider = document.getElementById('speed-offset');
	let seek_slider = document.getElementById('seek-offset');
	let speed_label = document.getElementById('speed-offset-label');
	let seek_label = document.getElementById('seek-offset-label');

	chrome.storage.local.get(["speed_offset"], (res) => 
		setSliderAndLabelValues(speed_slider, speed_label, res.speed_offset));
	chrome.storage.local.get(["seek_offset"], (res) => 
		setSliderAndLabelValues(seek_slider, seek_label, res.seek_offset));

	speed_slider.oninput = function() {
		chrome.storage.local.set({speed_offset: this.value}, () => speed_label.textContent = this.value);
		chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
			let active_tab = tabs[0];
			chrome.tabs.sendMessage(active_tab.id, {target: "speed_offset", value: this.value});
		});
	}

	seek_slider.oninput = function() {
		chrome.storage.local.set({seek_offset: this.value}, () => seek_label.textContent = this.value);
		chrome.tabs.query({currentWindow: true, active: true}, (tabs) => {
			let active_tab = tabs[0];
			chrome.tabs.sendMessage(active_tab.id, {target: "seek_offset", value: this.value});
		});
	}
});