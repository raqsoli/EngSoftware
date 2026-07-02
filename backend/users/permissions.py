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
    
# Essa é uma permission class customizada, reaproveitada tanto em items quanto em collections_app. 
# SAFE_METHODS é uma constante do DRF que significa GET, HEAD, OPTIONS — métodos que só leem dado, nunca alteram.
# A lógica: "se o método é só leitura, libera geral. Se é escrita (POST, PUT, PATCH, DELETE), só libera se obj.owner for igual a quem está fazendo a requisição."
# Isso é checado por objeto (has_object_permission), ou seja, o Django precisa primeiro buscar o item/coleção específico no banco pra então comparar o dono. 
# Se alguém tentar editar um item que não é dele, o DRF devolve 403 Forbidden (usuário está autenticado, mas não tem permissão pra essa ação específica — diferente de 401, que é "nem sei quem você é").