from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from logic.models import User, Transaction, Category
from logic.serializer import CategorySerializer

@api_view(['GET'])
def get_categories_by_user(request, id_user):
    """
    API view to create a new debt entry.

    This view calculates interest and total amount based on the input data, such as
    principal amount, interest rate, and date range, before saving the debt object.
    """ 
    try:
        user = User.objects.get(id_user=id_user)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
    categories = user.categories.all() | Category.objects.filter(is_universal=True)
    categories = categories.distinct()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

def create_or_associate_category_logic(category_name, user):
    category, created = Category.objects.get_or_create(
        category_name=category_name,
        defaults={'is_universal': False}
    )
    if not user.categories.filter(id_category=category.id_category).exists():
        user.categories.add(category)
    return {"category": category,"created": created}

@api_view(['POST'])
def create_or_associate_category(request):
    category_name = request.data.get('category_name')
    id_user = request.data.get('id_user')
    user = User.objects.get(id_user=id_user)

    try:
        result = create_or_associate_category_logic(category_name, user)
    except ValueError as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    category = result["category"]
    created = result["created"]
    return Response({
        "message": "Category created and associated" if created else "Category already exists and associated",
        "category_name": category.category_name,
        "category_id": category.id_category,
        "user_id": user.id_user
    }, status=status.HTTP_200_OK)

@api_view(['PATCH'])
def update_user_category(request, id_user, id_category):
    user = User.objects.get(id_user=id_user)
    category = Category.objects.get(id_category=id_category)
    new_category_name = request.data.get('category_name')

    # Global category: Error
    if category.is_universal:
        print("global error")
        return Response({"error": "Cannot modify global categories."}, status=status.HTTP_400_BAD_REQUEST)

    # Category assocciated with only one user (user who is editing)
    if not category.users.exclude(id_user=user.id_user).exists():
        existing_category = Category.objects.filter(category_name=new_category_name).first()
        if existing_category:
            # make association, delete previous & update transactions
            user.categories.remove(category)
            user.categories.add(existing_category)
            transactions = Transaction.objects.filter(categories=category, id_user=id_user)
            for transaction in transactions:
                transaction.categories.remove(category)
                transaction.categories.add(existing_category)
                transaction.save()

            category.delete()
            print("category with only 1 association complete && exists")
            return Response({
                "message": "Category merged with an existing category.",
                "category_name": existing_category.category_name,
            }, status=status.HTTP_200_OK)
        else:
            # Rename category
            category.category_name = new_category_name
            category.save()
            print("category with only 1 association complete")
            return Response({
                "message": "Category renamed successfully.",
                "category_name": category.category_name,
            }, status=status.HTTP_200_OK)
    # category associated with multiple users
    else:
        new_category, created = Category.objects.get_or_create(
            category_name=new_category_name,
            defaults={'is_universal': False}
        )
        user.categories.remove(category)
        user.categories.add(new_category)

        # update transactions
        transactions = Transaction.objects.filter(categories=category, id_user=id_user)
        for transaction in transactions:
            transaction.categories.remove(category)
            transaction.categories.add(new_category)
            transaction.save()
        print("new category ready")
        return Response({
            "message": "Category duplicated and updated successfully.",
            "category_name": new_category.category_name,
        }, status=status.HTTP_200_OK)
