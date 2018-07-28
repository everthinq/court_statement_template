# -*- coding: utf-8 -*-

from django.shortcuts import render

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse, Http404
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import EmailMessage

from django.core.mail import send_mail

import os
import random
from datetime import datetime

import simplejson
from xhtml2pdf import pisa


# Create your views here.
#def index(request):
#    return HttpResponse("You're in the court template app!")

def index(request):
       # return HttpResponse("You're in the court template app!")
    #return render(request, '../templates/court_template_app/index.html', {})
    return render(request, 'court_template_app/index.html', {})

#def index(request):
#    return render(request, '../static/index.html', {})

def link_callback(uri, rel):
    path = os.path.join(settings.BASE_DIR, uri)

    if not os.path.isfile(path):
        raise Exception('Could not find file '+path)

    return path

def parse_date(data, key, fmt='%d/%m/%Y'):
    if key in data:
        data[key] = datetime.strptime(data[key], fmt)

def format_date(date, fmt='%d.%m.%Y'):
    return datetime.strftime(date, fmt)

@csrf_exempt
def process_captcha(request):
    pdf_filename = 'static/pdf/%s.pdf' % random.random()
    data = simplejson.loads(request.body, encoding='utf-8')

    from selenium import webdriver
    from selenium.webdriver.common.keys import Keys

    from selenium.webdriver.chrome.options import Options
    import os

    ### - set options and open headless chrome start
    chrome_options = Options()
    chrome_options.add_argument("--headless")

    chrome_options.add_argument("--no-sandbox")

    chrome_options.add_argument("--disable-dev-shm-usage")

    chrome_driver = os.getcwd() + "/chromedriver" # uncomment for LINUX chmod 777 chromedriver

    #chrome_driver = os.getcwd() + "\\chromedriver.exe" # uncomment for WINDOWS 

    driver = webdriver.Chrome(chrome_options=chrome_options, executable_path=chrome_driver)
    driver.get("https://egrul.nalog.ru/")
    ### - set options and open headless chrome end


    ### - get CAPTCHA URL start
    captcha_elem = driver.find_element_by_xpath('//*[@id="criteriaPanel"]/div/form/div[4]/div/div/img')
    captcha_url = captcha_elem.get_attribute('src')
    captcha_url = captcha_url[:-1] + '3'
    ### - get CAPTCHA URL end


    ### - download image start
    import urllib
    captcha_filename = 'static/pdf/%s.jpg' % random.random()
    urllib.request.urlretrieve(captcha_url, captcha_filename)
    ### - download image end


    ### - from image to digits start
    from python_anticaptcha import AnticaptchaClient, ImageToTextTask
    api_key = '4daab0ba499b49cd10cb0c91cefdccd1'
    captcha_fp = open(captcha_filename, 'rb')
    client = AnticaptchaClient(api_key)
    task = ImageToTextTask(captcha_fp)
    job = client.createTask(task)
    job.join()

    #CAPTCHA_str = job.get_captcha_text()
    ### - from image to digits start


    ### - post start
    inn = data['inn']
    CAPTCHA_str = job.get_captcha_text()

    inn_input = driver.find_element_by_id('ogrninnul')
    for each in inn:
        inn_input.send_keys(each)

    captcha_input = driver.find_element_by_id('captcha')
    for each in CAPTCHA_str:
        captcha_input.send_keys(each)

    driver.find_element_by_xpath('//*[@id="criteriaPanel"]/div/form/div[5]/button[2]').click()

    import time
    time.sleep(5)

    a = driver.find_element_by_xpath('//*[@id="resultContent"]/table/tbody/tr/td[1]/a')

    urllib.request.urlretrieve(a.get_attribute('href'), pdf_filename)

    org_name = driver.find_element_by_xpath('//*[@id="resultContent"]/table/tbody/tr/td[1]/a').text
    org_address = driver.find_element_by_xpath('//*[@id="resultContent"]/table/tbody/tr/td[2]').text
    ### - post end


    ### - selenium close && quit start
    driver.close()
    driver.quit()
    ### - selenium close && quit end

    response = {'status': 'ok'}
    response['org_name'] = org_name
    response['org_address'] = org_address
    response['link'] = '/' + pdf_filename

    return JsonResponse(response)

