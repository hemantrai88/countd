<?php

	$tz = $_POST['tz'];

	$date = new DateTime(null, new DateTimeZone($tz));
	echo $date->getTimestamp();

?>