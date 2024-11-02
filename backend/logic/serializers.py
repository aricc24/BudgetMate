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

        def create(self, clean_data):
            user = User(
                email = validated_data['email'],
                password = validated_data['password'],
            )
            user.set_password(validated_data['password'])
            user.save()
            return user

        def validate_email(self, value):
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError("This e-mail is already registered.")
            return value

class UserLoginSerializer(serializers.Serializer):
	email = serializers.EmailField()
	password = serializers.CharField()

	def check_user(self, clean_data):
		user = authenticate(username=clean_data['email'], password=clean_data['password'])
		if not user:
			raise ValidationError('User not found')
		return user
