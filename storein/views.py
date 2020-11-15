from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect, HttpResponse

from . models import Dealer, Medicine, InvoiceIn, InvoiceInDetails, MedicineDetails
from storeout.models import InvoiceOut, InvoiceOutDetails
from rest_framework import routers, serializers, viewsets,filters,decorators,response

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = "__all__"

class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all()
    serializer_class  = MedicineSerializer
    permission_classes = ()
    filter_backends = [filters.SearchFilter]
    search_fields = ('medicine_name',)

    @decorators.action(methods=['GET'], detail=False)
    def get_invoices(self, request):
        queryset = self.get_queryset().order_by('-id')
        headers = []
        medicineDetails = []
        invoiceoutDetails = []
        transaction = ''
        if request.GET.get('medicines'):
            queryset = queryset.filter(medicine_name=request.GET.get('medicines'))
        if request.GET.get('type'):
            transaction = request.GET.get('type')
            if transaction == 'storein':
                headers = ['Invoice Id', 'Invoice Date', 'Quantity', 'Batch Number', 'Medicine Expiry Date']
            if transaction == 'storeout':
                headers = ['Sold On', 'Invoice Id', 'Customer Name', 'Quantity', 'Rate', 'Total']
            if queryset.exists():
                medicine = queryset[0]
                medicineDetails = medicine.medicinedetails_set.order_by('-id')
                invoiceoutDetails = medicine.invoiceoutdetails_set.order_by('-id')
        
        return render(request, 'storein/invoicetable.html', {'medicineDetails': medicineDetails, 'app': 'medicine', 'headers': headers, 'invoiceoutDetails': invoiceoutDetails, 'transaction': transaction,})


# Serializers define the API representation.
class DealerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dealer
        fields = '__all__'


# ViewSets define the view behavior.
class DealerViewSet(viewsets.ModelViewSet):
    queryset = Dealer.objects.all()
    serializer_class = DealerSerializer
    permission_classes = ()
    filter_backends = [filters.SearchFilter]
    search_fields = ('dealer_name',)

    @decorators.action(methods=['GET'], detail=False)
    def get_invoices(self, request):
        # self.get_queryset()
        queryset = self.get_queryset().order_by('-id')
        headers = []
        invoices = []
        payment_method=''
        if request.GET.get('dealer'):
            queryset = queryset.filter(dealer_name__startswith=request.GET.get('dealer'))
        if request.GET.get('type'):
            payment_method = request.GET.get('type') 
            if payment_method=='all':
                headers = ['Invoice Id', 'Total Amount', 'Amount Paid', 'Payment', 'Invoice Date', 'Medicines/Quantity']
            elif payment_method=='cash':
                headers = ['Invoice Id', 'Total Amount', 'Invoice Date', 'Medicines/Quantity']
            elif payment_method=='credit':
                headers = ['Invoice Id', 'Total Amount', 'Amount Paid', 'Invoice Date', 'Medicines/Quantity']
            if queryset.exists():
                dealer = queryset.first()
                invoices = dealer.invoicein_set.order_by('-id')
                if payment_method != 'all':
                    invoices = dealer.invoicein_set.order_by('-id').filter(payment_method=payment_method)
                # else:
                #     invoices = dealer.invoicein_set.order_by('-id')
        print(invoices)
        return render(request,'storein/invoicetable.html',{'invoices':invoices, 'app': 'dealer', 'headers':headers,'payment_method':payment_method})


class InvoiceInSerializer(serializers.ModelSerializer):
    dealer_name = serializers.CharField(required=False)
    class Meta:
        model = InvoiceIn
        fields = '__all__'

class InvoiceInViewSet(viewsets.ModelViewSet):
    queryset = InvoiceIn.objects.all()
    serializer_class = InvoiceInSerializer
    permission_classes = ()
    filter_backends = [filters.SearchFilter]
    search_fields = ('dealer__dealer_name')

def medicineindexpage(request):
    # items = []
    # for medicine in Medicine.objects.all():
    #     item = []
    #     if medicine.medicine_name:
    #         item.append(medicine.medicine_name)
    #     else:
    #         item.append('None')

    #     if medicine.common_name:
    #         item.append(medicine.common_name)
    #     else:
    #         item.append('None')

    #     if medicine.medicine_name:
    #         item.append(medicine.medicine_name)
    #     else:
    #         item.append('None')

    #     if medicine.medicine_name:
    #         item.append(medicine.medicine_name)
    #     else:
    #         item.append('None')

    #     if medicine.medicine_name:
    #         item.append(medicine.medicine_name)
    #     else:
    #         item.append('None')

    #     if medicine.medicine_name:
    #         item.append(medicine.medicine_name)
    #     else:
    #         item.append('None')

    # items = [[medicine.medicine_name if medicine.medicine_name else '', medicine.common_name, medicine.selling_rate, medicine.present_quantity, round(medicine.medicinedetails_set.order_by('-id')[0].cost_rate, 3), medicine.medicinedetails_set.order_by('-id')[0].batch_number] for medicine in Medicine.objects.order_by('-id')[:3]]
    item = Medicine.objects.first()
    print(item.medicine_detail)
    items = Medicine.objects.all()
    return render(request, 'storein/medicineindexpage.html', {'items': items,})

