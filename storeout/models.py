from django.db import models

from storein.models import Medicine


class InvoiceOut(models.Model):
    customer_name = models.CharField(max_length=150)
    total_amount = models.FloatField()
    user = models.CharField(max_length=150, null=True)
    date = models.DateTimeField(auto_now_add=True, null=True)
    

class InvoiceOutDetails(models.Model):
    invoice_out = models.ForeignKey(InvoiceOut, on_delete=models.PROTECT)
    medicine = models.ForeignKey(Medicine, on_delete=models.PROTECT)
    quantity = models.IntegerField(null=True)
    amount = models.FloatField(null=True)

    def rate(self):
        return round(self.amount / self.medicine.selling_rate, 3)
