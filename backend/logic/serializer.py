from rest_framework import serializers
from .models import *
from datetime import datetime, date


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for the User model.

    This serializer is used to handle the creation and updating of user instances,
    including the automatic addition of universal categories to the user upon creation.

    Attributes:
        categories: A primary key related field to handle multiple categories linked to the user.

    Methods:
        create(validated_data): Creates a new user and adds universal categories to the user.
        validate_email_schedule_start_date(value): Validates the `email_schedule_start_date` to ensure it is a valid datetime.
    """
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all(), required=False)
    class Meta:
        model = User
        fields = '__all__'
    def create(self, validated_data):
        """
        Overridden method to handle the creation of a user along with the addition of universal categories.

        Args:
            validated_data: Data that has passed validation and is ready for saving.

        Returns:
            user: The created user instance with added universal categories.
        """
        print("Valid data:", validated_data)
        user = super().create(validated_data)
        universal_categories = Category.objects.filter(is_universal=True)
        user.categories.add(*universal_categories)
        return user
    def create(self, validated_data):
        """
        Custom validation for the `email_schedule_start_date` field to ensure it is a valid datetime.

        Args:
            value: The value to be validated.

        Returns:
            value: The valid datetime value.

        Raises:
            serializers.ValidationError: If the value is not a valid datetime.
        """
        print("Valid data:", validated_data)
        user = super().create(validated_data)
        universal_categories = Category.objects.filter(is_universal=True)
        user.categories.add(*universal_categories)
        return user
    def validate_email_schedule_start_date(self, value):
        """Validates `email_schedule_start_date` is a valid e-mail."""
        if not isinstance(value, datetime):
            raise serializers.ValidationError("Invalid datetime format. Expected a valid datetime.")
        return value


class TransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for the Transaction model.

    This serializer handles the creation of transactions, allowing users to associate categories
    with transactions. It also includes optional fields like `date` for the transaction timestamp.

    Attributes:
        categories: A primary key related field to handle multiple categories linked to the transaction.
        date: A datetime field to handle the transaction's timestamp.

    Methods:
        create(validated_data): Creates a new transaction and associates categories.
    """
    categories = serializers.PrimaryKeyRelatedField(many=True,queryset=Category.objects.all(),required=False)
    date = serializers.DateTimeField(required=False)

    class Meta:
        model = Transaction
        fields = '__all__'

    def create(self, validated_data):
        """
        Overridden method to create a transaction and associate categories.

        Args:
            validated_data: Data that has passed validation and is ready for saving.

        Returns:
            transaction: The created transaction instance with associated categories.
        """
        categories = validated_data.pop('categories', [])
        transaction = Transaction.objects.create(**validated_data)
        transaction.categories.set(categories)
        return transaction

class CategorySerializer(serializers.ModelSerializer):
    """
    Serializer for the Category model.

    This serializer handles the representation of categories, including creating, updating, and listing
    categories.

    Methods:
        None (default CRUD operations).
    """
    class Meta:
        model = Category
        fields = '__all__'

class DebtsSerializer(serializers.ModelSerializer):
    """
    Serializer for the Debt model.

    This serializer handles the representation of debts, including creating, updating, and listing
    debt records.

    Methods:
        None (default CRUD operations).
    """
    class Meta:
        model = Debt
        fields = '__all__'

class ScheduledTransactionSerializer(serializers.ModelSerializer):
    """
    Serializer for the ScheduledTransaction model.

    This serializer is responsible for handling the creation and updating of scheduled transactions.
    It includes details about the associated categories, and allows for periodicity settings
    (e.g., daily, weekly, etc.).

    Attributes:
        categories_details: A nested Category serializer that displays details of associated categories.
        categories: A primary key related field to handle multiple categories linked to the scheduled transaction.
        PERIODICITY_CHOICES: A list of periodicity options available for the scheduled transaction.

    Methods:
        create(validated_data): Creates a new scheduled transaction and associates categories.
        update(instance, validated_data): Updates an existing scheduled transaction, including updating associated categories.
    """
    categories_details = CategorySerializer(many=True, read_only=True, source='categories')
    categories = serializers.PrimaryKeyRelatedField(many=True, queryset=Category.objects.all())
    PERIODICITY_CHOICES = ['daily', 'weekly', 'monthly', 'yearly', 'none']

    def create(self, validated_data):
        """
        Overridden method to handle the creation of a scheduled transaction and the association of categories.

        Args:
            validated_data: Data that has passed validation and is ready for saving.

        Returns:
            scheduled_transaction: The created scheduled transaction instance with associated categories.
        """
        print("Original data:", self.initial_data)
        print("Validated data:", validated_data)
        categories = validated_data.pop('categories', [])
        scheduled_transaction = ScheduledTransaction.objects.create(**validated_data)
        scheduled_transaction.categories.set(categories)
        return scheduled_transaction

    def update(self, instance, validated_data):
        """
        Overridden method to handle the update of a scheduled transaction and its associated categories.

        Args:
            instance: The existing scheduled transaction instance to be updated.
            validated_data: Data that has passed validation and is ready for saving.

        Returns:
            instance: The updated scheduled transaction instance.
        """
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
