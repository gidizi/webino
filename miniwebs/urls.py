from django.urls import path
from . import views

app_name = 'miniwebs'
urlpatterns = [
    path('', views.miniwebs_index, name='miniwebs_index'), #websites index
    path('miniweb_creation/', views.miniweb_creation, name='miniweb_creation'), #website creation
    path('theme_select/<int:website_id>/', views.theme_select, name='theme_select'), #theme select
    path('add_page/<int:website_id>/', views.add_page, name='add_page'), #dealing with post requests, of creating page obj
    path('edit_page/<int:website_id>/<int:page_id>/', views.edit_page, name='edit_page'), #dealing with post requests, of edit/delete page obj
    path('structure_panel/<int:website_id>/<int:page_id>/', views.structure_panel, name='structure_panel'), #page structure creation/editing
    path('page_background/<int:website_id>/<int:page_id>/', views.page_background, name='page_background'), #page's background image select
     path('background_del/<int:website_id>/<int:page_id>/', views.delete_page_background, name='delete_page_background'), #delete page's background
    path('content_panel/<int:website_id>/<int:page_id>/', views.content_panel, name='content_panel'), #page contents adding/editing
    path('content_panel/<int:website_id>/<int:page_id>/<slug:action>/', views.content_actions, name='content_actions'), #content object changing sub_row_id or deleting, by ajax calls
    path('content_obj_properties/<int:website_id>/<int:page_id>/<int:row_id>/<int:col_id>/<int:sub_row_id>/', views.content_obj_properties, name='content_obj_properties'), #add / edit content at block's sub row
    path('<int:website_id>/<slug:action>/panel/', views.panel, name='panel'), #users website administration panel
    path('<int:website_id>/<slug:action>/<int:page_id>/panel/', views.panel, name='panel'), #users website administration panel with specific page referance
    #path('<slug:web_url>/<int:page_id>/', views.page, name='page'), #acctual user's website pages
    #path('minisite/<int:main_page_id>/<int:page_id>/', views.page, name='page'), #acctual user's website pages
    #path('structure/', views.structure, name='structure'), #if everything works fine, delete this line
    #path('str_caller/', views.structure_panel, name='structure_panel'), #if everything works fine, delete this line
    #path('content_obj_properties/<int:website_id>/<int:page_id>/', views.content_obj_properties, name='content_obj_properties'), #if everthing works, delete this
    
    
]




