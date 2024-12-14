from django.contrib import admin
from .models import User, Transaction, Category, Debt, ScheduledTransaction
from import_export import resources
from import_export.admin import ExportMixin
import csv
from django.http import HttpResponse
from reportlab.pdfgen import canvas
from openpyxl import Workbook

def get_list_display(model):
    return [field.name for field in model._meta.get_fields() if not field.many_to_many and not field.one_to_many]

class UserResource(resources.ModelResource):
    class Meta:
        model = User
        fields = '__all__'  

class TransactionResource(resources.ModelResource):
    class Meta:
        model = Transaction
        fields = '__all__'

class CategoryResource(resources.ModelResource):
    class Meta:
        model = Category
        fields = '__all__'

class DebtResource(resources.ModelResource):
    class Meta:
        model = Debt
        fields = '__all__'

class ScheduledTransactionResource(resources.ModelResource):
    class Meta:
        model = ScheduledTransaction
        fields = '__all__'

def export_csv(modeladmin, request, queryset):
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="export.csv"'
    writer = csv.writer(response)
    model = queryset.model
    field_names = [field.name for field in model._meta.fields]
    writer.writerow(field_names)
    for obj in queryset:
        row = [getattr(obj, field) for field in field_names]
        writer.writerow(row)
    return response
export_csv.short_description = "Exportar seleccionados a CSV"


def export_pdf(modeladmin, request, queryset):
    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="export.pdf"'

    p = canvas.Canvas(response)

    model = queryset.model
    p.setFont("Helvetica-Bold", 16)
    p.drawString(100, 800, f"Exportación de {model._meta.verbose_name_plural.capitalize()}")

    field_names = [field.name for field in model._meta.fields]
    y_position = 750
    p.setFont("Helvetica-Bold", 12)
    for i, field_name in enumerate(field_names):
        p.drawString(50 + (i * 100), y_position, field_name)

    y_position -= 20
    p.setFont("Helvetica", 10)
    for obj in queryset:
        for i, field in enumerate(field_names):
            value = getattr(obj, field)
            p.drawString(50 + (i * 100), y_position, str(value))
        y_position -= 20

        if y_position < 50:
            p.showPage()
            p.setFont("Helvetica-Bold", 12)
            y_position = 750

    p.save()
    return response
export_pdf.short_description = "Exportar seleccionados a PDF"


def export_excel(modeladmin, request, queryset):
    response = HttpResponse(content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    response['Content-Disposition'] = 'attachment; filename="export.xlsx"'
    workbook = Workbook()
    sheet = workbook.active
    sheet.title = "Exportación"
    model = queryset.model
    field_names = [field.name for field in model._meta.fields]
    sheet.append(field_names)

    for obj in queryset:
        row = [getattr(obj, field) for field in field_names]
        sheet.append(row)

    workbook.save(response)
    return response
export_excel.short_description = "Exportar seleccionados a Excel"


@admin.register(User)
class UserAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = UserResource
    list_display = get_list_display(User)
    search_fields = ('email', 'first_name', 'last_name_father', 'curp', 'rfc')
    list_filter = ('marital_status', 'email_schedule_frequency')
    ordering = ('id_user',)
    filter_horizontal = ('categories',)

    actions = [export_csv, export_pdf, export_excel, 'count_users']

    def count_users(self, request, queryset):
        count = queryset.count()
        self.message_user(request, f"Se encontraron {count} usuario(s) seleccionados.")
    count_users.short_description = "Contar usuarios seleccionados"

    def changelist_view(self, request, extra_context=None):
        extra_context = extra_context or {}
        extra_context['user_count'] = User.objects.count()
        return super().changelist_view(request, extra_context=extra_context)


@admin.register(Transaction)
class TransactionAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = TransactionResource
    list_display = get_list_display(Transaction)
    search_fields = ('description',)
    list_filter = ('type', 'date')
    ordering = ('-date',)
    actions = [export_csv, export_pdf, export_excel] 

@admin.register(Category)
class CategoryAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = CategoryResource
    list_display = get_list_display(Category)
    search_fields = ('category_name',)
    list_filter = ('is_universal',)
    search_help_text = 'Introduce un término de búsqueda para encontrar categorías.'
    actions = [export_csv, export_pdf, export_excel]  


@admin.register(Debt)
class DebtAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = DebtResource
    list_display = get_list_display(Debt)
    search_fields = ('description', 'lender')
    list_filter = ('status', 'hasInterest')
    ordering = ('-due_date',)
    actions = [export_csv, export_pdf, export_excel]  


@admin.register(ScheduledTransaction)
class ScheduledTransactionAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = ScheduledTransactionResource
    list_display = get_list_display(ScheduledTransaction)
    search_fields = ('description',)
    list_filter = ('type', 'repeat', 'schedule_date')
    ordering = ('schedule_date',)
    filter_horizontal = ('categories',)
    actions = [export_csv, export_pdf, export_excel]  