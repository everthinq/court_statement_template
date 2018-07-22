$(document).ready(function() {
    var additional_fields = 0;
    var total_ask = 0;

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

    var collectINN = function() {
        data = {
            'inn': $("#inn").val()
        }

        return data;
    };

    var collectEMAIL = function() {
        data = {
            'email': $('[name=email]').val(),
            'pdf_preview_src': $('#pdf_preview').attr('src')
        }

        return data;
    };

    $("#step5_email_form").submit(function(event) {        
        $.post('/app/email/', JSON.stringify(collectEMAIL()))
        .done(function(data) {
            if(data['status'] == 'success') {
                alert(data['message']);
                $('.step5 .overlay').fadeOut();
                $('.step5 .feedback_form').fadeOut();
                $('[name=email]').val("");
            } else {
                alert(data['message']);
                $('.step5 .overlay').fadeOut();
                $('.step5 .feedback_form').fadeOut();
                $('[name=email]').val("");
            }
        })
        return false;
    });

    // Прогресс(статус) бар
    /*input validation start*/
    $('.step2bt_status').click(function(event) {
        if($('#fio').val() != '') {
            activateTab('#step2');
            return;
        }

        if($("#inn").val().length < 10) {
            alert('ИНН содержит 10 или 12 цифр');
            return;
        }

        if($("#inn").val().length > 12) {
            alert('ИНН содержит 10 или 12 цифр');
            return;
        }

        if($("#inn").val() == '') {
            $("#inn").addClass('empty_field');
        setTimeout(function(){
            $("input#inn").focus();},100);
            return;
        } else {
            $("#inn").removeClass('empty_field');
        }
    /*input validation end*/
        $.post('/app/process_captcha/', JSON.stringify(collectINN()))
        .done(function(data) {
            if(data['status'] == 'ok') {
                $('#captcha_pdf').attr('src', data['link']);

                $('.steps__item a').removeClass('active');
                $('.main .step').hide();
                $('#step2').fadeIn();
                $('.step2_bt').addClass('active');
                $('.overlay_js').fadeOut();
            } 
        })
        .fail(function() {
            alert('Ошибка при обработке данных. Проверьте правильность введённого ИНН. Если ошибка повторяется, обратитесь к администратору.');
            location.reload(true);
        })

        var progressbar = $('#progressbar'),
        max = 100,

        // Указываем время в секундах
        time = (1000/max) * 20,  

        value = progressbar.val();

        var loading = function() {
            value += 1;
            addValue = progressbar.val(value);

            $('.progress-value').html(value + '%');

            if (value == max) {
                clearInterval(animate);
                return false;
            }
        };
        $('.overlay_js').fadeIn();
        var animate = setInterval(function() {
            loading();
        }, time);

    });

    var collectData = function() {
        var data = {
            'inn': $("#inn").val(),

            'fio': $("#fio").val(),
            'address': $("#address").val(),
            'company': $("#nickname").val(),
            'company_address': $("#address2").val(),
            'court_name': $("#sud").val(),
            'address_suda': $("#address_suda").val(),
            'court_place': parseInt($("input:radio[name=court_place]:checked").val()),

            'property_source': parseInt($("input:radio[name=property_source]:checked").val()),
            'appartment_type': parseInt($("input:radio[name=step3_appart]:checked").val()),
            'appartment_num': $("#appart_number").val(),
            'total_area': parseFloat($("#area").val().replace(',', '.')),
            'deal_price': parseFloat($("#step3_price").val().trim().replace(',', '.').replace(/\s+/g, '')),
            'transferred': parseInt($("input:radio[name=appartment_given]:checked").val()),
            'total_price': parseFloat($("#step3_total_price").val().trim().replace(',', '.').replace(/\s+/g, '') || $("#step3_price").val().trim().replace(',', '.').replace(/\s+/g, '')),
            
            'planned_transfer_date': $("#step4_1").val(),
            'payment_doc_type': $("input:checkbox[name=payment_doc_type]:checked").map(function(){return parseInt($(this).val());}).get() || [],
            'ask_type': $("input:checkbox[name=ask_type]:checked").map(function(){return parseInt($(this).val());}).get() || [],
            'precourt_letter': parseInt($("input:checkbox[name=precourt_letter]:checked").val()),
            'total_ask': total_ask
        };

        data['ddu_date'] = $("#date1_1").val();
        data['ddu_num'] = $("#date1_2").val();
        if(data['property_source'] == 2) {
            // Переуступка
            data['prop_transfer_date'] = $("#date2_1").val();
            data['prop_transfer_num'] = $("#date2_2").val();
        }

        if(data['transferred']) {
            data['transfer_act_date'] = $("#act_date").val();
        }

        if(data['payment_doc_type'].indexOf(1) >= 0) {
            // Платежное поручение
            data['plat_por_num'] = $("#plat_por_num").val();
            data['plat_por_date'] = $("#step4_rb1_input2").val();
        }
        if(data['payment_doc_type'].indexOf(2) >= 0) {
            // Квитанция к приходному кассовому ордеру
            data['order_num'] = $("#order_num").val();
            data['order_date'] = $("#step4_rb2_input2").val();
        }
        if(data['payment_doc_type'].indexOf(3) >= 0) {
            // Акт сверки взаиморассчетов
            data['act_start'] = [
                $("#step4_rb3_input1").val(),
                $("#step4_rb3_input2").val(),
                $("#step4_rb3_input3").val()
            ];
            data['act_end'] = [
                $("#step4_rb3_input4").val(),
                $("#step4_rb3_input5").val(),
                $("#step4_rb3_input6").val()
            ];
        }
        if(data['payment_doc_type'].indexOf(4) >= 0) {
            // Другое
            data['step4_akkreditivNUM'] = $("#step4_akkreditivNUM").val();
            data['step4_akkreditivDATE'] = $("#step4_akkreditivDATE").val();
            data['payment_extras'] = additional_fields;
        }

        if(data['ask_type'].indexOf(2)>=0) {
            // Убытки по аренде квартиры
            data['rent_type'] = parseInt($("input:radio[name=step4_rb_arenda]:checked").val());
            data['rent_date'] = $("#step4_4").val();
            data['rent_price'] = parseFloat($("#step4_5").val().replace(',', '.'));
            data['rent_total'] = $("#step4_6").val();
        }
        if(data['ask_type'].indexOf(3)>=0) {
            // Моральный ущерб
            data['moral_harm_cost'] = parseFloat($("#step4_2").val().replace(',', '.'));
            data['moral_harm_desc'] = $("#step4_3").val();
        }
        if(data['ask_type'].indexOf(4)>=0) {
            // Штраф по Закону о защите прав потребителей

        }

        switch(data['precourt_letter']) {
            case 1: // По почте
                data['precourt_postbox_date'] = $("#step4_rb6_input").val();
                break;
            case 2: // В офисе
                data['precourt_office_date'] = $("#step4_rb7_input").val();
                break;
        }

        return data;
    };

    var daysDiff = function(date1, date2) {
        var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds

        return Math.round(Math.abs((date1.getTime() - date2.getTime())/(oneDay)));
    };

    var str2date = function(date_str) {
        var parts = date_str.split('/');
        return new Date(parts[2], parts[1], parts[0])
    };

    var change_total_ask = function() {
        var ask_type = $("input:checkbox[name=ask_type]:checked").map(function(){return parseInt($(this).val());}).get() || []
        var total_price = parseFloat($("#step3_total_price").val().trim().replace(',', '.').replace(/\s+/g, '') || $("#step3_price").val().trim().replace(',', '.').replace(/\s+/g, '') || '0');
        var moral_harm_cost = parseFloat($("#step4_2").val().trim().replace(',', '.').replace(/\s+/g, '') || '0');
        var rent_total = parseFloat($("#step4_6").val().trim().replace(',', '.').replace(/\s+/g, '') || '0');
        var transferred = parseInt($("input:radio[name=appartment_given]:checked").val());

        var planned_date = null;
        try {
            planned_date = str2date($("#step4_1").val());
        }
        catch(e) {}

        var transfer_date = null;
        if(transferred) {
            try {
                transfer_date = str2date($("#act_date").val());
            }
            catch(e) {}
        } else {
            transfer_date = new Date();
        }

        var penalty_days = 0;
        if(planned_date && !isNaN(planned_date.getTime()) && transfer_date && !isNaN(transfer_date.getTime())) {
            penalty_days = daysDiff(transfer_date, planned_date);
        }

        var penalty = Math.round(9*total_price*penalty_days/150)/100;
        total_ask = penalty;
        if(ask_type.indexOf(2)>=0)
            total_ask += rent_total;
        if(ask_type.indexOf(3)>=0)
            total_ask += moral_harm_cost;
        $("#total_ask").text(''+total_ask);
    };

    $("#step3_total_price,#step3_price,#step4_1,#step4_2,#step4_6,#act_date,input:checkbox[name=ask_type]").each(function(idx, input) {
        $(input).on("change", change_total_ask);
    });

    var activateTab = function(tab) {
        $('.steps__item a').removeClass('active');
        $('.main .step').hide();
        $(tab).fadeIn();
        $('a[href=\\'+tab+']').addClass('active');
        $('#progressbar').val(0);
    };

    var showTab = function(tab) {
// start input validation
        if(tab == '#step1') {
            activateTab(tab);
            $('#inn').focus();
        }

        if(tab == '#step2') {
            if($('#fio').val() != '') {
                activateTab(tab);
                return;
            }
            
            if($("#inn").val().length < 10) {
                alert('ИНН содержит 10 или 12 цифр');
                return;
            }

            if($("#inn").val().length > 12) {
                alert('ИНН содержит 10 или 12 цифр');
                return;
            }
            
            if($("#inn").val() == '') {
                $("#inn").addClass('empty_field');
                $('#inn').focus();
                return;
            } else {
                $("#inn").removeClass('empty_field');
            }

            $.post('/app/process_captcha/', JSON.stringify(collectINN()))
            .done(function(data) {
                if(data['status'] == 'ok') {
                    $('#captcha_pdf').attr('src', data['link']);

                    $('.steps__item a').removeClass('active');
                    $('.main .step').hide();
                    $('#step2').fadeIn();
                    $('.step2_bt').addClass('active');
                    $('.overlay_js').fadeOut();
                }
            })
            .fail(function() {
                alert('Ошибка при обработке данных. Проверьте правильность введённого ИНН. Если ошибка повторяется, обратитесь к администратору.');  
                location.reload(true);
            })

            var progressbar = $('#progressbar'),
            max = 100,

            // Указываем время в секундах
            time = (1000/max) * 20,  

            value = progressbar.val();

            var loading = function() {
                value += 1;
                addValue = progressbar.val(value);

                $('.progress-value').html(value + '%');

                if (value == max) {
                    clearInterval(animate);
                    return false;
                }
            };
            $('.overlay_js').fadeIn();
            var animate = setInterval(function() {
                loading();
            }, time);

        }

        if(tab == '#step3') {
            if($("#fio").val() == '') {
                $("#fio").addClass('empty_field');
            } else {
                $("#fio").removeClass('empty_field');
            }
            if($("#address").val() == '') {
                $("#address").addClass('empty_field');
            } else {
                $("#address").removeClass('empty_field');
            }
            if($("#nickname").val() == '') {
                $("#nickname").addClass('empty_field');
            } else {
                $("#nickname").removeClass('empty_field');
            }
            if($("#address2").val() == '') {
                $("#address2").addClass('empty_field');
            } else {
                $("#address2").removeClass('empty_field');
            }
            if($("#sud").val() == '') {
                $("#sud").addClass('empty_field');
            } else {
                $("#sud").removeClass('empty_field');
            }
            if($("#address_suda").val() == '') {
                $("#address_suda").addClass('empty_field');
            } else {
                $("#address_suda").removeClass('empty_field');
            }
            // focus start
            if($("#fio").val() == '') {
                $('#fio').focus();
                $("#fio")[0].scrollIntoView();
                return;
            }
            if($("#address").val() == '') {
                $('#address').focus();
                $("#address")[0].scrollIntoView();
                return;
            }
            if($("#nickname").val() == '') {
                $('#nickname').focus();
                $("#nickname")[0].scrollIntoView();
                return;
            }
            if($("#address2").val() == '') {
                $('#address2').focus();
                $("#address2")[0].scrollIntoView();
                return;
            }
            if($("#sud").val() == '') {
                $('#sud').focus();
                $("#sud")[0].scrollIntoView();
                return;
            }
            if($("#address_suda").val() == '') {
                $('#address_suda').focus();
                $("#address_suda")[0].scrollIntoView();
                return;
            }
            // focus end
            if($("#fio").val() != ''
            && $("#address").val() != ''
            && $("#nickname").val() != ''
            && $("#address2").val() != ''
            && $("#sud").val() != ''
            && $("#address_suda").val() != ''
            ) {
                activateTab(tab);
            }
        }

        if(tab == '#step4') {
            if(isNaN(parseInt($("input:radio[name=property_source]:checked").val()) ) == true ) {
                $("#pravo_na_kvartiru").addClass('empty_field');
            } else {
                $("#pravo_na_kvartiru").removeClass('empty_field');
            }
            if($("input:radio[name=property_source]:checked").val() == '1') {
                if($("#date1_1").val() == '') {
                    $("#date1_1").addClass('empty_field');
                } else {
                    $("#date1_1").removeClass('empty_field');
                }
                if($("#date1_2").val() == '') {
                    $("#date1_2").addClass('empty_field');
                } else {
                    $("#date1_2").removeClass('empty_field');
                }
            } else {
                $("#date1_1").removeClass('empty_field');
                $("#date1_2").removeClass('empty_field');
            }
            if($("input:radio[name=property_source]:checked").val() == '2') {
                if($("#date1_1").val() == '') {
                    $("#date1_1").addClass('empty_field');
                } else {
                    $("#date1_1").removeClass('empty_field');
                }
                if($("#date1_2").val() == '') {
                    $("#date1_2").addClass('empty_field');
                } else {
                    $("#date1_2").removeClass('empty_field');
                }
                if($("#date2_1").val() == '') {
                    $("#date2_1").addClass('empty_field');
                } else {
                    $("#date2_1").removeClass('empty_field');
                }
                if($("#date2_2").val() == '') {
                    $("#date2_2").addClass('empty_field');
                } else {
                    $("#date2_2").removeClass('empty_field');
                }
            } else {
                $("#date2_1").removeClass('empty_field');
                $("#date2_2").removeClass('empty_field');
            }
            if(isNaN( parseInt($("input:radio[name=step3_appart]:checked").val()) ) == true) {
                $("#step3_radio_box").addClass('empty_field');
            } else {
                $("#step3_radio_box").removeClass('empty_field');
            }
            if($("#appart_number").val() == '') {
                $("#appart_number").addClass('empty_field');
            } else {
                $("#appart_number").removeClass('empty_field');
            }
            if($("#area").val() == '') {
                $("#area").addClass('empty_field');
            } else {
                $("#area").removeClass('empty_field');
            }
            if($("#step3_price").val() == '') {
                $("#step3_price").addClass('empty_field');
            } else {
                $("#step3_price").removeClass('empty_field');
            }
            if($("input:radio[name=appartment_given]:checked").val() == "1") {
                if($('#act_date').val() == '') {
                    $("#act_date").addClass('empty_field');
                } else {
                    $("#act_date").removeClass('empty_field');
                }
            } else {
                $("#act_date").removeClass('empty_field');
            }
            if(isNaN(parseInt($("input:radio[name=appartment_given]:checked").val())) == true) {
                $("#label_for_appartment_given").addClass('empty_field');
                return;
            } else {
                $("#label_for_appartment_given").removeClass('empty_field');
            }
            // focus start
            if(isNaN(parseInt($("input:radio[name=property_source]:checked").val()) ) == true ) {
                // $("pravo_na_kvartiru")[0].scrollIntoView();
                return;
            }
            if($("input:radio[name=property_source]:checked").val() == '1') {
                if($("#date1_1").val() == '') {
                    $('#date1_1').focus();
                    $("#date1_1")[0].scrollIntoView();
                    return;
                }
                if($("#date1_2").val() == '') {
                    $('#date1_2').focus();
                    $("#date1_2")[0].scrollIntoView();
                    return;
                }
            }
            if($("input:radio[name=property_source]:checked").val() == '2') {
                if($("#date1_1").val() == '') {
                    $('#date1_1').focus();
                    $("#date1_1")[0].scrollIntoView();
                    return;
                }
                if($("#date1_2").val() == '') {
                    $('#date1_2').focus();
                    $("#date1_2")[0].scrollIntoView();
                    return;
                }
                if($("#date2_1").val() == '') {
                    $('#date2_1').focus();
                    $("#date2_1")[0].scrollIntoView();
                    return;
                }
                if($("#date2_2").val() == '') {
                    $('#date2_2').focus();
                    $("#date2_2")[0].scrollIntoView();
                    return;
                }
            }
            if(isNaN( parseInt($("input:radio[name=step3_appart]:checked").val()) ) == true) {
                // $("#step3_radio_box").scrollIntoView();
                // return;
            }
            if($("#appart_number").val() == '') {
                $('#appart_number').focus();
                $("#appart_number")[0].scrollIntoView();
                return;
            }
            if($("#area").val() == '') {
                $('#area').focus();
                $("#area")[0].scrollIntoView();
                return;
            }
            if($("#step3_price").val() == '') {
                $('#step3_price').focus();
                $("#step3_price")[0].scrollIntoView();
                return;
            }
            if($("input:radio[name=appartment_given]:checked").val() == "1") {
                if($('#act_date').val() == '') {
                    $('#act_date').focus();
                    $("#act_date")[0].scrollIntoView();
                    return; 
                }
            }
            // focus end
            if(isNaN( parseInt($("input:radio[name=step3_appart]:checked").val()) ) != true  
            && $("#step3_price").val() != ''
            && $("#area").val() != ''
            && $("#appart_number").val() != ''
            ) {
                activateTab(tab);
            }
        }

        if(tab == '#step5') {
            if($("#step4_1").val() == '') {
                $("#step4_1").addClass('empty_field');
            } else {
                $("#step4_1").removeClass('empty_field');
            }
            if(isNaN( parseInt($("input:radio[name=step4_rb_arenda]:checked").val()) ) == false) {
                if($("#step4_4").val() == '') {
                    $("#step4_4").addClass('empty_field');
                } else {
                    $("#step4_4").removeClass('empty_field');
                }
                if($("#step4_5").val() == '') {
                    $("#step4_5").addClass('empty_field');
                } else {
                    $("#step4_5").removeClass('empty_field');
                }
                if($("#step4_6").val() == '') {
                    $("#step4_6").addClass('empty_field');
                } else {
                    $("#step4_6").removeClass('empty_field');
                }
            }
            if($("input:checkbox[name=ask_type]:checked").val() == '3') {
                if($("#step4_2").val() == '') {
                    $("#step4_2").addClass('empty_field');
                } else {
                    $("#step4_2").removeClass('empty_field');
                }
                if($("#step4_3").val() == '') {
                    $("#step4_3").addClass('empty_field');
                } else {
                    $("#step4_3").removeClass('empty_field');
                }
            } else {
                $("#step4_2").removeClass('empty_field');
                $("#step4_3").removeClass('empty_field');
            }
            if($("input:checkbox[name=payment_doc_type]:checked").map(function(){return parseInt($(this).val());}).length == 0) {
                $("#step4_payments_docs").addClass('empty_field');
            } else {
                $("#step4_payments_docs").removeClass('empty_field');
            }
            var payment_doc_type = $("input:checkbox[name=payment_doc_type]:checked").map(function(){return parseInt($(this).val());}).get() || []
            if(payment_doc_type.includes(1) == true) {
                if($("#plat_por_num").val() == ''
                || $("#step4_rb1_input2").val() == '') {
                    $("#step4_platejnoe_poruchenie").addClass('empty_field');
                } else {
                    $("#step4_platejnoe_poruchenie").removeClass('empty_field');
                }
            } else {
                $("#step4_platejnoe_poruchenie").removeClass('empty_field');
            }
            if(payment_doc_type.includes(2) == true) {
                if($("#order_num").val() == ''
                || $("#step4_rb2_input2").val() == '') {
                    $("#step4_kvitanciya").addClass('empty_field');
                } else {
                    $("#step4_kvitanciya").removeClass('empty_field');
                }
            } else {
                $("#step4_kvitanciya").removeClass('empty_field');
            }

            if($('#step4_rb4_akkreditiv').is(":checked")) {
                if($("#step4_akkreditivNUM").val() == ''
                || $("#step4_akkreditivDATE").val() == ''
                || $("#step4_akkreditivDATE").val() == '__/__/____') {
                    $("#step4_inputs_akkreditiv").addClass('empty_field');
                    $("#step4_akkreditivNUM").focus();
                    return;
                } else {
                    $("#step4_inputs_akkreditiv").removeClass('empty_field');
                }
            } else {
                $("#step4_inputs_akkreditiv").removeClass('empty_field');
            }

            if(payment_doc_type.includes(3) == true) {
                if($("#step4_rb3_input1").val() == ''
                || $("#step4_rb3_input2").val() == ''
                || $("#step4_rb3_input3").val() == ''
                || $("#step4_rb3_input4").val() == ''
                || $("#step4_rb3_input5").val() == ''
                || $("#step4_rb3_input6").val() == '') {
                    $("#step4_akt").addClass('empty_field');
                } else {
                    $("#step4_akt").removeClass('empty_field');
                }
            } else {
                $("#step4_akt").removeClass('empty_field');
            }
            
            if ($('#step4_rb6').is(":checked")) {
                $('#step4_rb11').addClass('empty_field').focus()[0].scrollIntoView();
                $("#step4_rb12").addClass('empty_field');
                if($(step4_rb11).prop("checked") == true || $(step4_rb12).prop("checked") == true) {
                    $("#step4_rb11").removeClass('empty_field');
                    $("#step4_rb12").removeClass('empty_field');
                } else {
                    return;
                }
            } else {
                $("#step4_rb11").removeClass('empty_field');
                $("#step4_rb12").removeClass('empty_field');
            }

            if ($('#step4_rb9').is(":checked")) {
                $("#step4_rb6_input").addClass('empty_field');
            } else {
                $("#step4_rb6_input").removeClass('empty_field');
            }

            // focus start
            if(payment_doc_type.includes(1) == true) {
                if($("#plat_por_num").val() == '') {
                    $('#plat_por_num').focus();
                    $("#plat_por_num")[0].scrollIntoView();
                    return;
            }
                if($("#step4_rb1_input2").val() == ''
                || $("#step4_rb1_input2").val() == "__/__/____") {
                    $('#step4_rb1_input2').focus();
                    $("#step4_rb1_input2")[0].scrollIntoView();
                    return;
                }
            }
            if(payment_doc_type.includes(2) == true) {
                if($("#order_num").val() == '') {
                    $('#order_num').focus();
                    $("#order_num")[0].scrollIntoView();
                    return;
            }
                if($("#step4_rb2_input2").val() == ''
                || $("#step4_rb2_input2").val() == "__/__/____") {
                    $('#step4_rb2_input2').focus();
                    $("#step4_rb2_input2")[0].scrollIntoView();
                    return;
                }
            }
            if(payment_doc_type.includes(3) == true) {
                if($("#step4_rb3_input1").val() == ''
                || $("#step4_rb3_input2").val() == ''
                || $("#step4_rb3_input3").val() == ''
                || $("#step4_rb3_input4").val() == ''
                || $("#step4_rb3_input5").val() == ''
                || $("#step4_rb3_input6").val() == '') {
                    $('#step4_rb3_input1').focus();
                    $("#step4_rb3_input1")[0].scrollIntoView();
                    return;
                }
            }
            if($("#step4_1").val() == '') {
                $('#step4_1').focus();
                $("#step4_1")[0].scrollIntoView();
                return;
            }
            if($("input:checkbox[name=ask_type]:checked").val() == '3') {
                if($("#step4_2").val() == '') {
                    $('#step4_2').focus();
                    $("#step4_2")[0].scrollIntoView();
                    return;
                }
                if($("#step4_3").val() == '') {
                    $('#step4_3').focus();
                    $("#step4_3")[0].scrollIntoView();
                    return;
                }
            }
            if(isNaN( parseInt($("input:radio[name=step4_rb_arenda]:checked").val()) ) == false) { 
                if($("#step4_4").val() == '') {
                    $('#step4_4').focus();
                    $("#step4_4")[0].scrollIntoView();
                    return;
                }
                if($("#step4_5").val() == '') {
                    $('#step4_5').focus();
                    $("#step4_5")[0].scrollIntoView();
                    return;
                }
                if($("#step4_6").val() == '') {
                    $('#step4_6').focus();
                    $("#step4_6")[0].scrollIntoView();
                    return;
                }
            }
            if($("input:checkbox[name=payment_doc_type]:checked").map(function(){return parseInt($(this).val());}).length == 0) {
                return;
            }

            // Моральный ущерб 
            if($('#step4_rb7').is(":checked")) {
                if($("#step4_2").val() == '') {
                    $("#step4_2").addClass('empty_field');
                    $('#step4_2').focus();
                    $("#step4_2")[0].scrollIntoView();
                    return;
                } else {
                    $("#step4_2").removeClass('empty_field');
                }
                if($("#step4_3").val() == '') {
                    $("#step4_3").addClass('empty_field');
                    $('#step4_3').focus();
                    $("#step4_3")[0].scrollIntoView();
                    return;
                } else {
                    $("#step4_3").removeClass('empty_field');
                }
            } else {
                $("#step4_2").removeClass('empty_field');
                $("#step4_3").removeClass('empty_field');
            }

            // Проверка наличия досудебного извещения
            var shtraf_po_zakonu = $("input:checkbox[name=ask_type]:checked").map(function(){return parseInt($(this).val());}).get() || []
            if(shtraf_po_zakonu.includes(4) == true) {
                var precourt_boxes = $("input:checkbox[name=precourt_letter]");
                var precourt_letter = precourt_boxes.filter(":checked").map(function(){return parseInt($(this).val());}).get() || [];
                if(precourt_letter.length == 0) {
                    precourt_boxes.addClass('empty_field').focus()[0].scrollIntoView();
                    return;
                } else {
                    precourt_boxes.removeClass('empty_field');
                }

                if ($('#step4_rb9').is(":checked")) {
                    $("#step4_rb6_input").addClass('empty_field');
                    if ($("#step4_rb6_input").val() == '') {
                        $('#step4_rb6_input').focus();
                        $("#step4_rb6_input")[0].scrollIntoView();
                        return;
                    } else {
                        $("#step4_rb6_input").removeClass('empty_field');
                    }
                } else {
                    $("#step4_rb6_input").removeClass('empty_field');
                }

                if ($('#step4_rb10').is(":checked")) {
                    $("#step4_rb7_input").addClass('empty_field');
                    if ($("#step4_rb7_input").val() == '') {
                        $('#step4_rb7_input').focus();
                        $("#step4_rb7_input")[0].scrollIntoView();
                        return;
                    } else {
                        $("#step4_rb7_input").removeClass('empty_field');
                    }
                } else {
                    $("#step4_rb7_input").removeClass('empty_field');
                } 
            } else { 
                $("#step4_rb9").removeClass('empty_field');
                $("#step4_rb10").removeClass('empty_field');
            }
            // focus end
// end of input validation

            $.post('/app/process_data/', JSON.stringify(collectData()))
            .done(function(data) {
                if(data['status'] == 'ok') {
                    $('#pdf_preview').attr('src', data['link']);
                    $("a.print_bt").click(function() {
                        document.getElementById("pdf_preview").contentWindow.print();
                    });
                    $("a.download_bt").attr('href', data['link']).attr('target', '_blank');

// continue input validation
                    if(isNaN( parseInt($("input:radio[name=step4_rb_arenda]:checked").val()) ) == false) {
                        if($("#step4_1").val() != '' 
                        && $("#step4_4").val() != ''
                        && $("#step4_5").val() != ''
                        && $("#step4_6").val() != ''
                        ) {
                            activateTab(tab);
                        }
                    } else {
                        if($("#step4_1").val() != '' 
                        ) {
                            activateTab(tab);
                        }
                    }
// end of continue input validation

                } else {
                    alert(data['message']);
                }
            })
            .fail(function() {
                alert("Не удалось сформировать документ. Проверьте входные данные.");
            })
            .always(function() {

            });
        }
    };

    // Табы
    $('.main .step').hide();
    $('.main .step:first').show();
    $('.steps__item:first a').addClass('active');
    $('.steps__item a').click(function(event) {
        showTab($(this).attr("href"));
        return false;
    });
    $('.step_buttons a').click(function(event) {
        showTab($(this).attr("href"));
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

    var check_float = function(value, max_decimals) {
        max_decimals = max_decimals || 0;
        if(value.match(/[0-9\.,]/g)) {
            var dot_pos = value.indexOf('.');
            if(dot_pos == -1)
                dot_pos = value.indexOf(',');
            if(dot_pos >= 0) {
                var ending = value.substr(dot_pos+1);
                if(ending.length>0) {
                    var extra_dot_pos = ending.indexOf('.');
                    if(extra_dot_pos==-1)
                        extra_dot_pos = ending.indexOf(',');
                    if(extra_dot_pos>=0) {
                        return value.substr(0, dot_pos+extra_dot_pos+1);
                    } else if(max_decimals>0 && ending.length > max_decimals){
                        return value.substr(0, dot_pos+max_decimals+1);
                    }
                }
            }
            return value;
        } else {
            return value.replace(/[^0-9\.,]/g, '');
        }
    }

    // Ввод дробных чисел
    $('input.float').bind("change keyup input click", function() {
        this.value = check_float(this.value, -1);
    });

    // Ввод цен
    $('input.price').bind("change keyup input click", function() {
        this.value = check_float(this.value, 2);
    });

    // Разблокировка форм
    $('#step4_rb6').on('change', function(){
        if($('#step4_rb6').prop('checked')){            
            $('#step4_rb11, #step4_rb12, #step4_4, #step4_5, #step4_6').prop('disabled', false);
            $('#step4_rb11, #step4_rb12, #step4_4, #step4_5, #step4_6').css('background', '#FAFAFA');
        } else {
            $('#step4_rb11, #step4_rb12, #step4_4, #step4_5, #step4_6').prop('disabled', true);
            $('#step4_rb11, #step4_rb12, #step4_4, #step4_5, #step4_6').css('background', '#E2E2E2');

            $("#step4_4").val('');
            $("#step4_5").val('');
            $("#step4_6").val('');
            
            $("#step4_rb11").prop("checked", false);
            $("#step4_rb12").prop("checked", false);
        }
    });

    $("input:radio[name=property_source]").on("change", function(){
        if($("input:radio[name=property_source]:checked").val() == '1') {
            $("#date2_1,#date2_2").prop('disabled', true);
        } else {
            $("#date2_1,#date2_2").prop('disabled', false);
        }
    });
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
    $('#step4_rb4_akkreditiv').on('change', function(){
        if($('#step4_rb4_akkreditiv').prop('checked')){
            $('#step4_akkreditivNUM, #step4_akkreditivDATE').prop('disabled', false);
            $('#step4_akkreditivNUM').focus();
        } else {
            $('#step4_akkreditivNUM, #step4_akkreditivDATE').prop('disabled', true);
        }
    });
    $('#step4_rb9').on('change', function(){
        if($('#step4_rb9').prop('checked')){
            $('#step4_rb6_input').prop('disabled', false);
            $('#step4_rb6_input').focus();

            $('#step4_rb10').prop('disabled', true);
            $('#step4_rb7_input').prop('disabled', true);
        } else {
            $('#step4_rb6_input').prop('disabled', true);

            $('#step4_rb10').prop('disabled', false);
            $('#step4_rb7_input').prop('disabled', false);
        }
    });
    $('#step4_rb10').on('change', function(){
        if($('#step4_rb10').prop('checked')){
            $('#step4_rb7_input').prop('disabled', false);
            $('#step4_rb7_input').focus();

            $('#step4_rb9').prop('disabled', true);
            $('#step4_rb6_input').prop('disabled', true);
        } else {
            $('#step4_rb7_input').prop('disabled', true);

            $('#step4_rb9').prop('disabled', false);
            $('#step4_rb6_input').prop('disabled', false);
        }
    });
    $('#step3_rb3').on('change', function(){
        $('#act_date').prop('disabled', false);
        $('#act_date').focus();
    });
    $('#step3_rb4').on('change', function(){
        $('#act_date').prop('disabled', true);
    });
    $('#step4_rb8').on('change', function(){
        if($('#step4_rb8').prop('checked')){
            $('#step4_rb9, #step4_rb10').prop('disabled', false);
            $('#step4_rb9, #step4_rb10').css('background', '#FAFAFA');
        } else {
            $('#step4_rb9, #step4_rb10').prop('disabled', true);
            $('#step4_rb9, #step4_rb10').css('background', '#E2E2E2');

            $("#step4_rb6_input").val('');
            $("#step4_rb7_input").val('');
            
            $("#step4_rb9").prop("checked", false);
            $("#step4_rb10").prop("checked", false);
        }
    });

    // Маска для форм ввода
    // 9 - это любая цифра (0 - 9)
    // Если использовать один класс, то работает некорректно
    $("#step4_1, #date1_1, #step4_4б, #step4_4, #date2_1, #act_date, #step4_rb1_input2, #step4_rb2_input2, #step4_akkreditivDATE, #step4_rb6_input, #step4_rb7_input").mask("99/99/9999");


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


$.ajaxSetup({ cache: false });
 $('#address_suda').keyup(function(){
  $('#result').html('');
  $('#state').val('');
  var searchField = $('#address_suda').val();
  var expression = new RegExp(searchField, "i");
  $.getJSON('/static/courts_addresses.json', function(data) {
   $.each(data, function(key, value){
    if (value.court_name.search(expression) != -1 || value.court_address.search(expression) != -1)
    {
     $('#result').append('<li class="list-group-item link-class"><img /> '+value.court_name+' | <span class="text-muted">'+value.court_address+'</span></li>');
    }
   });   
  });
 });
 
 $('#result').on('click', 'li', function() {
  var click_text = $(this).text().split('|');
  $('#address_suda').val($.trim(click_text[1]));
  $("#result").html('');
 });

});
