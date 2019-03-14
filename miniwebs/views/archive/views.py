from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from miniwebs.models import Website, Page, Row, Block, Content, TextContent, ImageContent
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.http import Http404

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


def page(request, web_url, page_id=None): 
	"""load the acctual builded website
	Note: available for all users, authorization not needed"""
	website = Website.objects.get(web_url=web_url)
	if page_id: #if page_id received, open the received page directly, otherwise open the main page
		page = website.page_set.get(id=page_id)
	else:
		page = website.page_set.first()
	return render(request, 'miniwebs/page.html', {'page' : page, 'website' : website})


@login_required
def index(request):
	#user's websites administration panel
	return render(request, 'miniwebs/index.html')


@login_required
def create(request):
	#website creation view
	if request.method =='POST':
		website = Website.objects.create(user = request.user, business_name = request.POST['business_name'] ,
		                                  business_type = request.POST['business_type'],
		                                  web_url = request.POST['web_url'])
		website.theme = "option3" #seperate line because it might be temporary
		website.save()
		HoPa = website.page_set.create(title = "Home Page")
		HoPa.relates_to = HoPa
		HoPa.save()
		AbUs = website.page_set.create(title = "About Us")
		AbUs.relates_to = AbUs
		AbUs.save()
		Con = website.page_set.create(title = "Contact")
		Con.relates_to = Con
		Con.save()
		#change those duplications later, youre going to change those pages according to containers format anyway
		messages.success(request, '{} website created successfully'.format(website.business_name))
		return HttpResponseRedirect(reverse('miniwebs:panel', kwargs={'main_page_id' : website.id, 'action' : 'page'}))	
	else:
		return render(request, 'miniwebs/creation.html') #temporarily with no extra data
	#must add validation test later. validate also the url is only string

@login_required
def panel(request, main_page_id, action, page_id=None):
	""" Website administration panel, allowing the user to view and modify his website.
	The website panel is divided into two main section - navigation menu, and panel's body.
	The 'action' objects sent to the template, instruct the panel which tool to load at the panels's body"""
	website = authorization_check(request, main_page_id)
	if page_id:
		page = website.page_set.get(id=page_id) # i used in other place some alternative way to get or None in one sentence - django anoyning ve kaele #maybe this way is still ok cause i dont want None here
	elif action == 'page_properties':
		page = None #lower one was needed the other one for some cases, find solution to combine both later
	else:
		page = website.page_set.first() #this one might make unexpected problems. delete comment later if its ok
	return render(request, 'miniwebs/panel.html', {'website' : website, 'page' : page, 'action' : action, 'panel' : True})


@login_required
def theme_select(request, main_id):
	#select a theme for user's website
	website = authorization_check(request, main_id)
	if request.method =='POST':
		website.theme = request.POST['theme']
		website.save()
		messages.success(request, 'theme for {} website has changed successfully'.format(website.business_name))
		return HttpResponseRedirect(reverse('miniwebs:panel', kwargs={'main_page_id' : main_id, 'action' : 'theme_select'}))


@login_required
def page_properties(request, main_id, page_id=None): #later can try to seperate add and edit by seperate url
	#add/edit page main (directly class related) properties
	if request.method =='POST':
		website = authorization_check(request, main_id)
		if request.POST['action']=="Add": #fix later through button name seperated from value
			page = website.page_set.create(title = request.POST['title'], sidebar_included = request.POST['extend'])
			if request.POST['parent']: #if a Value for a parent page was sent (user did not choosed "UnAttached")
				related_page_id = request.POST['parent']
				if related_page_id=="current": #a special case of Top level page during page creation only. Top level is defined by a page relates to itsef, at this special case the page object has not yet been created, therefore getting a temporary value of "current" instead of its page.id 
					related_page_id = page.id
				parent_page = website.page_set.get(id=related_page_id)
				page.relates_to = parent_page
				page.save()
			#else: gets the Page's models default value of None
			return HttpResponseRedirect(reverse('miniwebs:structure_panel', kwargs={'website_id' : website.id, 'page_id' : page.id  }))
		else:
			page = website.page_set.get(id=page_id)
			parent_page = website.page_set.filter(id=request.POST['parent']).first() #equivalent to get or None, at this case when only one object can match the conditions
			if request.POST['action']=="Update":
				page.title, page.sidebar_included, page.relates_to = request.POST['title'], \
																				   request.POST['extend'],\
																				   parent_page
				page.save()
				return HttpResponseRedirect(reverse('miniwebs:structure_panel', kwargs={'website_id' : website.id, 'page_id' : page.id  }))
			if request.POST['action']=="Delete":
				page.delete()
				messages.success(request, '{} page deleted successfully'.format(request.POST['title']))
			return HttpResponseRedirect(reverse('miniwebs:panel', kwargs={'main_page_id' : main_id, 'action' : 'pages'}))			
	#must add validation test later
	#messages.success(request, '{} page created successfully'.format(request.POST['title']))
	#messages.success(request, '{} page edited successfully'.format(request.POST['title']))
	#locate the messages in the proper place



