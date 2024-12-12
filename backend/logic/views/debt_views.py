from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.exceptions import ValidationError
from logic.models import Debt, Transaction
from logic.serializer import DebtsSerializer
from datetime import datetime, timezone
from dateutil.parser import isoparse
from logic.views.category_views import  create_or_associate_category_logic
from logic.models import Category

class DebtsCreateView(generics.CreateAPIView):
    queryset = Debt.objects.all()
    serializer_class = DebtsSerializer

    def create(self, request, *args, **kwargs):
        print("Received Data:", request.data)

        amount = float(request.data.get('amount', 0))
        interestAmount = float(request.data.get('interestAmount', 0))
        has_interest = request.data.get('hasInterest', False)
        init_date = isoparse(request.data.get('init_date', datetime.now(timezone.utc).isoformat()))
        due_date = isoparse(request.data.get('due_date', datetime.now(timezone.utc).isoformat()))
        months = (due_date.year - init_date.year) * 12 + due_date.month - init_date.month

        if has_interest and interestAmount > 0 and months > 0:
            interest = amount * (interestAmount / 100) * months
            total_amount = amount + interest
        else:
            interest = 0
            total_amount = amount

        request.data['interestAmount'] = interest
        request.data['totalAmount'] = total_amount

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        debt = serializer.save()

        if debt.status == Debt.StatusEnum.PAID:
            user = debt.id_user
            result = create_or_associate_category_logic("Debt", user)
            debt_category = result["category"]

            transaction = Transaction.objects.create(
                id_user=user,
                mount=total_amount,
                description=f"{debt.description or 'No description'}",
                type=Transaction.TransEnum.EXPENSE
            )
            transaction.categories.add(debt_category)
            debt.transaction = transaction
            debt.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['PATCH'])
def update_user_debt(request, id_user, id_debt):
    try:
        debt = Debt.objects.get(id_debt=id_debt, id_user=id_user)
    except Debt.DoesNotExist:
        return Response({"error": "Debt not found."}, status=status.HTTP_404_NOT_FOUND)

    previous_status = debt.status

    amount = float(request.data.get('amount', debt.amount))
    interest_rate = float(request.data.get('interestAmount', debt.interestAmount))
    has_interest = request.data.get('hasInterest', debt.hasInterest)
    init_date = isoparse(request.data.get('init_date', datetime.now(timezone.utc).isoformat()))
    due_date = isoparse(request.data.get('due_date', datetime.now(timezone.utc).isoformat()))
    months = (due_date.year - init_date.year) * 12 + due_date.month - init_date.month

    if has_interest and interest_rate > 0 and months > 0:
        interest = amount * (interest_rate / 100) * months
        total_amount = amount + interest
    else:
        interest = 0
        total_amount = amount

    request.data['interestAmount'] = interest
    request.data['totalAmount'] = total_amount

    serializer = DebtsSerializer(debt, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()

        new_status = serializer.validated_data.get('status', debt.status)

        if previous_status == Debt.StatusEnum.PAID and debt.transaction:
            debt.transaction.delete()
            debt.transaction = None

        if new_status == Debt.StatusEnum.PAID:
            user = debt.id_user
            result = create_or_associate_category_logic("Debt", user)
            debt_category = result["category"]

            transaction = Transaction.objects.create(
                id_user=user,
                mount=total_amount,
                description=f"{serializer.validated_data.get('description', debt.description or 'No description')}",
                type=Transaction.TransEnum.EXPENSE
            )
            transaction.categories.add(debt_category)
            debt.transaction = transaction
            debt.save()

        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
def get_debts_by_user(request, id_user):
    debts = Debt.objects.filter(id_user=id_user)
    serializer = DebtsSerializer(debts, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['DELETE'])
def delete_debt(request, id_debt):
    try:
        debt = Debt.objects.get(id_debt=id_debt)

        if debt.transaction:
            debt.transaction.delete()

        debt.delete()
        return Response({'message': 'Debt deleted successfully!'}, status=status.HTTP_200_OK)
    except Debt.DoesNotExist:
        return Response({'error': 'Debt not found!'}, status=status.HTTP_404_NOT_FOUND)
