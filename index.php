<!doctype html>
<html lang="en">
   <head>
      <title>Test</title>

      <meta charset="utf-8">
      <meta name="description" content="I am testing Javascript">
      <meta name="author" content="Caleb Ziems">

      <link rel="stylesheet" href="styles.css">
		
      <script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.8.1/jquery.min.js"></script>
      <script type="text/javascript" src="script.js"></script>
   </head>
   <body>		
      <button type="button" id="startButton">
        <p id="ButtonText">Stop</p>
      </button>
			
      <div id="scroller" style="width: 1900px; height: 1060px; margin: 0 auto;">
        <div class="innerScrollArea">			
	   <?php
	      $speed = "";
	      $dir = "./images";
	      $file_types = array('jpg', 'jpeg', 'gif', 'png');
	      if (file_exists($dir) == true) {
		 echo "   <ul>";
		 $dir_contents = scandir($dir);		
		 foreach ($dir_contents as $file) {
		    $extention = pathinfo($file, PATHINFO_EXTENSION);
		    $name = basename($file);
		    $speed .= $name[3];
		    if (in_array($extention, $file_types) == true) {
                       $filename = $dir . "/" . $file;
                       list($width, $height, $type, $attr) = getimagesize($filename);
		       echo "\r\n	         ";
                       echo "<li><img src='" . $dir. "/" . $file . "' alt='" . $file . "' width='".$width."' height='".$height."'/></li>";
		    }
		  }
		  echo "\r\n          </ul>\r\n";
	       }
	       else {
		  echo "<p>Empty folder</p>";
	       }
	     ?>
       </div>
    </div>
    <div id="output">
	   <p id="cur"></p>
    </div>
       <?php
          echo "<p id='speeds'>" . $speed . "</p>\r\n";
       ?>
    </body>
</html>