from rest_framework import serializers
from .models import Collection


class CollectionSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(
        source='owner.username'
    )

    class Meta:
        model = Collection
        fields = '__all__'