@csrf_exempt
def process_data(request):
    pdf_filename = 'static/pdf/%s.pdf' % random.random()
    template = 'court_template_app/pdf_template.html'

    data = simplejson.loads(request.body, encoding='utf-8')

    data['today'] = datetime.now()
    data['transferred'] = bool(int(data['transferred']))
    data['total_price'] = float(data['total_price'])
    data['total_ask'] = float(data['total_ask'])
    data['property_source'] = int(data['property_source'])
    data['appartment_type'] = int(data['appartment_type'])

    data['planned_transfer_date'] = datetime.strptime(data['planned_transfer_date'], '%d/%m/%Y')

    parse_date(data, 'ddu_date')
    parse_date(data, 'prop_transfer_date')
    parse_date(data, 'transfer_act_date')
    parse_date(data, 'precourt_postbox_date')
    parse_date(data, 'precourt_office_date')
    parse_date(data, 'rent_date')
    parse_date(data, 'plat_por_date')
    parse_date(data, 'order_date')
    parse_date(data, 'step4_akkreditivDATE')


    if 'act_start' in data:
        data['act_start'] = datetime.strptime('/'.join(data['act_start']), '%d/%m/%Y')

    if 'act_end' in data:
        data['act_end'] = datetime.strptime('/'.join(data['act_end']), '%d/%m/%Y')

    payment_doc_type = data['payment_doc_type']
    payment_docs = []
    if 1 in payment_doc_type:
        payment_docs.append("платёжным поручением №%s от %s" % (data['plat_por_num'], format_date(data['plat_por_date'])))

    if 2 in payment_doc_type:
        payment_docs.append("квитанцией к приходному кассовому ордеру №%s от %s" % (data['order_num'], format_date(data['order_date'])))

    if 3 in payment_doc_type:
        payment_docs.append("актом сверки взаиморассчётов с %s по %s" % (format_date(data['act_start']), format_date(data['act_end'])))

    if 4 in payment_doc_type:
        payment_docs.append("аккредитивом №%s от %s" % (data['step4_akkreditivNUM'], format_date(data['step4_akkreditivDATE'])))

    data['payment_docs_ablative'] = ', '.join(payment_docs)

    precourt_letter = data.get('precourt_letter', None)
    if precourt_letter:
        if precourt_letter == 2:
            data['precourt_date'] = data['precourt_office_date']
        else:
            data['precourt_date'] = data['precourt_postbox_date']

    data['overdue_start_date'] = data['planned_transfer_date']
    if data['transferred']:
        data['overdue_end_date'] = data['transfer_act_date']
    else:
        data['overdue_end_date'] = data['today']

    ask_type = data['ask_type']
    data['ask_penalty'] = True
    if 2 in ask_type:
        data['ask_rental'] = True
    if 3 in ask_type:
        data['ask_moral'] = True
    if 4 in ask_type:
        data['ask_fine'] = True

    data['overdue_days'] = (data['overdue_end_date']-data['overdue_start_date']).days

    if data['overdue_days'] > 0:
        penalty = round(data['kl_stavka']*data['total_price']*data['overdue_days']/150)/100
        data['penalty'] = penalty

    fio_parts = data['fio'].split(' ')
    data['fio_short'] = ' '.join([
        fio_parts[0],
        fio_parts[1][0]+'.',
        fio_parts[2][0]+'.'
    ])

    html = render_to_string(template, data)

    with open(pdf_filename, "w+b") as pdf:
        status = pisa.CreatePDF(
            html.encode('utf-8'),
            dest=pdf,
            encoding='utf-8',
            link_callback=link_callback
        )
        #pdf.write(html.encode('utf-8'))

    response ={"status": "ok"}
    if status.err:
    #if False:
        response["status"] = "error"
        response["message"] = "Ошибка при генерации PDF."
    else:
        response["link"] = '/' + pdf_filename

    return JsonResponse(response)

@csrf_exempt
def send_email(request):
    data = simplejson.loads(request.body)
    email = data['email']
    pdf_filepath = data['pdf_preview_src']

    pdf_filename = os.path.join(settings.BASE_DIR, 'static/pdf/%s' % os.path.basename(pdf_filepath))

    msg = EmailMessage(
            "Исковое заявление",
            "В приложенном файле находится заполненное исковое заявление.",
            settings.EMAIL_HOST_USER,
            [email]
        )

    msg.attach_file(pdf_filename)

    try:
        msg.send()
    except:
        return JsonResponse({
            "status": "error",
            "message": "Не удалось отправить email."
        })

    return JsonResponse({
        "status": "success",
        "message": "Сообщение успешно отправлено."
    })

def download_pdf(request, pdf):
    pdf_base = os.path.basename(pdf)
    pdf_filename = os.path.join(settings.BASE_DIR, 'static/pdf/%s' % pdf_base)
    if os.path.exists(pdf_filename):
        with open(pdf_filename, 'rb') as f:
            response = HttpResponse(f, content_type='application/pdf')
            response['Content-Disposition'] = 'attachment; filename=%s' % pdf_base
            return response
    else:
        raise Http404()