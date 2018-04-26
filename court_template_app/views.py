from django.shortcuts import render

from django.shortcuts import HttpResponse

# Create your views here.
#def index(request):
#    return HttpResponse("You're in the court template app!")

def index(request):
       # return HttpResponse("You're in the court template app!")
    #return render(request, '../templates/court_template_app/index.html', {})
    return render(request, 'court_template_app/index.html', {})

#def index(request):
#    return render(request, '../static/index.html', {})