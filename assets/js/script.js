		var ampm = 1;
		var secondId;
		var daysClock, hoursClock, minutesClock, secondsClock;

		$(document).ready(function(){

			daysClock = new ProgressBar.Circle('#daysClock', {
			    duration: 200,
			    color: "#333",
			    trailColor: "#ccc",
			    strokeWidth: 2.1,
			    trailWidth: 1.0,
			    easing: 'easeInOut'
			});
			hoursClock = new ProgressBar.Circle('#hoursClock', {
			    duration: 200,
			    color: "#333",
			    trailColor: "#ccc",
			    strokeWidth: 2.1,
			    trailWidth: 1.0,
			    easing: 'easeInOut'
			});
			minutesClock = new ProgressBar.Circle('#minutesClock', {
			    duration: 200,
			    color: "#333",
			    trailColor: "#ccc",
			    strokeWidth: 2.1,
			    trailWidth: 1.0,
			    easing: 'easeInOut'
			});
			secondsClock = new ProgressBar.Circle('#secondsClock', {
			    duration: 200,
			    color: "#333",
			    trailColor: "#ccc",
			    strokeWidth: 2.1,
			    trailWidth: 1.0,
			    easing: 'easeInOut'
			});

			

			var today = new Date();
		    var dd = today.getDate();
		    var mm = today.getMonth()+1; //January is 0!

		    var yyyy = today.getFullYear();
		    if(dd<10){
		        dd='0'+dd
		    } 
		    if(mm<10){
		        mm='0'+mm
		    } 
		    var today = dd+'/'+mm+'/'+yyyy;
		    $('#toDate').val(today);

		    var date = new Date();
		    var hrs = 11;
			var mins = 59;
			ampm = 2;
			if(ampm==1){
				$('#toAmPm').html('AM');
			}else{
				$('#toAmPm').html('PM');
			}

			if(hrs!==0){
				hrs = hrs % 12;
				hrs = hrs ? hrs : 12; // the hour '0' should be '12'
			}else{
				hrs = "0"+hrs;
			}
			
			mins = mins < 10 ? '0'+mins : mins;

			console.log(hrs, mins, ampm);

			$('#toHrs').val(hrs);
			$('#toMins').val(mins);

			

			var timezone = jstz.determine();
			$.ajax({
				url: "getStamp.php",
				type: "POST",
				data: {tz:timezone.name()},
				success: function(result){
		        	$("#div1").html(result);
		   		}
			});

			function validDate(dateProvided){
				var reg = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
				return reg.test(dateProvided);
			}

			$('#toDate').bind('input propertychange', function() {
				var dateProvided = $( this ).val();
				if(validDate(dateProvided)){
					$( this ).removeClass('invalidInput');
					$('#toDateError').html('');
					$('#toDateFormat').hide();
				}else{
					$( this ).addClass('invalidInput');
					$('#toDateFormat').show();
					$('#toDateError').html('Please provide a valid date');
				}
			});

			$('#toHrs').change(function(){
				if($( this ).val()>12){
					$( this ).val('12');
				}else if($( this ).val()<0){
					$( this ).val('00');
				}else{
					if($( this ).val().length===1){
						var tempHrs = '0'+$( this ).val();
						$( this ).val(tempHrs);
					}else if($( this ).val().length===0){
						$( this ).val('00');
					}
				}
			});

			$('#toMins').change(function(){
				if($( this ).val()>60){
					$( this ).val('00');
				}else if($( this ).val()<0){
					$( this ).val('00');
				}else{
					if($( this ).val().length===1){
						var tempMins = '0'+$( this ).val();
						$( this ).val(tempMins);
					}else if($( this ).val().length===0){
						$( this ).val('00');
					}
				}
			});

			$('#pickAm').click(function(){
				$('#toAmPm').html('AM');
				ampm = 1;
			});

			$('#pickPm').click(function(){
				$('#toAmPm').html('PM');
				ampm = 2;
			});

			$('#startCount').click(function(){
				secondId = setInterval(getCounter,1000);
			});

			$('#customizeClockButton').click(function(){
				$('#customizeClockDiv').show();
			});

			$('#chooseColor').colorpicker();

			$('#switchColor').click(function(){

				var selectedColor = 'rgba(255,146,68,0.63)';

				daysClock.destroy();

				daysClock = new ProgressBar.Circle('#daysClock', {
				    duration: 200,
				    color: selectedColor,
				    trailColor: "#ccc",
				    strokeWidth: 2.1,
				    trailWidth: 1.0,
				    easing: 'easeInOut'
				});

				hoursClock.destroy();

				hoursClock = new ProgressBar.Circle('#hoursClock', {
				    duration: 200,
				    color: selectedColor,
				    trailColor: "#ccc",
				    strokeWidth: 2.1,
				    trailWidth: 1.0,
				    easing: 'easeInOut'
				});

				minutesClock.destroy();

				minutesClock = new ProgressBar.Circle('#minutesClock', {
				    duration: 200,
				    color: selectedColor,
				    trailColor: "#ccc",
				    strokeWidth: 2.1,
				    trailWidth: 1.0,
				    easing: 'easeInOut'
				});

				secondsClock.destroy();

				secondsClock = new ProgressBar.Circle('#secondsClock', {
				    duration: 200,
				    color: selectedColor,
				    trailColor: "#ccc",
				    strokeWidth: 2.1,
				    trailWidth: 1.0,
				    easing: 'easeInOut'
				});
			});
		});

	function getCounter(){
		var dateProvided = $('#toDate').val();
		var hrsProvided = $('#toHrs').val();
		var minsProvided = $('#toMins').val();

		var splitDate, dd, mm, yy, hrs;

		splitDate = dateProvided.split('/');
		dd = splitDate[0];
		mm = splitDate[1]-1;
		yy = splitDate[2];

		if(ampm===2){
			if(hrsProvided===12){
				hrs = hrsProvided;
			}else{
				hrs = parseInt(hrsProvided)+12;	
			}		
		}else{
			if(hrsProvided===12){
				hrs = 0;
			}else{
				hrs = hrsProvided;	
			}		
		}

		var start = new Date();
		var end = new Date(yy, mm, dd, hrs, minsProvided, 0, 0);

		var cd = countdown( start, end, countdown.ALL);

		if(cd.value<=0){
			clearInterval(secondId);
		}

		var hours = (cd.hours<10)?'0'+cd.hours:cd.hours;
		var minutes = (cd.minutes<10)?'0'+cd.minutes:cd.minutes;
		var seconds = (cd.seconds<10)?'0'+cd.seconds:cd.seconds;

		days = parseInt(cd.value/86400000);

		$('.clockDiv').show();

		daysClock.animate(days / days, function() {
			daysClock.setText(days);
		});
		hoursClock.animate(hours / 24, function() {
			hoursClock.setText(hours);
		});
		minutesClock.animate(minutes / 60, function() {
			minutesClock.setText(minutes);
		});
		secondsClock.animate(seconds / 60, function() {
			secondsClock.setText(seconds);
		});

	}