def dealerindexpage(request):
    # for dealer in Dealer.objects.all():
    items = Dealer.objects.all()
    return render(request, 'storein/dealerindexpage.html', {'items': items,})

def medicinesetup(request):
    if request.method == 'GET':
        return render(request, 'storein/medicinesetup.html')
    elif request.method == 'POST':
        submitted_data = dict(request.POST.lists())
        medicine_name_list = submitted_data['medicine_name[]']
        common_name_list = submitted_data['common_name[]']
        foils_per_packet_list = submitted_data['foils_per_packet[]']
        capsules_per_foil_list = submitted_data['capsules_per_foil[]']
        selling_rate_list = submitted_data['selling_rate[]']

        items = list(map(list, zip(medicine_name_list, common_name_list, foils_per_packet_list, capsules_per_foil_list, selling_rate_list)))
        for item in items:
            medicine = Medicine.objects.filter(medicine_name=item[0])
            if medicine:
                medicine = medicine[0]
                medicine.medicine_name = item[0]
                medicine.common_name = item[1]
                medicine.foils_per_packet = int(item[2])
                medicine.capsules_per_foil = int(item[3])
                medicine.selling_rate = float(item[4])
                medicine.save()
            else:
                medicine = Medicine(medicine_name=item[0], common_name=item[1], foils_per_packet=int(item[2]), capsules_per_foil=int(item[3]), selling_rate=float(item[4]))
                medicine.save()

    return redirect('/storein/medicine/')

def editmedicine(request, slug):
    medicine_name = slug.replace('-', ' ', slug.count('-'))
    medicine = Medicine.objects.filter(medicine_name=medicine_name)[0]
    if request.method == 'GET':
        return render(request, 'storein/editmedicine.html', {'medicine': medicine})
    elif request.method == 'POST':
        medicine.medicine_name = request.POST['medicine_name']
        medicine.common_name = request.POST['common_name']
        medicine.selling_rate = float(request.POST['selling_rate'])
        medicine.foils_per_packet = int(request.POST['foils_per_packet'])      
        medicine.capsules_per_foil = int(request.POST['capsules_per_foil'])      
        medicine.save()
        return redirect('/storein/medicine/')

def main_page(request):
    return render(request, 'storein/index.html')

def dealersetuppage(request, slug):
    dealer_name = slug.replace('-', ' ', slug.count('-'))
    dealer = Dealer.objects.filter(dealer_name=dealer_name)[0]
    if request.method == 'GET':
        return render(request, 'storein/dealersetup.html', {'dealer': dealer})
    elif request.method == 'POST':
        dealer.dealer_name = request.POST['dealer_name']
        dealer.dealer_phone = request.POST['dealer_phone']
        dealer.dealer_email = request.POST['dealer_email']
        dealer.dealer_address = request.POST['dealer_address']        
        dealer.save()
        return redirect('/storein/dealer/')

def dealerdetails(request, slug):
    dealer_name = slug.replace('-', ' ', slug.count('-'))
    dealer = Dealer.objects.filter(dealer_name=dealer_name)[0]
    return render(request, 'storein/dealerdetailspage.html', {'dealer': dealer})

def medicinedetails(request, slug):
    medicine_name = slug.replace('-', ' ', slug.count('-'))
    medicine = Medicine.objects.filter(medicine_name=medicine_name)[0]
    return render(request, 'storein/medicinedetailspage.html', {'medicine': medicine})


'''
def add_medicine_details(medicine, batch_number, quantity, cost_rate, expiry_date):
    medicine_detail = medicine.medicine_details_set.create(batch_number=batch_number, quantity=quantity, cost_rate=cost_rate, expiry_date=expiry_date)
    return medicine_detail


def invoice_in(dealer, bought_by, payment_method, total_price):
    new_invoice = dealer.invoice_in_set.create(bought_by=bought_by, payment_method=payment_method, total_price=total_price)
    invoice_in_details(new_invoice)


def invoice_in_details(new_invoice):
    new_invoice.invoice_in_details_set.create(medicine_details=medicine_details)


def add_medicine(dealer, medicine_name, batch_number, unit_price, quantity):
    medicine = dealer.medicine.filter(medicine_name=medicine_name)

    if medicine:
        medicine = medicine[0]
        add_medicine_quantity(medicine, quantity, batch_number, unit_price)
'''

