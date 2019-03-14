from django import forms
from .models import Page, ImageContent

class ImageContentForm(forms.ModelForm):
	class Meta:
		model = ImageContent
		fields = ('image',)


class PageBackgroundForm(forms.ModelForm):
	class Meta:
		model = Page
		fields = ('background_img',)
		labels = {
		            'background_img': 'Choose Background Image:',
		        }