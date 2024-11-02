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

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):  # Asegúrate de que esta línea esté correctamente alineada
        email = attrs.get('email')
        password = attrs.get('password')

        #user = authenticate(request=self.context.get('request'), username=email, password=password)
        #if user is None:
        try:
            user = User.objects.get(email = email, password = password)
        except User.DoesNotExist:
            raise serializers.ValidationError('Invalid credentials')
        except User.MultipleObjectsReturned:
            raise serializers.ValidationError("Multiple users found with this email")
        if user is None:
            raise serializers.ValidationError('Invalid credentials')
        attrs['user'] = user
        return attrs
