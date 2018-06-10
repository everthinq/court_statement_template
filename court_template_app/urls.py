from django.conf.urls import url
from django.urls import path
from . import views

from django.contrib.staticfiles.urls import staticfiles_urlpatterns

urlpatterns = [
    path('', views.index, name='index'),
    path('process_data/', views.process_data, name='process_data'),
    path('email/', views.send_email, name='email'),
    path('download/(?P<pdf>.+)', views.download_pdf, name='download'),

    path('process_captcha/', views.process_captcha, name='process_captcha')
]

urlpatterns += staticfiles_urlpatterns()