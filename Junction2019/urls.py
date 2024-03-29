"""Junction2019 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
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
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include

from Junction2019.utils.router import APIRouter
from kakkospakki.views import JobView, EventView, ImageView, UserView, HousingManagerView, FeedbackView, EmployeeView

router = APIRouter()

router.register('jobs', JobView)
router.register('images', ImageView)
router.register('events', EventView)
router.register('users', UserView)
router.register('housing_managers', HousingManagerView)
router.register('feedback', FeedbackView)
router.register('employees', EmployeeView)

urlpatterns = [
    path('admin/', admin.site.urls),
    url(r'^api/', include(router.urls)),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