@login_required
def structure_panel(request, website_id, page_id):
	"""process the page's structure which was created by the user, and insert into the database. 
	Note that the name of the fields are being sent prearranged from the front end structure panel, by javascript logic,
	therfore, we are entering them to the DB exactly according to their rows and cols indexes under the
	'name' field"""
	website = authorization_check(request, website_id)
	page = website.page_set.get(id=page_id) #just changed. if there are no probs delete this comment
	if request.method =='POST':
		for key in request.POST:
			if 'width' in key : #thus, filter only block's properties from the POST dict
				block_id = key[key.find(" "):]
				row_id = block_id[:block_id.find(";")]
				col_id = block_id[block_id.find(";")+1:]
				width = request.POST['width' +block_id] #acctualy the key, written that way for simmetry
				offset = request.POST['offset' +block_id] #for every width value, there must be offset value with the same id				
				row_obj = Row.objects.filter(page=page, row_id=row_id).first() #equivalent to get or None, at this case when only one object can match the conditions
				if row_obj:
					row_obj.block_set.create(width = width, distance = offset, col_id = col_id )
				else:
					new_row = page.row_set.create(row_id = row_id)
					new_row.block_set.create(width = width, distance = offset, col_id = col_id )
		return HttpResponseRedirect(reverse('miniwebs:temp_stru_values', kwargs={ 'website_id' : website_id, 'page_id' : page.id }))
	else: #if request.method == 'GET'
		return render(request, 'miniwebs/structure_panel.html', { 'website' : website, 'page' : page })

@login_required
def temp_stru_values(request, website_id, page_id):
	"""Managing the content for each block, according to the created structur"""
	website = authorization_check(request, website_id)
	page = website.page_set.get(pk=page_id)
	return render(request, 'miniwebs/temp_stru_values_new.html', { 'website' : website, 'page' : page })

@login_required
def container_content(request, website_id, page_id, row_id, col_id, sub_row_id):
	"""add/edit content for a single Content cell"""
	website = authorization_check(request, website_id)
	page = website.page_set.get(pk=page_id)
	row = Row.objects.filter(row_id=row_id, page=page).first() #equivalent to get or None, at this case when only one object can match the conditions
	block = Block.objects.get(row = row, col_id =col_id)
	content_obj = Content.objects.filter(block=block, sub_row_id=sub_row_id).first() #equivalent to get or None, at this case when only one object can match the conditions
	if request.method =='POST':
		if content_obj:  #needs to be update for the child classes #might use existingContent class function
			content_obj.title = request.POST['title']
			content_obj.save()
			#con_type = content_obj.existingContent() #will try to us soon
			textcontent_obj = TextContent.objects.get(content = content_obj ) #try to make generic
			textcontent_obj.text = request.POST['text_content']
			textcontent_obj.save()
			#old line #content_obj.content, content_obj.title, content_obj.sub_row_id = request.POST['text_content'], request.POST['title'], sub_row_id #seems like sub row id is not needed to be updated!
		else:
			#print("request.Files",request.FILES)
			#old line #Content.objects.create(block=block, content=request.POST['text_content'], title=request.POST['title'], sub_row_id=sub_row_id)
			new_content_obj = Content.objects.create(block=block, title=request.POST['title'], sub_row_id=sub_row_id)
			#here also make some auto type decation. maybe from the  radio butt or the name of the content box, or maybe send it via the form
			TextContent.objects.create(content = new_content_obj, text = request.POST['text_content'])
		return HttpResponseRedirect(reverse('miniwebs:temp_stru_values', kwargs={'website_id' : website_id, 'page_id' : page_id}))
	else:
		return render(request, 'miniwebs/container_content.html', { 'block' : block, 'row' : row, 'website' : website, 'page' : page, 'content_obj' : content_obj, 'sub_row_id' : sub_row_id })


