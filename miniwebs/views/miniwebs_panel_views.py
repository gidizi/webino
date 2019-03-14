from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.urls import reverse
from miniwebs.models import Website, Page, Row, Block, Content, TextContent, ImageContent
from django.contrib import messages
from django.contrib.auth.decorators import login_required

def authorization_check(request, website_id):
	"""The function checks if the requested page/feature belongs to a website
	which is authorized by the currently logged in user.
	The function will return the current website object, for the
	programmer conviniet and for code duplication preventing"""
	try:
		belonged_website = request.user.website_set.get(id=website_id)
		return belonged_website
	except Website.DoesNotExist: 
		raise Http404("URL does not exist")


@login_required
def miniwebs_index(request):
	"""user's websites administration panel"""
	return render(request, 'miniwebs/miniwebs_index.html')


@login_required
def miniweb_creation(request):
	"""website creation view"""
	if request.method =='POST':
		website = Website.objects.create(user = request.user, business_name = request.POST['business_name'],
		                                  web_url = request.POST['web_url'])
		website.save()
		"""HoPa = website.page_set.create(title = "Home Page")
		HoPa.relates_to = HoPa
		HoPa.save()
		AbUs = website.page_set.create(title = "About Us")
		AbUs.relates_to = AbUs
		AbUs.save()
		Con = website.page_set.create(title = "Contact")
		Con.relates_to = Con
		Con.save()"""
		#change those duplications later, youre going to change those pages according to containers format anyway
		messages.success(request, '{} website created successfully'.format(website.business_name))
		return HttpResponseRedirect(reverse('miniwebs:panel', kwargs={'website_id' : website.id, 'action' : 'page'}))	
	else:
		return render(request, 'miniwebs/miniweb_creation.html') #temporarily with no extra data
	#must add validation test later. validate also the url is only string