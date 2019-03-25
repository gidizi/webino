from django.db import models
from django.contrib.auth.models import User

from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericRelation



class Content(models.Model): #make sure it have to be at the top of the page. if it does leave apropriate comment for explenation.
	""" We are using javascript at the frontend, to limit the content object
	to have a maximum of one child class objects such as TextContent, ImageContent etc... """
	#page = models.ForeignKey(Page, on_delete=models.CASCADE, null=True) #required direct relation between the content and the page, for maintaining content available when block deleted. 
	#block = models.ForeignKey(Block, on_delete=models.SET_NULL, null=True) #later on mark on the page that show all contents, contents without link
	title =  models.CharField(max_length=40)
	#con_type = models.CharField(max_length=40) # this field reffers to image or text content, and its different from the generic keys 'content_type' field  # can add "choices" to limit to several options. #will tell from which field (diff types) to get the content
	sub_row_id = models.IntegerField(default = 0)
	url_link = models.URLField(default="") #can change later to default=None
	content_type =   models.ForeignKey(ContentType, blank=True, null=True, on_delete=models.SET_NULL) #Note, according to documentation, GenericForeignKey do not accept on_delete argument. (signals can be used as an alternative but we will not use them here). To avoid content deletations in cases which block is being deleted (during recreating structure proc for example), we will attach the content directly to its parent page in such cases via the view function. (i wrote the on_delete arg just because otherwise it gives an unclear erro, although its not working and shouldnt be working according to the documentations) 
	object_id = models.PositiveIntegerField(blank=True, null=True)
	content_object=GenericForeignKey('content_type', 'object_id') # change later the content_obj name at the view

	class Meta:
		   ordering = ['sub_row_id'] # to make sure the content in each block is shown according to its sub row id

	def existingContentType(self):
		"""if any child class object exist, return its lowercase class name."""
		"""if self.textcontent: #change soon to hasattr(self, 'textcontent')
			return "textcontent"
		if self.imagecontent:
			return "imagecontent"""
		if  hasattr(self, 'textcontent'): #change soon to hasattr(self, 'textcontent')
			return "textcontent"
		if  hasattr(self, 'imagecontent'):
			return "imagecontent"

	def __str__(self):
		return "Title: "+str(self.title)+" Content Type: "+str(self.content_type)+", Object Id: "+str(self.object_id)

class Website(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE, null=True) # change it later so if user deletes account, business hall will stay unless user explicitly decides to delete it
	business_name = models.CharField(max_length=15)
	#business_type = models.CharField(max_length=16)  # can add "choices" to limit to several options.
	web_url = models.CharField(max_length=10, unique=True)
	#theme = models.CharField(max_length=20) #if everything works fine - delete this line
	menu_back_color = models.CharField(max_length=7, default="#8080FF")
	menu_text_color = models.CharField(max_length=7, default="#000000")
	page_back_color = models.CharField(max_length=7, default="#FFFFFF")
	foot_back_color = models.CharField(max_length=7, default="#faebd7")

	class Meta:# not working, it needs to be father id. fix it
		unique_together = ('id','web_url') #in order to show the web_url at the websites url, web_url must be unique for every id 
	
	def __str__(self):
		return self.business_name

class Page(models.Model):
	website = models.ForeignKey(Website, on_delete=models.CASCADE, null=True)
	relates_to = models.ForeignKey('self', null=True, on_delete=models.SET_NULL, default=None)
	title = models.CharField(max_length=12) 
	footer_included = models.BooleanField(default=False)
	content = GenericRelation(Content, related_query_name='pages')
	background_img = models.ImageField(upload_to="pages_background", blank=True, null=True)

	class Meta:# not working, it needs to be father id. fix it
		unique_together = (('title', 'id'),) #in order to show the web_url at the websites url, web_url must be unique for every id 

	def __str__(self):
		return self.title

	class Meta:
		   ordering = ['id'] # to make sure the pages will be show by the order of creation

class Row(models.Model):
	page = models.ForeignKey(Page, on_delete=models.CASCADE, null=True) #check if i acctually want null = true
	row_id = models.IntegerField()


class Block(models.Model):
	row = models.ForeignKey(Row, on_delete=models.CASCADE, null=True) #need to save the content if a block is delete!!! looks like cascade is wrong here!
	width = models.IntegerField()
	distance = models.IntegerField()
	col_id = models.IntegerField()
	content = GenericRelation(Content, related_query_name='blocks')

  
	def highestSubRow(self):
		#highest_row_id = self.content_set.order_by('sub_row_id').last()
		highest_row_id = self.content.order_by('sub_row_id').last()
		if highest_row_id:
			return highest_row_id.sub_row_id
		else:
			return 0 #later can change to -1, so it will be like no value + when icreased be 0




class TextContent(models.Model):
	content = models.OneToOneField(Content, on_delete=models.CASCADE, null=True)
	text = models.CharField(max_length=10000)
	size = models.CharField(max_length=4, default="16px")
	color = models.CharField(max_length=7, default="#000000")
	bold = models.CharField(max_length=6, default="normal") #choose from list later, if possible
	align = models.CharField(max_length=6, default="left") #choose from list later, if possible

class ImageContent(models.Model):
	content = models.OneToOneField(Content, on_delete=models.CASCADE, null=True)
	image = models.ImageField(upload_to="content_images")


	
#more options: slides, forms


