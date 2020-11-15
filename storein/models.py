from django.db import models
from django.template.defaultfilters import slugify


class Dealer(models.Model):
    dealer_name = models.CharField(max_length=30)
    dealer_email = models.EmailField(max_length=254, null=True)
    dealer_address = models.CharField(max_length=150, null=True)
    dealer_phone = models.CharField(max_length=10)
    remaining_balance = models.FloatField(default=0)

    def __str__(self):
        return self.dealer_name

    def slug(self):
        return slugify(self.dealer_name)


class Medicine(models.Model):
    medicine_name = models.CharField(max_length=150,)
    common_name = models.CharField(max_length=150, null=True)
    foils_per_packet = models.IntegerField(null=True, default=1)
    capsules_per_foil = models.IntegerField(null=True, default=1)
    selling_rate = models.FloatField()
    present_quantity = models.IntegerField(default=0)

    def __str__(self):
        return self.medicine_name

    def slug(self):
        return slugify(self.medicine_name)

    def medicine_detail(self):
        return self.medicinedetails_set.first()    

    def cost(self):
        return round(self.medicine_detail().cost_rate, 3)

class MedicineDetails(models.Model):
    medicine = models.ForeignKey(Medicine, on_delete=models.PROTECT)
    batch_number = models.IntegerField(null=True)
    quantity = models.IntegerField()
    cost_rate = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)
    expiry_date = models.DateField(null=True)

    def invoice(self):
        return self.invoiceindetails_set.first().invoice_in



class InvoiceIn(models.Model):
    dealer = models.ForeignKey(Dealer, on_delete=models.PROTECT)
    bought_by = models.CharField(max_length=50, null=True)
    payment_method = models.CharField(max_length=20)
    total_price = models.FloatField()
    amount_paid = models.FloatField(default=0)
    invoice_date = models.DateField(null=True)
    entry_date = models.DateTimeField(auto_now_add=True, null=True)

    def dealer_name(self):
        return self.dealer.dealer_name

    def invoicein_details(self):
        return self.invoiceindetails_set.all()


class InvoiceInDetails(models.Model):
    invoice_in = models.ForeignKey(InvoiceIn, on_delete=models.PROTECT)
    medicine_details = models.ForeignKey(MedicineDetails, on_delete=models.PROTECT)
