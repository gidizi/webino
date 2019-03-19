"""Aido URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.contrib.auth import views as auth_views
from django.urls import path, include
from users import views as user_views
from . import views

from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', views.main_route, name="main_route"),
    path('admin/', admin.site.urls),
    path('miniwebs/', include('miniwebs.urls')),
    path('register/', user_views.register, name="register"),
    path('login/', auth_views.LoginView.as_view(template_name='users/login.html'), name="login"), #notice those are class based views
    path('logout/', auth_views.LogoutView.as_view(template_name='users/logout.html'), name="logout"), #notice those are class based views
    path('<slug:web_url>/', views.page, name='page'), #acctual user's websites pages
    path('<slug:web_url>/<int:page_id>/', views.page, name='page'), #acctual user's websites pages

    
] 

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)