def new_dealer_setup(request):
    return render(request, 'storein/newdealersetup.html')


def new_dealer_submit(request):
    submitted_data = dict(request.POST.lists())
    dealer_name_list = submitted_data['dealer_name[]']
    dealer_address_list = submitted_data['dealer_address[]']
    dealer_phone_list = submitted_data['dealer_phone[]']
    dealer_email_list = submitted_data['dealer_email[]']
    dealer_remaining_balance_list = submitted_data['dealer_remaining_balance[]']

    items = list(map(list, zip(dealer_name_list, dealer_address_list, dealer_phone_list, dealer_email_list, dealer_remaining_balance_list)))

    for item in items:
        dealer = Dealer(dealer_name=item[0], dealer_address=item[1], dealer_phone=item[2], dealer_email=item[3], remaining_balance=float(item[4]))
        dealer.save()

    return HttpResponseRedirect('/storein/dealer/')


def submit(request):
    submitted_data = dict(request.POST.lists())
    dealer_name = submitted_data['dealer_name'][0]
    dealer_address = submitted_data['dealer_address'][0]
    dealer_phone = submitted_data['dealer_phone'][0]
    payment_method = submitted_data['payment_method'][0]
    amount_paid = float(submitted_data['amount_paid'][0])
    invoice_date = submitted_data['invoice_date'][0]

    medicine_name_list = submitted_data['medicine_name[]']
    common_name_list = submitted_data['common_name[]']
    batch_number_list = submitted_data['batch_number[]']
    packets_list = submitted_data['packets[]']
    foils_per_packet_list = submitted_data['foils_per_packet[]']
    capsules_per_foil_list = submitted_data['capsules_per_foil[]']
    selling_rate_list = submitted_data['selling_rate[]']
    expiry_date_list = submitted_data['expiry_date[]']
    total_price_list = submitted_data['total_price[]']

    total_price = 0
    for i, price in enumerate(total_price_list):
        total_price = total_price + float(total_price_list[i])

    dealer = Dealer.objects.filter(dealer_name=dealer_name)[0]

    invoice_in = InvoiceIn(
        dealer=dealer,
        payment_method=payment_method,
        total_price=total_price,
        amount_paid=amount_paid,
        invoice_date=invoice_date,
    )
    invoice_in.save()

    items = list(map(list, zip(medicine_name_list, common_name_list, batch_number_list, packets_list, foils_per_packet_list, capsules_per_foil_list, selling_rate_list, expiry_date_list, total_price_list)))
    for item in items:
        medicine = Medicine.objects.filter(medicine_name=item[0])
        if medicine:
            medicine = medicine[0]
        else:
            medicine = Medicine(medicine_name=item[0], common_name=item[1], foils_per_packet=int(item[4]), capsules_per_foil=int(item[5]), selling_rate=float(item[6]))
            medicine.save()

        quantity = medicine.foils_per_packet * medicine.capsules_per_foil * int(item[3])

        present_quantity = medicine.present_quantity
        print(present_quantity)
        updated_quantity = present_quantity + quantity
        print(updated_quantity)
        medicine.present_quantity = updated_quantity
        medicine.save()

        medicine_details = MedicineDetails(medicine=medicine, batch_number=item[2], quantity=quantity,  expiry_date=item[7], cost_rate=float(item[8]) / quantity)
        medicine_details.save()

        invoice_in_details = InvoiceInDetails(invoice_in=invoice_in, medicine_details=medicine_details)
        invoice_in_details.save()

    
    present_balance = dealer.remaining_balance
    updated_balance = present_balance + total_price - amount_paid
    dealer.remaining_balance = updated_balance
    dealer.save()

    return HttpResponse('done!!!!')

    
    '''
    medicine = Medicine.objects.filter(medicine_name=medicine_name)

    if medicine:
        medicine = medicine[0]

        medicine_details = add_medicine_details(medicine, batch_number, quantity, cost_rate, expiry_date)
    else:
        medicine = Medicine(medicine_name=medicine_name, common_name=common_name, selling_rate=selling_rate)
        medicine.save()

        medicine_details = add_medicine_details(medicine, batch_number, quantity, cost_rate, expiry_date)

    dealer = Dealer.objects.filter(dealer_name=dealer_name)

    if dealer:
        dealer = dealer[0]
        invoice_in(dealer, bought_by, payment_method, total_price)
    else:
        dealer = Dealer(dealer_name=dealer_name, dealer_email=dealer_email, dealer_phone=dealer_phone)
        dealer.save()
        invoice_in(dealer, bought_by, payment_method, total_price)

    return HttpResponseRedirect(reverse('storein:index'))
    '''
    
