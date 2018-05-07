from django import template

from ru_number_to_text.num2t4ru import num2text


RUBLES = ('рубль', 'рубля', 'рублей')
KOPECKS = ('копейка', 'копейки', 'копеек')

register = template.Library()

@register.filter
def format_date(arg):
    return arg.strftime("«D» E Yг.")

@register.filter
def price_in_words(price):
    price = float(price)
    price = round(price*100)
    rubs = int(price/100)
    kops = price % 100

    buf = num2text(rubs, (RUBLES, 'm'))
    kop_idx = 2
    if kops<10 or kops > 20:
        if kops == 1:
            kop_idx = 0
        elif kops % 10 in [2,3,4]:
            kop_idx = 1
    buf += ' '+str("%02d" % kops)+' '+KOPECKS[kop_idx]

    return buf

@register.filter
def state_fee(price):
    price = float(price)
    if price < 1000000:
        return 0
    else:
        return str(min(round((price-1000000)/2)/100, 60000))

@register.filter
def app_type(type_num):
    app_types = (
        "квартиру-студию",
        "1к. кв.",
        "2к. кв.",
        "3к. кв.",
        "4к. кв.",
    )

    return app_types[type_num-1]
