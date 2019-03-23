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

	// given an image HTML element, extract all the info that's contained in the filename.
	// (e.g. ID and speed)
	function getImageInfo(image) {
		// replace everything before the last / or \ with an empty string to get the filename.
		const fileName = image.src.replace(/^.*[\\\/]/, '');
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
	const images = scroller.children('img');

	// Ensure that images in the scroller are ordered by ID from 1 to n.
	scroller.append(images.detach().sort(function(a, b) {
		return getImageInfo(a).id - getImageInfo(b).id;
	}));

	const speeds = new Array(images.length);
	images.each(function(){
		const { id, speed } = getImageInfo(this);
		speeds[id] = speed;
	});

	// Scroll Speed
	var controller = {curSpeed:0, fullSpeed:2};
	var $controller = $(controller);
	
	var toNewSpeed = function(newSpeed, duration) {
		if (duration === undefined)
			duration = 600;
		$controller.stop(true).animate({curSpeed:newSpeed}, duration);
	};

	// Pause on click
	var startStop = function() {
		if (boolSwitch) {
			toNewSpeed(0);
			boolSwitch = false;
			document.getElementById('ButtonText').innerHTML = 'Start';
		} else {
			toNewSpeed(controller.fullSpeed);
			boolSwitch = true;
			document.getElementById('ButtonText').innerHTML = 'Stop';
		}
	
	};
	startButton.click(startStop);
	
	// Start scrolling
	// Assumes images are 1-indexed
	var imgId = 1;
	// Represents the distance from the left edge of the leftmost image
	// to the left edge of the current image.
	// (e.g. given images of width [100, 150, 150] and currentX of 275, imgBoundary
	// should be 250)
	var imgBoundary = 0;
	// Represents how many pixels the image display is shifted to the left
	var currentX = 0;
	var scroll = function() {
		// if the current image is the last image, stop the scroll
		// (e.g. if we have images [1, 2, 3] and imgId is 3, stop scrolling)
		if (imgId >= images.length) {
			toNewSpeed(0);
			clearInterval(interval);
			return;
		}

		// add the current speed to the total distance scrolled
		currentX += controller.curSpeed;
		// shift the image display left by currentX pixels
		scroller[0].style.transform = `translateX(-${currentX}px)`
		// if we've crossed over into a new image,
		if (currentX > imgBoundary + images[imgId].width) {
			// if we haven't set a custom speed, change the speed to that of the new image
			if (!customizedSpeed) {
				speed = speeds[imgId + 1];
				toNewSpeed(speed);
			}
			// add the previous image's width to imgBoundary
			imgBoundary += images[imgId].width;
			// increase imgId by 1 (assumes image IDs progress linearly from 1 to n)
			imgId++;
		}
	};
	
	// start scrolling once the page loads, and adjust the speed to that of the first pic
	var interval = setInterval(scroll, 20);
	toNewSpeed(speeds[imgId]);
	
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