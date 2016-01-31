<?php
if (! defined('DONE_SOLUINIT')) require('init.php');
$returnstring="";
$exampletext="Lorem ipsum dolor sit amet...";

//Example 1 insert text
switch($_REQUEST['example']){
	case 1: // insert text - replace existing content
			$returnstring=returnxml("replaceContent","result1",$exampletext."_".date("H:i:s",time()), $moreattr=array());
		    sendxml($returnstring);
		    break;
	case 2: //append text
			$returnstring=returnxml("appendContent","result2","<br>".$exampletext, $moreattr=array());
		    sendxml($returnstring);
		    break;
	case 3: // append link and format
			$returnstring=returnxml("appendContent","result3","<br><a class=\"solu\" href=\"".$_SERVER['PHP_SELF']."?pmode=ajax&example=3\">".$exampletext."</a>", $moreattr=array());
		    $returnstring.=returnxml("changeCSS","result3","red", $moreattr=array("name"=>"background-color"));
		    sendxml($returnstring);
		    break;
	case 4: // append posted form
			$returnstring=returnxml("appendContent","result4","<br>".$_REQUEST['text1'], $moreattr=array());
		    sendxml($returnstring);
		    break;
	case 5: // append an image
			$returnstring=returnxml("appendContent","result5","<br><img src='solu-files/sample_img.jpg' width='150px'>", $moreattr=array());
		    sendxml($returnstring);
		    break;
	case 6: // append options
			$returnstring=returnxml("appendContent","result6","<option>New option -".date("H:i:s",time())."</option>", $moreattr=array());
		    sendxml($returnstring);
		    break;
}
?>