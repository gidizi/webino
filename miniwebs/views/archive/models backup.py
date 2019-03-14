from django.db import models
from django.contrib.auth.models import User


class Website(models.Model):
	user = models.ForeignKey(User, on_delete=models.CASCADE) # change it later so if user deletes account, business hall will stay unless user explicitly decides to delete it
	business_name = models.CharField(max_length=100, unique=True)
	business_type = models.CharField(max_length=100)  # can add "choices" to limit to several options.
	web_url = models.CharField(max_length=10, unique=True)
	theme = models.CharField(max_length=20)

	class Meta:# not working, it needs to be father id. fix it
		unique_together = ('id','web_url') #in order to show the web_url at the websites url, web_url must be unique for every id 
	


class Page(models.Model):
	website = models.ForeignKey(Website, on_delete=models.CASCADE)
	relates_to = models.ForeignKey('self', null=True, on_delete=models.SET_NULL, default=None) #later on mark on the page that show all pages, pages without link
	title = models.CharField(max_length=200) #make it unique for each website
	#content = models.CharField(max_length=200) #delete soon, duplicate to the rest of the stractur
	sidebar_included = models.BooleanField(default=False) #i should change it for side or lower bar include
	
	class Meta:# not working, it needs to be father id. fix it
		unique_together = (('title', 'id'),) #in order to show the web_url at the websites url, web_url must be unique for every id 

	def __str__(self):
		return self.title

class Row(models.Model):
	page = models.ForeignKey(Page, on_delete=models.CASCADE, null=True)
	row_id = models.IntegerField()


class Block(models.Model):
	row = models.ForeignKey(Row, on_delete=models.CASCADE) #need to save the content if a block is delete!!! looks like cascade is wrong here!
	width = models.IntegerField()
	distance = models.IntegerField()
	col_id = models.IntegerField()

  
	def highestSubRow(self):
		highest_row_id = self.content_set.order_by('sub_row_id').last()
		if highest_row_id:
			return highest_row_id.sub_row_id
		else:
			return 0 #later can change to -1, so it will be like no value + when icreased be 0


class Content(models.Model):
	""" We are using javascript at the frontend, to limit the content object
	to have a maximum of one child class objects such as TextContent, ImageContent etc... """
	#page = models.ForeignKey(Page, on_delete=models.CASCADE, null=True) #required direct relation between the content and the page, for maintaining content available when block deleted. 
	block = models.ForeignKey(Block, on_delete=models.SET_NULL, null=True) #later on mark on the page that show all contents, contents without link
	title = con_type = models.CharField(max_length=40)
	con_type = models.CharField(max_length=40) # can add "choices" to limit to several options. #will tell from which field (diff types) to get the content
	sub_row_id = models.IntegerField(default = 0)

	class Meta:
		   ordering = ['sub_row_id'] # to make sure the content in each block is shown according to its sub row id

	def existingContent(self):
		"""if any child class object exist, return its lowercase class name."""
		if self.textcontent: #change soon to hasattr(self, 'textcontent')
			return "textcontent"
		if self.imagecontent:
			return "imagecontent"


class TextContent(models.Model):
	content = models.OneToOneField(Content, on_delete=models.CASCADE)
	text = models.CharField(max_length=10000)
#    font = models.CharField(max_length=200, null=True)
#    color = models.CharField(max_length=200, null=True)

class ImageContent(models.Model):
	content = models.OneToOneField(Content, on_delete=models.CASCADE)
	image = models.ImageField(upload_to="content_images")
	
#more options: slides, forms

