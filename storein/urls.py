from django.urls import path

from . import views

app_name = 'storein'
urlpatterns = [
    path('medicine/', views.medicineindexpage, name='index'),
    path('medicine/setup/', views.medicinesetup, name='medicine_setup'),
    path('medicine/<str:slug>/', views.editmedicine, name='edit_medicine'),
    path('medicine/<str:slug>/details/', views.medicinedetails, name='medicine_details'),
    path('main/', views.main_page, name='main'),
    path('dealer/', views.dealerindexpage, name='dealer_index'),
    path('dealer/newdealersetup/', views.new_dealer_setup, name='newdealersetup'),
    path('dealer/<str:slug>/', views.dealersetuppage, name='dealer_setup'),
    path('dealer/<str:slug>/details/', views.dealerdetails, name='dealer_details'),
    path('submit/', views.submit, name='submit'),
    path('setup/', views.new_dealer_submit, name='submit_dealer_details'),
]
