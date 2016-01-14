		var ampm = 1;
		var active = 1;
		var secondId;
		var daysClock, hoursClock, minutesClock, secondsClock;
		var clockText = '';
		var returnURL = '';
		var params;


		$(document).ready(function() {

						var h = $(window).height();
						var m = h*0.10;
						console.log(m);
						h = h*0.75;

						$('#sinceDiv').css('height', h);
						$('#tillDiv').css('height', h);
						$('.innerDiv').css('margin-top', m);
			
			$(window).resize(function(){
				var h = $(window).height();

				var m = h*0.10;
				console.log(m);
				h = h*0.75;


				$('#sinceDiv').css('height', h);
				$('#tillDiv').css('height', h);
				$('.innerDiv').css('margin-top', m);

			});

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


			params = getUrlVars();

			if (!_.isEmpty(params)) {
				if (params.stamp !== undefined && !_.isEmpty(params.stamp) && params.tense !== undefined && !_.isEmpty(params.tense)) {
					showReturnClock();
				}
			}

			$('#sinceDiv').mouseover(function() {
				$('#sinceDiv').addClass('mdl-shadow--2dp');
			});

			$('#sinceDiv').mouseout(function() {
				$('#sinceDiv').removeClass('mdl-shadow--2dp');
			});

			$('#tillDiv').mouseover(function() {
				$('#tillDiv').addClass('mdl-shadow--2dp');
			});

			$('#tillDiv').mouseout(function() {
				$('#tillDiv').removeClass('mdl-shadow--2dp');
			});

			$('#sinceDiv').click(function() {
				$('#sinceDiv').css("width", "100%");
				$('#tillDiv').css("width", "0");
				$('#sinceDiv').html('');
				$('#tillDiv').html('');
				_.delay(function() {
					$('#tillDiv').fadeOut();
				}, 700);

				var page_base = $('#sinceDiv');
				$.ajax({
					url: "partials/till.html",
					context: page_base
				}).done(function(data) {
					$('#sinceDiv').html(data);
					var h = $(window).height();
					$('#sinceDiv').css('height', h*0.75);
					active = 2;
					onTimerLoad();
				});
			});

			$('#tillDiv').click(function() {
				$('#tillDiv').css("width", "100%");
				$('#sinceDiv').css("width", "0");
				$('#tillDiv').html('');
				$('#sinceDiv').html('');
				_.delay(function() {
					$('#sinceDiv').fadeOut();
				}, 700);

				var page_base = $('#tillDiv');
				$.ajax({
					url: "partials/till.html",
					context: page_base
				}).done(function(data) {
					$('#tillDiv').html(data);
					var h = $(window).height();
					$('#tillDiv').css('height', h*0.75);
					active = 3;
					onTimerLoad();
				});
			});


		});

		function onTimerLoad() {

			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth() + 1; //January is 0!

			var yyyy = today.getFullYear();
			if (dd < 10) {
				dd = '0' + dd
			}
			if (mm < 10) {
				mm = '0' + mm
			}
			var today = dd + '/' + mm + '/' + yyyy;
			$('#toDate').val(today);

			var date = new Date();

			if (active == 2) {
				var hrs = 00;
				var mins = 00;
				ampm = 1;
			} else if (active == 3) {
				var hrs = 11;
				var mins = 59;
				ampm = 2;
			}

			$('#selectAmPm').val(ampm);

			if (hrs !== 0) {
				hrs = hrs % 12;
				hrs = hrs ? hrs : 12; // the hour '0' should be '12'
			} else {
				hrs = "0" + hrs;
			}

			mins = mins < 10 ? '0' + mins : mins;

			console.log(hrs, mins, ampm);

			$('#toHrs').val(hrs);
			$('#toMins').val(mins);



			var timezone = jstz.determine();
			$.ajax({
				url: "getStamp.php",
				type: "POST",
				data: {
					tz: timezone.name()
				},
				success: function(result) {
					$("#div1").html(result);
				}
			});



			$('#toDate').bind('input propertychange', function() {
				var dateProvided = $(this).val();
				if (validDate(dateProvided)) {
					if (active == 2) {
						if (pastDate(dateProvided)) {
							$(this).removeClass('invalidInput');
							$('#toDateError').html('');
							$('#toDateFormat').hide();
						} else {
							$(this).addClass('invalidInput');
							$('#toDateFormat').show();
							$('#toDateError').html('Cannot count from the future');
						}
					} else if (active == 3) {
						if (futureDate(dateProvided)) {
							$(this).removeClass('invalidInput');
							$('#toDateError').html('');
							$('#toDateFormat').hide();
						} else {
							$(this).addClass('invalidInput');
							$('#toDateFormat').show();
							$('#toDateError').html('Cannot count from the future');
						}

					}
				} else {
					$(this).addClass('invalidInput');
					$('#toDateFormat').show();
					$('#toDateError').html('Please provide a valid date');
				}
			});

			$('#toHrs').change(function() {
				if ($(this).val() > 12) {
					$(this).val('12');
				} else if ($(this).val() < 0) {
					$(this).val('00');
				} else {
					if ($(this).val().length === 1) {
						var tempHrs = '0' + $(this).val();
						$(this).val(tempHrs);
					} else if ($(this).val().length === 0) {
						$(this).val('00');
					}
				}
			});

			$('#toMins').change(function() {
				if ($(this).val() > 60) {
					$(this).val('00');
				} else if ($(this).val() < 0) {
					$(this).val('00');
				} else {
					if ($(this).val().length === 1) {
						var tempMins = '0' + $(this).val();
						$(this).val(tempMins);
					} else if ($(this).val().length === 0) {
						$(this).val('00');
					}
				}
			});

			$('#selectAmPm').change(function() {
				ampm = $(this).val();
			});


			$('#startCount').click(function() {

				var sinceTill = '';

				if (active == 2) {
					secondId = setInterval(getPastCounter, 1000);
					sinceTill = 'Since';
				} else if (active == 3) {
					secondId = setInterval(getFutureCounter, 1000);
					sinceTill = 'Till';
				}

				$('#clockEventName').html($('#countToWhat').val());
				$('#clockTillSince').html(sinceTill);

				_.delay(function(){
					$('#showClock').css('height', $('#showDays').height()*1.2);
					console.log($('#showDays').height()*1.2);
				}, 1000);

				$('#showPage').fadeOut();
			});

			$('#customizeClockButton').click(function() {
				$('#customizeClockDiv').show();
			});

			$('#chooseColor').colorpicker();

			$('#switchColor').click(function() {

				var selectedColor = $('#chooseColor').val(); //'rgba(255,146,68,0.63)';

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

				$('.clockLabel').css('color', selectedColor);
			});


		}

		function validDate(dateProvided) {
			var reg = /^(((0[1-9]|[12]\d|3[01])\/(0[13578]|1[02])\/((19|[2-9]\d)\d{2}))|((0[1-9]|[12]\d|30)\/(0[13456789]|1[012])\/((19|[2-9]\d)\d{2}))|((0[1-9]|1\d|2[0-8])\/02\/((19|[2-9]\d)\d{2}))|(29\/02\/((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))))$/g;
			return reg.test(dateProvided);
		}

		function pastDate(dateProvided) {
			var splitDate, dd, mm, yy;
			var todayDate, tDD, tMM, tYY;

			todayDate = new Date();

			tDD = todayDate.getDate();
			tMM = todayDate.getMonth();
			tYY = todayDate.getFullYear();

			splitDate = dateProvided.split('/');
			dd = splitDate[0];
			mm = splitDate[1] - 1;
			yy = splitDate[2];

			if (yy == tYY) {
				if (mm == tMM) {
					if (dd > tDD) {
						return false;
					} else {
						return true;
					}
				} else if (mm > tMM) {
					return false;
				} else if (mm < tMM) {
					return true;
				}
			} else if (yy > tYY) {
				return false;
			} else if (yy < tYY) {
				return true;
			}

		}

		function futureDate(dateProvided) {

			var splitDate, dd, mm, yy;
			var todayDate, tDD, tMM, tYY;

			todayDate = new Date();

			tDD = todayDate.getDate();
			tMM = todayDate.getMonth();
			tYY = todayDate.getFullYear();

			splitDate = dateProvided.split('/');
			dd = splitDate[0];
			mm = splitDate[1] - 1;
			yy = splitDate[2];

			if (yy == tYY) {
				if (mm == tMM) {
					if (dd < tDD) {
						return false;
					} else {
						return true;
					}
				} else if (mm < tMM) {
					return false;
				} else if (mm > tMM) {
					return true;
				}
			} else if (yy < tYY) {
				return false;
			} else if (yy > tYY) {
				return true;
			}


		}

		function getPastCounter() {
			var dateProvided = $('#toDate').val();
			var hrsProvided = $('#toHrs').val();
			var minsProvided = $('#toMins').val();

			var splitDate, dd, mm, yy, hrs;

			splitDate = dateProvided.split('/');
			dd = splitDate[0];
			mm = splitDate[1] - 1;
			yy = splitDate[2];

			if (ampm === 2) {
				if (hrsProvided === 12) {
					hrs = hrsProvided;
				} else {
					hrs = parseInt(hrsProvided) + 12;
				}
			} else {
				if (hrsProvided === 12) {
					hrs = 0;
				} else {
					hrs = hrsProvided;
				}
			}

			var start = new Date(yy, mm, dd, hrs, minsProvided, 0, 0);
			var end = new Date();

			console.log('start(ts) => ', start.getTime());
			console.log('end =>', end.getTime());

			returnURL = 'http://hemant/countd?stamp=' + start.getTime() + '&tense=2';

			$("#showReturnURL").html(returnURL);

			var cd = countdown(start, end, ~countdown.MILLISECONDS);
			clockText = cd.toString();
			$('#showClockText').html(clockText);
			if (cd.value <= 0) {
				clearInterval(secondId);
			}

			var hours = (cd.hours < 10) ? '0' + cd.hours : cd.hours;
			var minutes = (cd.minutes < 10) ? '0' + cd.minutes : cd.minutes;
			var seconds = (cd.seconds < 10) ? '0' + cd.seconds : cd.seconds;

			days = parseInt(cd.value / 86400000);

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

		function getFutureCounter() {
			var dateProvided = $('#toDate').val();
			var hrsProvided = $('#toHrs').val();
			var minsProvided = $('#toMins').val();

			var splitDate, dd, mm, yy, hrs;

			splitDate = dateProvided.split('/');
			dd = splitDate[0];
			mm = splitDate[1] - 1;
			yy = splitDate[2];

			if (ampm === 2) {
				if (hrsProvided === 12) {
					hrs = hrsProvided;
				} else {
					hrs = parseInt(hrsProvided) + 12;
				}
			} else {
				if (hrsProvided === 12) {
					hrs = 0;
				} else {
					hrs = hrsProvided;
				}
			}

			var start = new Date();
			var end = new Date(yy, mm, dd, hrs, minsProvided, 0, 0);

			console.log('start =>', start, start.getTime());
			console.log('end(ts) => ', end, end.getTime());

			returnURL = 'http://hemant/countd?stamp=' + end.getTime() + '&tense=2';
			$("#showReturnURL").html(returnURL);

			var cd = countdown(start, end, ~countdown.MILLISECONDS);
			clockText = cd.toString();
			$('#showClockText').html(clockText);
			if (cd.value <= 0) {
				clearInterval(secondId);
			}

			var hours = (cd.hours < 10) ? '0' + cd.hours : cd.hours;
			var minutes = (cd.minutes < 10) ? '0' + cd.minutes : cd.minutes;
			var seconds = (cd.seconds < 10) ? '0' + cd.seconds : cd.seconds;

			days = parseInt(cd.value / 86400000);

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

		function showPastClock() {

			var ts = params.stamp;

			var start = new Date(parseInt(ts));
			var end = new Date();

			console.log('start(ts) => ', start.getTime());
			console.log('end => ', end);

			returnURL = 'http://hemant/countd?stamp=' + start.getTime() + '&tense=2';

			$("#showReturnURL").html(returnURL);

			var cd = countdown(start, end, ~countdown.MILLISECONDS);
			clockText = cd.toString();
			$('#showClockText').html(clockText);
			if (cd.value <= 0) {
				clearInterval(secondId);
			}

			var hours = (cd.hours < 10) ? '0' + cd.hours : cd.hours;
			var minutes = (cd.minutes < 10) ? '0' + cd.minutes : cd.minutes;
			var seconds = (cd.seconds < 10) ? '0' + cd.seconds : cd.seconds;

			days = parseInt(cd.value / 86400000);

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

		function showFutureClock() {

			var ts = params.stamp;

			var start = new Date();
			var end = new Date(parseInt(ts));

			console.log('ts ==> ', ts);
			console.log('new Date(ts) => ', new Date(ts));

			console.log('start =>', start, start.getTime());
			console.log('end => ', end, end.getTime());

			returnURL = 'http://hemant/countd?stamp=' + end.getTime() + '&tense=2';
			$("#showReturnURL").html(returnURL);

			var cd = countdown(start, end, ~countdown.MILLISECONDS);
			clockText = cd.toString();
			$('#showClockText').html(clockText);
			if (cd.value <= 0) {
				clearInterval(secondId);
			}

			var hours = (cd.hours < 10) ? '0' + cd.hours : cd.hours;
			var minutes = (cd.minutes < 10) ? '0' + cd.minutes : cd.minutes;
			var seconds = (cd.seconds < 10) ? '0' + cd.seconds : cd.seconds;

			days = parseInt(cd.value / 86400000);

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

		function getUrlVars() {
			var vars = [],
				hash;
			var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			return vars;
		}

		function showReturnClock() {
			var ts = params.stamp;
			var ct = new Date().getTime();
			console.log(ts, ct);
			if (ts > ct) {
				secondId = setInterval(showFutureClock, 1000);
				$('#showPage').fadeOut();
			} else {
				secondId = setInterval(showPastClock, 1000);
				$('#showPage').fadeOut();
			}
		}