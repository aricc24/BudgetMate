from rest_framework import serializers
from .models import *
from datetime import datetime, date


class UserSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all(), required=False)
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        print("Valid data:", validated_data)
        user = super().create(validated_data)
        universal_categories = Category.objects.filter(is_universal=True)
        user.categories.add(*universal_categories)
        return user
    def create(self, validated_data):
        print("Valid data:", validated_data)
        user = super().create(validated_data)
        universal_categories = Category.objects.filter(is_universal=True)
        user.categories.add(*universal_categories)
        return user
    def validate_email_schedule_start_date(self, value):
        """Valida que `email_schedule_start_date` sea un datetime válido."""
        if not isinstance(value, datetime):
            raise serializers.ValidationError("Invalid datetime format. Expected a valid datetime.")
        return value


class TransactionSerializer(serializers.ModelSerializer):
    categories = serializers.PrimaryKeyRelatedField(many=True,queryset=Category.objects.all(),required=False)
    date = serializers.DateTimeField(required=False)

    class Meta:
        model = Transaction
        fields = '__all__'

    def create(self, validated_data):
        categories = validated_data.pop('categories', [])
        transaction = Transaction.objects.create(**validated_data)
        transaction.categories.set(categories)
        return transaction

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