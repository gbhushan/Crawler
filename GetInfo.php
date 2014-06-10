<?php
	if (isset($_GET['int_val'])) $UrlVal = $_GET['int_val'];
	else {
		throw "invalid value";
	}
	
	echo getContent($UrlVal);
	
	function getContent($val) {
		$value = $val;
		$url = "http://www.crunchyroll.com/tech-challenge/roaming-math/gbhushan@usc.edu/".$value;
		$data = file_get_contents($url, true);
		return $data;
	}
?>