from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from logic.models import Transaction
from logic.serializer import TransactionSerializer

class TransactionCreateView(generics.CreateAPIView):
    """
    API view to create a new transaction.

    This view handles the creation of a new transaction. It uses the `TransactionSerializer`
    to validate and save the data when a POST request is made.

    Methods:
        POST: Creates a new transaction using the provided data.
    """
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

@api_view(['GET'])
def get_transactions_by_user(request, id_user):
    """
    This view returns all transactions associated with the user identified by `id_user`.

    Parameters:
        - request: The HTTP request object.
        - id_user: The ID of the user whose transactions are being fetched.

    Returns:
        - Response: A response containing a list of transactions for the specified user,
          or an error message if no transactions are found.
    """
    transactions = Transaction.objects.filter(id_user=id_user)
    serializer = TransactionSerializer(transactions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_transaction(request, transaction_id):
    """
    Delete a specific transaction by its ID.

    Parameters:
        - request: The HTTP request object.
        - transaction_id: The ID of the transaction to be deleted.

    Returns:
        - Response: A message indicating whether the deletion was successful, or an error message if the transaction is not found.
    """
    try:
        transaction = Transaction.objects.get(id_transaction=transaction_id)
        transaction.delete()
        return Response({'message': 'Transaction deleted successfully!'}, status=status.HTTP_200_OK)
    except Transaction.DoesNotExist:
        return Response({'error': 'Transaction not found!'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
def update_user_transaction(request, id_user, id_transaction):
    """"
    Updates a specific transaction for a given user by `id_transaction` and associated with the user `id_user`.
    Only the fields provided in the request are updated (partial update).

    Parameters:
        - request: The HTTP request object containing the data to update.
        - id_user: The ID of the user to which the transaction belongs.
        - id_transaction: The ID of the transaction to be updated.

    Returns:
        - Response: A response containing the updated transaction data, or an error message if the transaction is not found or if the data is invalid.
    """
    try:
        transaction = Transaction.objects.get(id_transaction=id_transaction, id_user=id_user)
    except Transaction.DoesNotExist:
        return Response({"error": "Transaction not found."}, status=status.HTTP_404_NOT_FOUND)
    serializer = TransactionSerializer(transaction, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