@login_required
def content_actions(request, website_id, page_id, action): #maybe can also send row,col etc at url
	"""Ajax activated view, which enables to execute actions, related to the contnent objects on block.
	Enable to delete content, or change its location inside the block by switching contents 'sub_row_id's"""
	website = authorization_check(request, website_id)
	page = website.page_set.get(pk=page_id)
	print("POST", request.POST)
	block_id = request.POST['location']
	row_id = block_id[block_id.find("row ")+4:block_id.find(" col")]
	row = Row.objects.filter(row_id=row_id, page=page).first() #equivalent to get or None, at this case when only one object can match the conditions
	col_id = block_id[block_id.find(" col ")+5:block_id.find(" sub_row")] 
	sub_row_id = block_id[block_id.find(" sub_row")+8:]
	block = Block.objects.get(row = row, col_id =col_id)
	content_obj = Content.objects.filter(block=block, sub_row_id=sub_row_id).first() #equivalent to get or None, at this case when only one object can match the conditions
	if (action == "delete"): #very temp structure
		content_obj.delete()
	if (action == "moveContentDown"):
		next_content = Content.objects.filter(block=block, sub_row_id__gt=sub_row_id).order_by('sub_row_id').first()
		switchSubRowId(content_obj, next_content)
	if (action == "moveContentUp"):
		prev_content = Content.objects.filter(block=block, sub_row_id__lt=sub_row_id).order_by('sub_row_id').last()
		switchSubRowId(prev_content, content_obj)
	return HttpResponse()

@login_required
def switchSubRowId(first_content, next_content): 
	"""Switching content's sub_row_id value, to change the order the content being represented
	inside a block"""
	curren_id = first_content.sub_row_id
	first_content.sub_row_id = next_content.sub_row_id
	next_content.sub_row_id = curren_id
	first_content.save()
	next_content.save()


#old version before JS
"""def structure_panel(request, website_id, page_id): #for old form before JS
	website = Website.objects.get(id=website_id)
	page = Page.objects.get(id=page_id)
	if request.method =='POST':
		if request.POST['action'] == "next":
			return render(request, 'miniwebs/structure_panel.html', { 'website' : website, 'page' : page, 'elem_num' : request.POST['elem_num']})
		if request.POST['action'] == "resize":
			spec = []
			i=1
			while True:			
				if request.POST.get('width'+str(i)):
					loop_dict = {}
					loop_dict['width'] = int(request.POST.get('width'+str(i)))
					loop_dict['sin_line'] = request.POST.get('sin_line'+str(i))
					loop_dict['offset'] = int(request.POST.get('offset'+str(i)))
					if loop_dict['width'] + loop_dict['offset'] <= 12:
						spec.append(loop_dict)
					else:
						messages.warning(request, 'combination of width and offset of block {} is longer then a full row'.format(str(i)))
						return render(request, 'miniwebs/structure_panel.html', { 'website' : website, 'page' : page })
						#check this return works correctly
					i+=1
				else:
					break
			request.session['spec'] = spec
			return render(request, 'miniwebs/structure_panel.html', { 'website' : website, 'page' : page, 'spec' : spec })
														   'elem_offset' : elem_offset })
		if request.POST['action'] == "send":
			spec = request.session.get('spec')
			for idx,dic in enumerate(spec): # The order of the items will not change between the spec list and the template
				dic['content'] = request.POST.get('content'+str(idx+1))
			return render(request, 'miniwebs/structure_panel.html', { 'website' : website, 'page' : page, 'spec' : spec })
		if request.POST['action'] == "ToDB":
			spec = request.session.get('spec')
			for idx, dic in enumerate(spec):
				page.block_set.create(width=dic['width'], distance=dic['offset'], new_line=dic['sin_line'], order_index=idx+1)
			#for dic in spec:
			return HttpResponseRedirect(reverse('miniwebs:temp_stru_values', kwargs={ 'website_id' : website_id, 'page_id' : page.id }))
	else:
		return render(request, 'miniwebs/structure_panel.html', { 'website' : website, 'page' : page })
"""
