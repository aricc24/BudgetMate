from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import *

class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):  # Correcto: debe estar fuera de Meta
        user = User(
            email = validated_data['email'],
            password = validated_data['password'],
        )
        user.save()
        return user

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("This e-mail is already registered.")
        return value
