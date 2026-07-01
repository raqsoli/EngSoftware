from django.urls import path

from .views import (
    RegisterView,
    ProfileView,
    PublicUserDetailView,
    ChangePasswordView,
    DeleteAccountView
)

urlpatterns = [
    path(
        "register/",
        RegisterView.as_view(),
        name="register"
    ),

    path(
        "profile/",
        ProfileView.as_view(),
        name="profile"
    ),

    path(
        "users/<int:pk>/",
        PublicUserDetailView.as_view(),
        name="user-detail"
    ),

    path(
        "change-password/",
        ChangePasswordView.as_view(),
        name="change_password"
    ),

    path(
        "delete-account/",
        DeleteAccountView.as_view(),
        name="delete_account"
    ),
]