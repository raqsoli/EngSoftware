from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsOwnerOrReadOnly(BasePermission):
    """
    Permite leitura para qualquer usuário,
    mas escrita apenas para o proprietário.
    """

    def has_object_permission(self, request, view, obj):

        if request.method in SAFE_METHODS:
            return True

        return obj.owner == request.user
    
# GET, HEAD e OPTIONS → liberados para todos.
# POST, PUT, PATCH, DELETE → somente o dono.