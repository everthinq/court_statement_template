from django.http import HttpResponse

def hello_world(request):
    return HttpResponse("Hello, World!")

def root_page(request):
    return HttpResponse("Root Page, World!")

import random
def random_number_game(request, max_rand = 100):
    return HttpResponse(random.randrange(0, max_rand))