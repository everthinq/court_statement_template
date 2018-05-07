# -*- coding: utf-8 -*-

from django.shortcuts import render

from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse, Http404
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import EmailMessage

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

    if 'ddu_date' in data:
        data['ddu_date'] = datetime.strptime(data['ddu_date'], '%d/%m/%Y')

    if 'prop_transfer_date' in data:
        data['prop_transfer_date'] = datetime.strptime(data['prop_transfer_date'], '%d/%m/%Y')

    if 'transfer_act_date' in data:
        data['transfer_act_date'] = datetime.strptime(data['transfer_act_date'], '%d/%m/%Y')

    if 'precourt_postbox_date' in data:
        data['precourt_postbox_date'] = datetime.strptime(data['precourt_postbox_date'], '%d/%m/%Y')

    if 'precourt_office_date' in data:
        data['precourt_office_date'] = datetime.strptime(data['precourt_office_date'], '%d/%m/%Y')

    if 'rent_date' in data:
        data['rent_date'] = datetime.strptime(data['rent_date'], '%d/%m/%Y')

    payment_doc_type = data['payment_doc_type']
    payment_docs = []
    if 1 in payment_doc_type:
        payment_docs.append("платёжное поручение №%s от %s" % (data['plat_por_num'], data['plat_por_date']))

    if 2 in payment_doc_type:
        payment_docs.append("квитанция к приходному кассовому ордеру №%s от %s" % (data['order_num'], data['order_date']))

    if 3 in payment_doc_type:
        payment_docs.append("акт сверки взаиморассчётов с %s по %s" % ('.'.join(data['act_start']), '.'.join(data['act_end'])))

    if 4 in payment_doc_type:
        payment_docs.append(data['other_payment'])
        extras = data['payment_extras']
        for i in range(extras):
            payment_docs.append(data['payment_extra%d' % (i+1)])

    data['payment_docs'] = ', '.join(payment_docs)

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
        penalty = round(9*data['total_price']*data['overdue_days']/150)/100
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
        response["link"] = pdf_filename

    return JsonResponse(response)

@csrf_exempt
def send_email(request):
    data = simplejson.loads(request.body)

    email = data['email']
    pdf_filename = os.path.join(settings.BASE_DIR, 'static/pdf/%s' % os.path.basename(data['pdf']))

    msg = EmailMessage(
            "Исковое заявление",
            "В приложенном файле находится заполненное исковое заявление.",
            settings.PDF_EMAIL_FROM,
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
