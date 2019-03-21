$(function(){

// The order and initial speed of each image is encoded in the image's file name.
// ./images/01-3.png is the first image to load and has a speed of 3. The 
// javascript might be cleaner if index.php encoded those two bits of information
// into an html tag instead.  I don't know. -LS
//


	
	// For testing purposes
	var outputC = function(txt) {
		document.getElementById('cur').innerHTML = txt;
	}
	
	var output = function(txt) {
		var paragraph = document.createElement("p");
		var node = document.createTextNode(txt);
		paragraph.appendChild(node);
		var output = document.getElementById("output");
		output.appendChild(paragraph);
	}

	// given an image URL, extract all the info that's contained in the filename.
	// (e.g. ID and speed)
	function getImageInfo(imageLocation) {
		// replace everything before the last / or \ with an empty string to get the filename.
		const fileName = imageLocation.replace(/^.*[\\\/]/, '');
		// remove the extension
		const fileNameWithoutExtension = fileName.split('.')[0];
		const [id, speed] = fileNameWithoutExtension.split('-').map(Number);
		return { id, speed };
	}
	
	// Setup
	var customizedSpeed = false; 
	var scroller = $('#scroller div.innerScrollArea');
	var startButton = $('#startButton');
	var boolSwitch = true;
	const speeds = new Array(scrollerContent.length);

	var currentX = 0;
	var listWidth = [0];
	scroller.children('img').each(function(){
		const { id, speed } = getImageInfo(this.src);
		speeds[id] = speed;
		var $this = $(this);
		currentX += $this.outerWidth(true);
		listWidth.push(currentX);
	});

	var fullW = currentX / 2;
	var viewportW = scroller.width();

	// Scroll Speed
	var controller = {curSpeed:0, fullSpeed:2};
	var $controller = $(controller);
	
	var toNewSpeed = function(newSpeed, duration)
	{
		if (duration === undefined)
			duration = 600;
		$controller.stop(true).animate({curSpeed:newSpeed}, duration);
	};

	// Pause on click
	var startStop = function() {
		if (boolSwitch == true) {
			toNewSpeed(0);
			boolSwitch = false;
			document.getElementById('ButtonText').innerHTML = 'Start';
		}
		else {
			toNewSpeed(controller.fullSpeed);
			boolSwitch = true;
			document.getElementById('ButtonText').innerHTML = 'Stop';
		}
	
	};
	startButton.click(startStop);
	
	// Start scrolling
	var pic = 0;
	var scroll = function()
	{
		var currentX = scroller.scrollLeft();
		var newX = currentX + controller.curSpeed;
		
		if (newX > fullW*2 - viewportW) {
			newX -= fullW;
			pic = 0;
		}
		scroller.scrollLeft(newX);
		
		if (listWidth[pic] < currentX) {
			if (customizedSpeed == false) {
				speed = speeds[pic + 1];
				toNewSpeed(speed);
			}
			pic += 1;
		}

	};
	
	setInterval(scroll, 20);
	toNewSpeed(controller.fullSpeed);
	
	// Keyboard Input
	//
	// I moved the event.preventDefault()s into the individual
	// key presses so that other keys would be passed on to the
	// browser. I also make the space bar the only pause toggle.
	// --LS 11.12.2016
	//

	$(document).keydown(function(event) {
		var speed = controller.curSpeed;
		if (event.which == '38') {  // up arrow
			if (speed < 6) {
				speed += 1;
			}
			customizedSpeed = true;
			toNewSpeed(speed);
		    event.preventDefault();
		}
		else if (event.which == '40') {  //down arrow
			if (speed > 0) {
				speed -= 1;
			}
			customizedSpeed = true;
			toNewSpeed(speed);
		    event.preventDefault();
		}
		else if (event.which == '32') {  //spacebar
			startStop();
			event.preventDefault();
		}
	});
	
});