from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from logic.models import User, ScheduledTransaction
from logic.serializer import ScheduledTransactionSerializer

class ScheduledTransactionListCreateView(generics.ListCreateAPIView):
    """
    API view to list and create scheduled transactions.

    This class provides the ability to list all scheduled transactions and create new ones.
    It uses the `ScheduledTransactionSerializer` to handle both the GET and POST requests.
    """
    queryset = ScheduledTransaction.objects.all()
    serializer_class = ScheduledTransactionSerializer

    def create(self, request, *args, **kwargs):
        """
        Custom create method to validate the data before creating a new scheduled transaction.

        If the data is invalid, it returns a 400 response with the validation errors.
        If valid, it delegates the creation to the superclass.

        Parameters:
            - request: The HTTP request object containing the data for the scheduled transaction.

        Returns:
            - Response: A response indicating whether the scheduled transaction was created successfully,
              or an error message with the validation issues if the request is invalid.
        """
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)


class ScheduledTransactionUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    API view to retrieve, update, or delete a specific scheduled transaction.

    This view allows fetching, updating, or deleting a scheduled transaction based on its ID (`id_scheduled_transaction`).
    It uses the `ScheduledTransactionSerializer` to serialize the data.
    """
    queryset = ScheduledTransaction.objects.all()
    serializer_class = ScheduledTransactionSerializer
    lookup_field = 'id_scheduled_transaction'

@api_view(['GET'])
def get_scheduled_transactions_by_user(request, id_user):
    """
    Retrieve all scheduled transactions for a specific user.

    This view returns all scheduled transactions associated with the user identified by `id_user`.

    Parameters:
        - request: The HTTP request object.
        - id_user: The ID of the user whose scheduled transactions are being fetched.

    Returns:
        - Response: A response containing a list of scheduled transactions for the user,
          or an error message if the user is not found.
    """
    try:
        user = User.objects.get(id_user=id_user)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    scheduled_transactions = ScheduledTransaction.objects.filter(user=user)
    serializer = ScheduledTransactionSerializer(scheduled_transactions, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_scheduled_transaction(request, transaction_id):
    """
    Delete a specific scheduled transaction.

    This view deletes the scheduled transaction with the given `transaction_id`.

    Parameters:
        - request: The HTTP request object.
        - transaction_id: The ID of the scheduled transaction to be deleted.

    Returns:
        - Response: A message indicating whether the deletion was successful, or an error message if the transaction is not found.
    """
    try:
        transaction = ScheduledTransaction.objects.get(id_transaction=transaction_id)
        transaction.delete()
        return Response({'message': 'Scheduled transaction deleted successfully!'}, status=status.HTTP_200_OK)
    except ScheduledTransaction.DoesNotExist:
        return Response({'error': 'Scheduled transaction not found!'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
def update_scheduled_transaction(request, transaction_id):
    """
    Update a specific scheduled transaction.

    This view updates a scheduled transaction partially with the data provided in the request body.
    It only updates the fields provided (partial update).

    Parameters:
        - request: The HTTP request object containing the data to update.
        - transaction_id: The ID of the scheduled transaction to be updated.

    Returns:
        - Response: A response containing the updated transaction data, or an error message if the transaction is not found or the data is invalid.
    """
    try:
        transaction = ScheduledTransaction.objects.get(id_transaction=transaction_id)
    except ScheduledTransaction.DoesNotExist:
        return Response({'error': 'Scheduled transaction not found!'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ScheduledTransactionSerializer(transaction, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
