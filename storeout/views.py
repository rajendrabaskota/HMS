from django.shortcuts import render
from django.http import HttpResponse

from . models import InvoiceOut, InvoiceOutDetails
from storein.models import Medicine

import inflect
import nepali_datetime


def index(request):
    return render(request, 'storeout/index.html')


def submit(request):
    submitted_data = dict(request.POST.lists())
    
    customer_name = submitted_data['customer_name'][0]

    medicine_name_list = submitted_data['medicine_name[]']
    medicine_quantity_list = submitted_data['medicine_quantity[]']
    medicine_rate_list = submitted_data['selling_rate[]']
    total_price_list = submitted_data['total_price[]']

    total_amount = 0
    for i, price in enumerate(total_price_list):
        total_amount = total_amount + float(total_price_list[i])

    invoice_out = InvoiceOut(customer_name=customer_name, total_amount=total_amount)
    invoice_out.save()

    items = list(map(list, zip(medicine_name_list, medicine_quantity_list, medicine_rate_list, total_price_list)))
    for item in items:
        print(item)
        medicine = Medicine.objects.filter(medicine_name=item[0])[0]
        invoice_out_details = InvoiceOutDetails(invoice_out=invoice_out, medicine=medicine, quantity=int(item[1]), amount=float(item[3]))
        invoice_out_details.save()
        
        present_quantity = medicine.present_quantity
        updated_quantity = present_quantity - int(item[1])
        medicine.present_quantity = updated_quantity
        medicine.save()

    p = inflect.engine()
    amount_in_words = p.number_to_words(int(total_amount)).capitalize()
    nepali_date = nepali_datetime.date.today()
    return render(request, 'storeout/invoice.html', {'items': items, 'customer_name': customer_name.capitalize(), 'total_amount': total_amount, 'amount_in_words': amount_in_words, 'nepali_date': nepali_date,})
