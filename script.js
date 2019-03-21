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
	
	// Setup
	var speeds = $("#speeds").text();
	var customizedSpeed = false; 
	var scroller = $('#scroller div.innerScrollArea');
	var startButton = $('#startButton');
	var boolSwitch = true;
	var scrollerContent = scroller.children('ul');
	//
	// I commented out the following line. It seemed to duplicate each <li> image a
	// second time and that didn't seem right, but I could be wrong --LS 11.12.2016
	//
	//scrollerContent.children().clone().appendTo(scrollerContent);
	var currentX = 0;
	var listWidth = new Array();
	listWidth.push("0");
	scrollerContent.children().each(function(){
		var $this = $(this);
		$this.css('left', currentX);
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
				speed = speeds.charAt(pic+1);
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