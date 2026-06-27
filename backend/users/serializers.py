import re
from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Profile

def validate_custom_password(password):

    if len(password) < 6:
        raise serializers.ValidationError(
            "A senha deve ter pelo menos 6 caracteres."
        )

    if not re.search(r"[A-Z]", password):
        raise serializers.ValidationError(
            "A senha deve conter pelo menos uma letra maiúscula."
        )

    return password

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ["id", "username", "email", "password"]

    def validate_email(self, value):

        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Este e-mail já está em uso."
            )

        return value

    def validate_password(self, value):
        return validate_custom_password(value)

    def create(self, validated_data):

        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        return user

class ProfileSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(
        source="profile.image",
        required=False,
        allow_null=True
    )

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "image"
        ]

    def update(self, instance, validated_data):

        profile_data = validated_data.pop(
            "profile",
            {}
        )

        instance.username = validated_data.get(
            "username",
            instance.username
        )

        instance.email = validated_data.get(
            "email",
            instance.email
        )

        instance.save()

        if "image" in profile_data:
            instance.profile.image = profile_data["image"]
            instance.profile.save()

        return instance

class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField()

    new_password = serializers.CharField()

    def validate_new_password(self, value):

        return validate_custom_password(value)
    
class DeleteAccountSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)