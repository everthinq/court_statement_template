$(document).ready(function() {	

	//Pop-up 
    $('.email_bt').click(function(event) {
    	$('.step5 .overlay').fadeIn();
    	$('.step5 .feedback_form').fadeIn();
    	return false;
    });
    $('.js-close-campaign').click(function(event) {
    	$('.step5 .overlay').fadeOut();
    	$('.step5 .feedback_form').fadeOut();
    	return false;
    });


    // Прогресс(статус) бар
    $('.step2bt_status').click(function(event) {
		var progressbar = $('#progressbar'),
		    max = 100,

		    // Указываем время в секундах
		    time = (1000/max)* 10,	

		    value = progressbar.val();

	    var loading = function() {
	        value += 1;
	        addValue = progressbar.val(value);

	        $('.progress-value').html(value + '%');

	        if (value == max) {
	            clearInterval(animate);
	            setTimeout(fadeStatusBar, 1500);
				$('.steps__item a').removeClass('active');
		    	$('.main .step').hide();
		    	$('#step2').fadeIn();
		        $('.step2_bt').addClass('active');
		    	return false;
	        }
	    };
    	$('.overlay_js').fadeIn();
    	var animate = setInterval(function() {
        	loading();
	    }, time);

		var fadeStatusBar = function() {
			$('.overlay_js').fadeOut();
		}		
    });


	// Табы
	$('.main .step').hide();
	$('.main .step:first').show();
	$('.steps__item:first a').addClass('active');
    $('.steps__item a').click(function(event) {
    	$('.main .step').hide();
    	$('.steps__item a').removeClass('active');
    	$(this).addClass('active');
    	var selectTab = $(this).attr("href");
    	$(selectTab).fadeIn();
    	$('#progressbar').val(0);
		return false;
    });
    $('.step_buttons a').click(function(event) {
    	$('.steps__item a').removeClass('active');
    	$('.main .step').hide();
    	var selectTab = $(this).attr("href");
    	$(selectTab).fadeIn();
    	$('#progressbar').val(0);
        return false;
    });


    // Подсветка табов
    $('.step1bt').click(function(event) {
    	$('.step1_bt').addClass('active');
    	return false;
    });
    $('.step2bt').click(function(event) {
    	$('.step2_bt').addClass('active');
    	return false;
    });
    $('.step3bt').click(function(event) {
    	$('.step3_bt').addClass('active');
    	return false;
    });
    $('.step4bt').click(function(event) {
    	$('.step4_bt').addClass('active');
    	return false;
    });
    $('.step5bt').click(function(event) {
    	$('.step5_bt').addClass('active');
    	return false;
    });

		
    // Автоматический переход к следующему инпуту
	$('#step4_rb3_input1').keyup(function(){
		var total = $(this).val().length;
		if ( total == 2 ) {
			$('#step4_rb3_input2').focus();
		} else {
			return false;
		}
	});
	$('#step4_rb3_input2').keyup(function(){
		var total = $(this).val().length;
		if ( total == 2 ) {
			$('#step4_rb3_input3').focus();
		} else {
			return false;
		}
	});
	$('#step4_rb3_input3').keyup(function(){
		var total = $(this).val().length;
		if ( total == 4 ) {
			$('#step4_rb3_input4').focus();
		} else {
			return false;
		}
	});
	$('#step4_rb3_input4').keyup(function(){
		var total = $(this).val().length;
		if ( total == 2 ) {
			$('#step4_rb3_input5').focus();
		} else {
			return false;
		}
	});
	$('#step4_rb3_input5').keyup(function(){
		var total = $(this).val().length;
		if ( total == 2 ) {
			$('#step4_rb3_input6').focus();
		} else {
			return false;
		}
	});


     // Ограничение на ввод букв
    $('input.number').bind("change keyup input click", function() {
	    if (this.value.match(/[^0-9]/g)) {
	        this.value = this.value.replace(/[^0-9]/g, '');
	    }
	});


    // Разблокировка форм
	$('#step3_appart6').on('change', function(){
		if($('#step3_appart6').prop('checked')){
			$('#step3_appart7').prop('disabled', false);
			$('#step3_appart7').focus();
		} else {
			$('#step3_appart7').prop('disabled', true);
		}
	});
	$('#step4_rb1').on('change', function(){
		if($('#step4_rb1').prop('checked')){
			$('.step4_rb1_inputs input').prop('disabled', false);
			$('.step4_rb1_inputs input.number').focus();
		} else {
			$('.step4_rb1_inputs input').prop('disabled', true);
		}
	});
	$('#step4_rb2').on('change', function(){
		if($('#step4_rb2').prop('checked')){
			$('.step4_rb2_inputs input').prop('disabled', false);
			$('.step4_rb2_inputs input.number').focus();
		} else {
			$('.step4_rb2_inputs input').prop('disabled', true);
		}
	});
	$('#step4_rb3').on('change', function(){
		if($('#step4_rb3').prop('checked')){
			$('.step4_rb3_inputs input').prop('disabled', false);
			$('#step4_rb3_input1').focus();
		} else {
			$('.step4_rb3_inputs input').prop('disabled', true);
		}
	});
	$('#step4_rb4').on('change', function(){
		if($('#step4_rb4').prop('checked')){
			$('#step4_rb5_input, .long_input').prop('disabled', false);
			$('#step4_rb5_input').focus();
			// Добавление формы по клику
			$(".add_bt__item").click(function() {
				$('.new_inputs').append('<div class="new_input clearfix"><input type="text" class="long_input"><img src="img/cancel.png" class="input_close"></div>');
				$('.long_input').focus();

				$(".new_input img").on("click", function() {
					$(this).parent('.new_input').remove();
				});

		    });
		} else {
			$('#step4_rb5_input, .long_input').prop('disabled', true);
			$(".add_bt__item").unbind('click');
		}
	});
	$('#step4_rb9').on('change', function(){
		if($('#step4_rb9').prop('checked')){
			$('#step4_rb6_input').prop('disabled', false);
			$('#step4_rb6_input').focus();
		} else {
			$('#step4_rb6_input').prop('disabled', true);
		}
	});
	$('#step4_rb10').on('change', function(){
		if($('#step4_rb10').prop('checked')){
			$('#step4_rb7_input').prop('disabled', false);
			$('#step4_rb7_input').focus();
		} else {
			$('#step4_rb7_input').prop('disabled', true);
		}
	});
	$('#step3_rb3').on('change', function(){
		if($('#step3_rb3').prop('checked')){
			$('#act_date').prop('disabled', false);
			$('#act_date').focus();
		} else {
			$('#act_date').prop('disabled', true);
		}
	});
	$('#step4_rb8').on('change', function(){
		if($('#step4_rb8').prop('checked')){
			$('#step4_rb9, #step4_rb10').prop('disabled', false);
			$('#step4_rb9, #step4_rb10').css('background', '#FAFAFA');
		} else {
			$('#step4_rb9, #step4_rb10').prop('disabled', true);
			$('#step4_rb9, #step4_rb10').css('background', '#E2E2E2');
		}
	});

	// Маска для форм ввода
	// 9 - это любая цифра (0 - 9)
	// Если использовать один класс, то работает некорректно
	$("#step4_1, #date1_1, #step4_4б, #date2_1, #act_date, #step4_rb1_input2, #step4_rb2_input2, #step4_rb6_input, #step4_rb7_input").mask("99/99/9999");


  	// Адаптивное меню(костыль)
	$('.steps_mob .steps__item .active').parent('.steps__item');
	
  	$('.steps_mob .steps__item .active').parent('.steps__item').css('display', 'block');

  	$('.steps_mob .steps__item .active').parent('.steps__item').next().css(
  		'display', 'block'
  	);

  	$('.steps_mob .steps__item .active').parent('.steps__item').next().children().css(
  		'background', 'url(./img/right-arrow.png) no-repeat 40px center'
  	);

  	$('.steps_mob .steps__item a, .step_buttons a').click(function(event) { 
	  	var active_step = $('.steps_mob .steps__item .active');
	  	var active_step_item = $('.steps_mob .active').parent('.steps__item');
	  	$('.steps_mob .steps__item').css('display', 'none');

	  	active_step_item.css('display', 'block');

	  	$('.steps_mob .steps__item').first().css('margin-left', '33.3333333%'); 

	  	active_step_item.prev().css('margin', '0'); 

	  	active_step_item.prev().css( 'display', 'block' );
	  	active_step_item.next().css( 'display', 'block' );

	  	active_step_item.prev().children().css('background', 'url(./img/left-arrow.png)');

	  	active_step_item.next().children().css( 'background', 'url(./img/right-arrow.png)');
	});
});

