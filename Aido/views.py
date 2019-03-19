from django.shortcuts import render
from miniwebs.models import Website, Page, Row, Block, Content, TextContent, ImageContent
from django.http import HttpResponseRedirect
from django.urls import reverse


def page(request, web_url, page_id=None): 
	"""load the acctual builded website
	Note: available for all users, authorization isn't needed"""
	website = Website.objects.get(web_url=web_url)
	if page_id: #must make this condition. cannot try to get from db anyway, because db might find value with id equals to None
		page = website.page_set.get(id=page_id)
	else:
		try:
			page = website.page_set.first()
		except:
			page = None
	return render(request, 'general/page_base.html', {'page' : page, 'website' : website})



def main_route(request):
	if request.user.is_authenticated:
		return HttpResponseRedirect(reverse('miniwebs:miniwebs_index'))
	else:
		return HttpResponseRedirect(reverse('register'))
