from django.contrib import admin
from .models import User, Transaction, Category, Debt, ScheduledTransaction
from import_export import resources
from import_export.admin import ExportMixin

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
        
@admin.register(User)
class UserAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = UserResource
    list_display = get_list_display(User)
    search_fields = ('email', 'first_name', 'last_name_father', 'curp', 'rfc')
    list_filter = ('marital_status', 'email_schedule_frequency')
    ordering = ('id_user',)
    filter_horizontal = ('categories',)

    def count_users(self, request, queryset):
        count = queryset.count()
        self.message_user(request, f"Se encontraron {count} usuario(s) seleccionados.")
    count_users.short_description = "Contar usuarios seleccionados"

    actions = [count_users]

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

@admin.register(Category)
class CategoryAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = CategoryResource
    list_display = get_list_display(Category)
    search_fields = ('category_name',)
    list_filter = ('is_universal',)
    search_help_text = 'Introduce un término de búsqueda para encontrar categorías.'

@admin.register(Debt)
class DebtAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = DebtResource
    list_display = get_list_display(Debt)
    search_fields = ('description', 'lender')
    list_filter = ('status', 'hasInterest')
    ordering = ('-due_date',)

@admin.register(ScheduledTransaction)
class ScheduledTransactionAdmin(ExportMixin, admin.ModelAdmin):
    resource_class = ScheduledTransactionResource
    list_display = get_list_display(ScheduledTransaction)
    search_fields = ('description',)
    list_filter = ('type', 'repeat', 'schedule_date')
    ordering = ('schedule_date',)
    filter_horizontal = ('categories',)
