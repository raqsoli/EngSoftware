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

# Usado no cadastro (POST /api/register)
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

        # create_user faz o hash da senha
        user = User.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            password=validated_data["password"]
        )

        return user

# Ver editar o proprio perfil
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

# Pra quando vc visita o perfil de outra pessoa
class PublicProfileSerializer(serializers.ModelSerializer):
    """
    Serializer para dados PÚBLICOS de qualquer usuário
    (usado em /api/users/<id>/). Nunca deve incluir e-mail
    ou qualquer outro dado sensível — só o que pode aparecer
    na página de perfil de outra pessoa.
    """

    avatar = serializers.SerializerMethodField()

    totalItems = serializers.SerializerMethodField()

    totalCollections = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "avatar",
            "totalItems",
            "totalCollections"
        ]

    def get_avatar(self, obj):

        request = self.context.get("request")

        profile = getattr(obj, "profile", None)

        if not profile or not profile.image:
            return None

        if request:
            return request.build_absolute_uri(profile.image.url)

        return profile.image.url

    def get_totalItems(self, obj):
        # Item.owner tem related_name='items' explícito
        return obj.items.count()

    def get_totalCollections(self, obj):
        # Collection.owner tem related_name='collections' explícito
        return obj.collections.count()


class ChangePasswordSerializer(serializers.Serializer):

    old_password = serializers.CharField()

    new_password = serializers.CharField()

    def validate_new_password(self, value):

        return validate_custom_password(value)
    
class DeleteAccountSerializer(serializers.Serializer):
    password = serializers.CharField(write_only=True)