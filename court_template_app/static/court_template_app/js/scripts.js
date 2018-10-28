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

    $("#step5_email_send_btn").click(function() {
        $(".js-overlay-campaign").attr('style', 'display: none');
        $(".feedback_form").attr('style', 'display: none');
    });

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
        if($("#step1_radio_no_download").is(":checked")) {
            $("#step2_right").attr('style',  'display: none');
            activateTab('#step2');
            return;
        } else {
            $("#step2_right").attr('style',  '');
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

                $('#step2_down_vipiska').attr('href', data['link']);

                $('#nickname').val(data['org_name'])
                $('#address2').val(data['org_address'])

                $('#step1_radio_no_download').prop('checked', true);

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

    var kl_stavka = function() { 
        var transferred = parseInt($("input:radio[name=appartment_given]:checked").val())

        if(transferred == 0) {
            var current_kl_stavka = 7.5;
            return current_kl_stavka;
        }

        if(transferred == 1) {
            input_DD = $("#act_date").val().split("/")[0]; // DD
            input_MM = $("#act_date").val().split("/")[1]; // MM
            input_YY = $("#act_date").val().split("/")[2]; // YYYY

            appended_date = input_YY + '-' + input_MM + '-' + input_DD;
            full_date = new Date(appended_date);
            
            // required dates block start
// http://www.consultant.ru/document/cons_doc_LAW_12453/886577905315979b26c9032d79cb911cc8fa7e69/
            septe17_2018 = new Date('2018-09-17');
            march26_2018 = new Date('2018-03-26');
            febru12_2018 = new Date('2018-02-12');
            decem18_2017 = new Date('2017-12-18');
            octob30_2017 = new Date('2017-10-30');
            septe18_2017 = new Date('2017-09-18');
            junee19_2017 = new Date('2017-06-19');
            mayyy02_2017 = new Date('2017-05-02');
            march27_2017 = new Date('2017-03-27');
            septe19_2016 = new Date('2016-09-19');
            junee14_2016 = new Date('2016-06-14');
            augus03_2015 = new Date('2015-08-03');
            junee16_2015 = new Date('2015-06-16');
            mayyy05_2015 = new Date('2015-05-05');
            march16_2015 = new Date('2015-03-16');
            febru02_2015 = new Date('2015-02-02');
            decem16_2014 = new Date('2014-12-16');
            decem12_2014 = new Date('2014-12-12');
            novem05_2014 = new Date('2014-11-05');
            julyy28_2014 = new Date('2014-07-28');
            april28_2014 = new Date('2014-04-28');
            march03_2014 = new Date('2014-03-03');
            septe13_2013 = new Date('2013-09-13');
            // required dates block end

            if(full_date >= septe17_2018) {
                // с 17 сентября 2018г. -- 7,5
                return 7.5;
            }

            if(full_date >= march26_2018 && full_date < septe17_2018) {
                // с 26 марта 2018 г. по 16 сентября 2018г. -- 7,25
                return 7.25;
            }

            if(full_date >= febru12_2018 && full_date < march26_2018) {
                // с 12 февраля 2018 г. по 25 марта 2018г. -- 7,5
                return 7.5;
            }

            if(full_date >= decem18_2017 && full_date < febru12_2018) {
                // с 18 декабря 2017 г. по 11 февраля 2018 г.-- 7,75
                return 7.75;
            }

            if(full_date >= octob30_2017 && full_date < decem18_2017) {
                // с 30 октября 2017 г. по 17 декабря 2017 г. -- 8,25
                return 8.25;
            }

            if(full_date >= septe18_2017 && full_date < octob30_2017) {
                // с 18 сентября 2017 г. по 29 октября 2017 г. -- 8,5
                return 8.5;
            }

            if(full_date >= junee19_2017 && full_date < septe18_2017) {
                // с 19 июня 2017 г. по 17 сентября 2017 г. -- 9
                return 9;
            }

            if(full_date >= mayyy02_2017 && full_date < junee19_2017) {
                // со 2 мая 2017 г. по 18 июня 2017 г. -- 9,25
                return 9.25;
            }

            if(full_date >= march27_2017 && full_date < mayyy02_2017) {
                // с 27 марта 2017 г. по 1 мая 2017 г. -- 9,75
                return 9.75;
            }

            if(full_date >= septe19_2016 && full_date < march27_2017) {
                // с 19 сентября 2016 г. по 26 марта 2017 г. -- 10,0
                return 10;
            }

            if(full_date >= junee14_2016 && full_date < septe19_2016) {
                // с 14 июня 2016 г. по 18 сентября 2016 г. -- 10,5
                return 10.5;
            }

            if(full_date >= augus03_2015 && full_date < junee14_2016) {                
                // с 3 августа 2015 г. по 13 июня 2016 г. -- 11
                return 11;
            }

            if(full_date >= junee16_2015 && full_date < augus03_2015) {                
                // с 16 июня 2015 г. по 2 августа 2015 г. -- 11,5
                return 11.5;
            }

            if(full_date >= mayyy05_2015 && full_date < junee16_2015) {                
                // с 5 мая 2015 г. по 15 июня 2015 г. -- 12,5
                return 12.5;
            }

            if(full_date >= march16_2015 && full_date < mayyy05_2015) {
                // с 16 марта 2015 г. по 4 мая 2015 г. -- 14
                return 14;
            }

            if(full_date >= febru02_2015 && full_date < march16_2015) {
                // cо 2 февраля 2015 г. по 15 марта 2015 г. -- 15
                return 15;
            }

            if(full_date >= decem16_2014 && full_date < febru02_2015) {
                // c 16 декабря 2014 г. по 1 февраля 2015 г -- 17
                return 17;
            }

            if(full_date >= decem12_2014 && full_date < decem16_2014) {                
                // c 12 декабря 2014 г. по 15 декабря 2014 г. -- 10,5
                return 10.5;
            }

            if(full_date >= novem05_2014 && full_date < decem12_2014) {
                // с 5 ноября 2014 г. по 11 декабря 2014 г.  -- 9,5
                return 9.5;
            }

            if(full_date >= julyy28_2014 && full_date < novem05_2014) {                
                // с 28 июля 2014 г. по 4 ноября 2014 г. -- 8
                return 8;
            }

            if(full_date >= april28_2014 && full_date < julyy28_2014) {
                // с 28 апреля 2014 г. по 27 июля 2014 г. -- 7,5
                return 7.5;
            }

            if(full_date >= march03_2014 && full_date < april28_2014) {                
                // с 3 марта 2014 г. по 27 апреля 2014 г. -- 7
                return 7;
            }

            if(full_date >= septe13_2013 && full_date < march03_2014) {                
                // с 13 сентября 2013 г. по 2 марта 2014 г. -- 5,5
                return 5.5;
            }

            if(full_date < septe13_2013) {                
                // до 13 сентября 2013 решили сделать ставку 5.5
                return 5.5;
            }
        }
    };


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

        data['kl_stavka'] = kl_stavka();
        data['rent_total'] = parseFloat($("#step4_6").val().trim().replace(',', '.').replace(/\s+/g, '') || '0');

        data['ddu_date'] = $("#date1_1").val();
        data['ddu_num'] = $("#date1_2").val().trim().replace(',', '.').replace(/\s+/g, '');
        if(data['property_source'] == 2) {
            // Переуступка
            data['prop_transfer_date'] = $("#date2_1").val();
            data['prop_transfer_num'] = $("#date2_2").val().trim().replace(',', '.').replace(/\s+/g, '');
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
            data['rent_total'] = $("#step4_6").val().trim().replace(',', '.').replace(/\s+/g, '');
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
            planned_date.setDate(planned_date.getDate() + 1)
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

        var penalty = Math.round(kl_stavka()*total_price*penalty_days/150)/100;
        total_ask = penalty;
        if(ask_type.indexOf(2)>=0)
            total_ask += rent_total;
        $("#total_ask").text(''+total_ask.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$& ') + ' руб.');
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
            if($("#step1_radio_no_download").is(":checked")) {
                $("#step2_right").attr('style',  'display: none');
                activateTab(tab);
                return;
            } else {
                $("#step2_right").attr('style',  '');
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

                    $('#step2_down_vipiska').attr('href', data['link']);

                    $('#nickname').val(data['org_name'])
                    $('#address2').val(data['org_address'])

                    $('#step1_radio_no_download').prop('checked', true);

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
            } else {
                $("#date1_1").removeClass('empty_field');
            }
            if($("input:radio[name=property_source]:checked").val() == '2') {
                if($("#date1_1").val() == '') {
                    $("#date1_1").addClass('empty_field');
                } else {
                    $("#date1_1").removeClass('empty_field');
                }
                if($("#date2_1").val() == '') {
                    $("#date2_1").addClass('empty_field');
                } else {
                    $("#date2_1").removeClass('empty_field');
                }
            } else {
                $("#date2_1").removeClass('empty_field');
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
            }
            if($("input:radio[name=property_source]:checked").val() == '2') {
                if($("#date1_1").val() == '') {
                    $('#date1_1').focus();
                    $("#date1_1")[0].scrollIntoView();
                    return;
                }
                if($("#date2_1").val() == '') {
                    $('#date2_1').focus();
                    $("#date2_1")[0].scrollIntoView();
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
            
            $('#step4_rb6_input').prop('disabled', true);
            $('#step4_rb7_input').prop('disabled', true);

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
 // $('#address_suda').keyup(function(){
 //  $('#result').html('');
 //  $('#state').val('');
 //  var searchField = $('#address_suda').val();
 //  var expression = new RegExp(searchField, "i");
 //  $.getJSON('/static/courts_addresses.json', function(data) {
 //   $.each(data, function(key, value){
 //    if (value.court_name.search(expression) != -1 || value.court_address.search(expression) != -1)
 //    {
 //     $('#result').append('<li class="list-group-item link-class"><img /> '+value.court_name+' | <span class="text-muted">'+value.court_address+'</span></li>');
 //    }
 //   });   
 //  });
 // });
 
 $('#step2_find_btn').click(function() {
  $('#result').html('');
  $('#state').val('');
  var searchField = $('#sud').val();
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
