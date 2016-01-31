<?php
 function returnxml($tag="",$id="",$content="", $moreattr=array()){
	$addattr="";
	if(is_array($moreattr)){
	    foreach($moreattr as $attname => $attval){
		$addattr.=" ".$attname."=\"".$attval."\"";
	    }
	}
	$str="<".$tag." id=\"".$id."\" $addattr><![CDATA[".$content."]]></".$tag.">";
	return $str;
    }

function returnjason($id="",$content=""){
	$str="<returnjason><![CDATA[".$content."]]></returnjason>";
	return $str;
    }

function sendxml($str = '') {
	$retdoc = new DOMDocument();
	$retdoc->loadXML("<root>".$str."</root>");
	$fullxml = $retdoc->saveXML();
	header('Content-Type: text/xml');
	header('Content-Length: '.strlen($fullxml));
	echo $fullxml;
    }
    
    
    $config = array();
    $lang = array();
    

   /*select correct mode for js or not*/
    define('PMODE',((isset($_REQUEST['pmode']))? $_REQUEST['pmode']:'html'));
    define('DONE_SOLUINIT',1);

	switch(PMODE){
		case "ajax":
			include("solu-files/ajaxfunctions.php");
		 	
		
	}
  	if(PMODE=="ajax") die();
?>