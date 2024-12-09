from rest_framework import serializers
from .models import *
from .models import ScheduledTransaction

class ReactSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all(), required=False)
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        print("Datos validados:", validated_data)
        user = super().create(validated_data)
        universal_categories = Category.objects.filter(is_universal=True)
        user.categories.add(*universal_categories)
        return user

class TransactionSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Category.objects.all(),
        required=False
    )
    date = serializers.DateTimeField(required=False)
    class Meta:
        model = Transaction
        fields = '__all__'

    def create(self, validated_data):
        categories = validated_data.pop('categories', [])
        transaction = Transaction.objects.create(**validated_data)
        transaction.categories.set(categories)
        return transaction

    # def validate_categories(self, value):
    #     user_id = self.initial_data.get('id_user')
    #     category_ids = [category.id_category for category in value]
    #     invalid_categories = Category.objects.filter(id_category__in=category_ids).exclude(users__id=user_id)
    #     if invalid_categories.exists():
    #         raise serializers.ValidationError("Some categories do not belong to this user.")
    #     return value

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
        

class DebtsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Debt
        fields = '__all__'
        
class ScheduledTransactionSerializer(serializers.ModelSerializer):
    categories_details = CategorySerializer(many=True, read_only=True, source='categories')
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all())

    def create(self, validated_data):
        print("Original data:", self.initial_data)
        print("Validated data:", validated_data) 
        categories = validated_data.pop('categories', [])
        scheduled_transaction = ScheduledTransaction.objects.create(**validated_data)
        scheduled_transaction.categories.set(categories)  
        return scheduled_transaction

    def update(self, instance, validated_data):
        categories = validated_data.pop('categories', None)
        if categories is not None:
            instance.categories.set(categories)  
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance

    class Meta:
        model = ScheduledTransaction
        fields = '__all__'
        extra_fields = ['categories_details']  
