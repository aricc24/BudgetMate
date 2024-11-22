from rest_framework import serializers
from .models import *

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
        queryset=Category.objects.all()
    )
    class Meta:
        model = Transaction
        fields = '__all__'

    def create(self, validated_data):
        categories = validated_data.pop('categories', [])
        transaction = Transaction.objects.create(**validated_data)
        transaction.category.set(categories)
        return transaction

    def validate_categories(self, value):
        user_id = self.initial_data.get('id_user')
        invalid_categories = Category.objects.filter(id__in=[cat.id for cat in value]).exclude(users__id=user_id)
        if invalid_categories.exists():
            raise serializers.ValidationError("Some categories do not belong to this user.")
        return value

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'
