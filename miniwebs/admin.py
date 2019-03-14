from django.contrib import admin
from .models import Website, Page, Row, Block, Content, TextContent, ImageContent

from django.contrib.contenttypes.admin import GenericStackedInline
from django.contrib.contenttypes.admin import GenericTabularInline #might use later for page! otherwise delete

class PageInLine(admin.StackedInline):
	model = Page
	extra = 0
	fields = ['website', 'relates_to', 'title', 'id', 'footer_included']

class WebsiteAdmin(admin.ModelAdmin):
	inlines = [PageInLine]

admin.site.register(Website, WebsiteAdmin)

class RowInLine(admin.StackedInline):
	model = Row
	extra = 0

class ContentTabular(GenericTabularInline): #might be temp. because all items here are very temporary for proccess
	model = Content
	extra = 0 

class PageAdmin(admin.ModelAdmin):
    fields = ['website', 'relates_to', 'title', 'footer_included', 'background_img']
    inlines = [RowInLine,ContentTabular]

admin.site.register(Page, PageAdmin)

class BlockInLine(admin.StackedInline):
	model = Block
	extra = 0

class RowAdmin(admin.ModelAdmin):
    inlines = [BlockInLine]

admin.site.register(Row, RowAdmin)

class ContentInLine(GenericStackedInline):
	model = Content
	extra = 0 

class BlockAdmin(admin.ModelAdmin):
	inlines = [ContentInLine]

admin.site.register(Block, BlockAdmin)


class TextConInLine(admin.StackedInline): #there going to be another like this for each cont type
	model = TextContent
	extra = 0

class ImageConInLine(admin.StackedInline): #there going to be another like this for each cont type
	model = ImageContent
	extra = 0

class BlockAdmin(admin.ModelAdmin): #i think the name is wrong. should be content
	inlines = [TextConInLine, ImageConInLine]
	#fields = ['title', 'con_type', 'sub_row_id','content_type','object_id','content_object']

admin.site.register(Content, BlockAdmin)

admin.site.register(TextContent)
admin.site.register(ImageContent)

"""
admin.site.register(Website)
admin.site.register(Page)
admin.site.register(Row)
admin.site.register(Block)
admin.site.register(Content)
"""
