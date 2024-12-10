from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from logic.models import User, ScheduledTransaction
from logic.serializer import ScheduledTransactionSerializer

class ScheduledTransactionListCreateView(generics.ListCreateAPIView):
    queryset = ScheduledTransaction.objects.all()
    serializer_class = ScheduledTransactionSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("Validation errors:", serializer.errors)  
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return super().create(request, *args, **kwargs)


class ScheduledTransactionUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ScheduledTransaction.objects.all()
    serializer_class = ScheduledTransactionSerializer
    lookup_field = 'id_scheduled_transaction'

@api_view(['GET'])
def get_scheduled_transactions_by_user(request, id_user):
    try:
        user = User.objects.get(id_user=id_user)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    scheduled_transactions = ScheduledTransaction.objects.filter(user=user)
    serializer = ScheduledTransactionSerializer(scheduled_transactions, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_scheduled_transaction(request, transaction_id):
    try:
        transaction = ScheduledTransaction.objects.get(id_transaction=transaction_id)
        transaction.delete()
        return Response({'message': 'Scheduled transaction deleted successfully!'}, status=status.HTTP_200_OK)
    except ScheduledTransaction.DoesNotExist:
        return Response({'error': 'Scheduled transaction not found!'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
def update_scheduled_transaction(request, transaction_id):
    try:
        transaction = ScheduledTransaction.objects.get(id_transaction=transaction_id)
    except ScheduledTransaction.DoesNotExist:
        return Response({'error': 'Scheduled transaction not found!'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = ScheduledTransactionSerializer(transaction, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)