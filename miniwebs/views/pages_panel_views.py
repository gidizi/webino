from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.urls import reverse
from miniwebs.models import Website, Page, Row, Block, Content, TextContent, ImageContent
from miniwebs.forms import ImageContentForm, PageBackgroundForm
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
def panel(request, website_id, action, page_id=None):
	""" Website administration panel, allowing the user to view and modify his website.
	The website panel is divided into two main section - navigation menu, and panel's body.
	The 'action' objects sent to the template, instruct the panel which tool to load at the panels's body"""
	website = authorization_check(request, website_id)
	if page_id:  #this condition is required. cannot try to get from db anyway, because db might find value with id equals to None
		page = website.page_set.get(id=page_id) # i used in other place some alternative way to get or None in one sentence - django anoyning ve kaele #maybe this way is still ok cause i dont want None here
	elif action == 'page':
		try:
			page = website.page_set.first() #dont want to automatically send it to the template when clicking 'Website Preview' button, because of the special case when no pages exists
			first_page_url = reverse('page', kwargs={'web_url' : website.web_url, 'page_id' : page.id})
			return render(request, 'miniwebs/panel.html', {'website' : website, 'page' : page, 'action' : action, 'panel' : True, 'first_page_url' : first_page_url})
		except:
			page = None
	else:
		page = None
	return render(request, 'miniwebs/panel.html', {'website' : website, 'page' : page, 'action' : action, 'panel' : True})


@login_required
def theme_select(request, website_id):
	"""select a theme for user's website"""
	website = authorization_check(request, website_id)
	if request.method =='POST':
		print("new color request", request.POST)
		website.menu_back_color = request.POST['menuback']
		website.menu_text_color = request.POST['menutext']
		website.page_back_color = request.POST['pageback']
		website.foot_back_color = request.POST['footback']
		#website.theme = request.POST['theme']
		website.save()
		messages.success(request, 'theme for {} website has changed successfully'.format(website.business_name))
		return HttpResponseRedirect(reverse('miniwebs:panel', kwargs={'website_id' : website_id, 'action' : 'theme_select'}))


@login_required
def add_page(request, website_id): #later can try to seperate add and edit by seperate url
	"""add/edit page main (directly class related) properties"""
	if request.method =='POST': #only case, written for readability only. Get request will be handled via the administration panel
		website = authorization_check(request, website_id)
		page = website.page_set.create(title = request.POST['title'], footer_included = request.POST['extend'])
		if request.POST['parent']: #if a Value for a parent page was sent (user did not choosed "UnAttached")
			related_page_id = request.POST['parent']
			if related_page_id=="current": #a special case of Top level page during page creation only. Top level is defined by a page relates to itsef, at this special case the page object has not yet been created, therefore getting a temporary value of "current" instead of its page.id 
				related_page_id = page.id
			parent_page = website.page_set.get(id=related_page_id)
			page.relates_to = parent_page
			page.save()
		#else: 
			#page.relates_to gets the Page's models default value of None
		return HttpResponseRedirect(reverse('miniwebs:structure_panel', kwargs={'website_id' : website.id, 'page_id' : page.id  }))
		
@login_required
def edit_page(request, website_id, page_id):
	if request.method =='POST': #only case, written for readability only. Get request will be handled via the administration panel
		website = authorization_check(request, website_id)
		page = website.page_set.get(id=page_id)
		parent_page = website.page_set.filter(id=request.POST['parent']).first() #equivalent to get or None, at this case when only one object can match the conditions
		if request.POST['action']=="Update":
			page.title, page.footer_included, page.relates_to = request.POST['title'], \
																			   request.POST['extend'],\
																			   parent_page
			page.save()
			return HttpResponseRedirect(reverse('miniwebs:structure_panel', kwargs={'website_id' : website.id, 'page_id' : page.id  }))
		elif request.POST['action']=="Delete":
			page.delete()
			messages.success(request, '{} page deleted successfully'.format(request.POST['title']))
		return HttpResponseRedirect(reverse('miniwebs:panel', kwargs={'website_id' : website_id, 'action' : 'pages_list'}))			

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
	print("request.Post ",request.POST)
	if request.method =='POST':
		if page.row_set.all(): #checks is page already have existing structure (if there are any existing rows)
			page_contents = Content.objects.filter(blocks__row__page=page) #getting all the contents related to the current page
			for item in page_contents: #changing the content's generic relation, to be attached directly to the page, so that the contents which they're blocks where deleted (and wont be auto attached back to they're block), will still be attached to the page and available for the user.
				item.content_object=page 
				item.save()
			page.row_set.all().delete()
			is_it_new_page = False
		else:
			is_it_new_page = True
			pre="content_images/examples/"
			example_img_urls = [pre+"giraffe_.jpg",pre+"wingsuit.jpg",
			pre+"climbing_.jpg",pre+"atom.png"]
			example_url_index = 0
		for key in request.POST:
			if 'width' in key : 
				""" we arbitrary choosed 'width' as a sign to a field's group.
				we could alternetively filter by any other field (offset/attachedContentId) which
				is being sent as part of the block's field group"""
				block_id = key[key.find(" "):]
				row_id = block_id[:block_id.find(";")]
				col_id = block_id[block_id.find(";")+1:]
				width = request.POST['width' +block_id] #acctualy the key, written that way for simmetry
				offset = request.POST['offset' +block_id] #for every width value, there must be offset value with the same id				
				row_obj = Row.objects.filter(page=page, row_id=row_id).first() #equivalent to get or None, at this case when only one object can match the conditions
				"""if row_obj:
					row_obj.block_set.create(width = width, distance = offset, col_id = col_id )
				else:
					new_row = page.row_set.create(row_id = row_id)
					new_row.block_set.create(width = width, distance = offset, col_id = col_id )""" #if everything works delete it
				if not row_obj:
					row_obj = page.row_set.create(row_id = row_id)
				#row_obj.block_set.create(width = width, distance = offset, col_id = col_id )
				new_block = row_obj.block_set.create(width = width, distance = offset, col_id = col_id )
				if is_it_new_page: #generating example content, if its a new page creation
					title_content_example = Content.objects.create(content_object=new_block,
					 title = "Example Title" + row_id + " " + col_id,  sub_row_id=0)
					TextContent.objects.create(content = title_content_example, size = 24, color = '#0000FF',
					 bold = 'bold', align = 'left' ,text = "Example Title Row" + row_id + " Block " + col_id)
					text_content_example = Content.objects.create(content_object=new_block,
					 title = "Example Content" + row_id + " " + col_id,  sub_row_id=1)
					TextContent.objects.create(content = text_content_example, size = 18, color = '#000000',
					 bold = 'normal', align = 'center' ,text = "Generic Example Content,\n Please fill the block with your own contents")
					image_content_example = Content.objects.create(content_object=new_block,
					 title = "Example Image" + row_id + " " + col_id,  sub_row_id=2)
					ImageContent.objects.create(content = image_content_example, image = example_img_urls[example_url_index%4])
					example_url_index +=1
				else:
					contentIds = request.POST['attachedContentId' +block_id]
					for content_id in contentIds.split(",")[:-1]: #ataching the existing contents, to their relevant blocks at the new structure
						print("content id",content_id)
						content = Content.objects.get(id=content_id)
						content.content_object = new_block
						content.save()
		return HttpResponseRedirect(reverse('miniwebs:content_panel', kwargs={ 'website_id' : website_id, 'page_id' : page_id }))
	else: #if request.method == 'GET'
		background_img_form = PageBackgroundForm()
		return render(request, 'miniwebs/structure_panel.html', { 'website' : website, 'page' : page, 'background_img_form' : background_img_form })




@login_required
def delete_page_background(request, website_id, page_id):
	"""page background image select"""
	website = authorization_check(request, website_id)
	page = website.page_set.get(pk=page_id)
	page.background_img=""
	page.save()
	#later need to add commands to delete the image from the filesystem
	return HttpResponseRedirect(reverse('miniwebs:structure_panel', kwargs={ 'website_id' : website_id, 'page_id' : page_id }))


@login_required
def page_background(request, website_id, page_id):
	"""page background image select"""
	website = authorization_check(request, website_id)
	page = website.page_set.get(pk=page_id)
	if (request.method =='POST') and ('background_img' in request.FILES):
		print(" entered the post + image")
		background_img_form = PageBackgroundForm(request.POST, request.FILES, instance=page)
		print ("")
		if background_img_form.is_valid():
			print("valid indeed")
			background_img_form.save()
	return HttpResponseRedirect(reverse('miniwebs:structure_panel', kwargs={ 'website_id' : website_id, 'page_id' : page_id }))
	

@login_required
def content_panel(request, website_id, page_id):
	"""Managing the content for each block, according to the created structure"""
	website = authorization_check(request, website_id)
	page = website.page_set.get(pk=page_id)
	return render(request, 'miniwebs/content_panel.html', { 'website' : website, 'page' : page })

@login_required
def content_obj_properties(request, website_id, page_id, row_id, col_id, sub_row_id):
	"""add/edit content for a single Content cell"""
	website = authorization_check(request, website_id)
	page = website.page_set.get(pk=page_id)
	row = Row.objects.filter(row_id=row_id, page=page).first() #equivalent to get or None, at this case when only one object can match the conditions
	block = Block.objects.get(row = row, col_id =col_id)
	#content_obj = Content.objects.filter(block=block, sub_row_id=sub_row_id).first() #equivalent to get or None, at this case when only one object can match the conditions
	content_obj = block.content.filter(sub_row_id=sub_row_id).first() #equivalent to get or None, at this case when only one object can match the conditions
	if request.method =='POST':
		if 'image' in request.FILES :
			if content_obj:
				if hasattr(content_obj, 'textcontent'): #case should not be available via javascript restriction, weitten just for safety in case JS failed
					return HttpResponseRedirect(reverse('miniwebs:content_panel', kwargs={ 'website_id' : website_id, 'page_id' : page_id }))
				image_form = ImageContentForm(request.POST, request.FILES, instance=content_obj.imagecontent)
			else:
				image_form = ImageContentForm(request.POST, request.FILES)
			if image_form.is_valid():
				if not content_obj:
					content_obj = Content.objects.create(content_object=block, sub_row_id=sub_row_id) #want to create only if form is valid! otherwise dont want to create object at the DB
				image_content = image_form.save(commit=False)
				image_content.content = content_obj #very temp to see if working at all
				image_content.save()
				updateContentProperties(request, content_obj)
				"""content_obj.title = request.POST['title']
				if 'use_content_as_link' in request.POST:
					content_obj.url_link = request.POST['url_link']
				content_obj.save()"""
		else:
			if content_obj:
				if hasattr(content_obj, 'imagecontent'): # case of editing existing image content object, with no image uploaded, just general content details updated.
				# also restriction for case when JS failed and user managed to fill imageform for content of textcontent type
					updateContentProperties(request, content_obj) 
					return HttpResponseRedirect(reverse('miniwebs:content_panel', kwargs={ 'website_id' : website_id, 'page_id' : page_id }))
				textcontent_obj = TextContent.objects.get(content = content_obj ) #try to make generic
			else:
				content_obj = Content.objects.create(content_object=block, sub_row_id=sub_row_id)
				textcontent_obj = TextContent.objects.create(content = content_obj)
			updateContentProperties(request, content_obj)
			"""content_obj.title = request.POST['title']
			if 'use_content_as_link' in request.POST:
				content_obj.url_link = request.POST['url_link']
			content_obj.save()"""
			textcontent_obj.text = request.POST['text_content']
			textcontent_obj.size = request.POST['size']
			textcontent_obj.color = request.POST['color']
			textcontent_obj.bold = request.POST['bold']
			textcontent_obj.align = request.POST['align']
			textcontent_obj.save()
		
		return HttpResponseRedirect(reverse('miniwebs:content_panel', kwargs={ 'website_id' : website_id, 'page_id' : page_id }))
	else:
		image_form = ImageContentForm()
		return render(request, 'miniwebs/content_obj_properties.html', { 'block_obj' : block, 'row' : row, 'website' : website, 'page' : page, 'content_obj' : content_obj, 'sub_row_id' : sub_row_id, 'image_form' : image_form })
		#key block_obj instead of block, because of name collision at the template

def updateContentProperties(request, content_obj):
	content_obj.title = request.POST['title']
	if 'use_content_as_link' in request.POST:
		content_obj.url_link = request.POST['url_link']
	content_obj.save()


@login_required
def content_actions(request, website_id, page_id, action): #maybe can also send row,col etc at url
	"""Ajax activated view, which enables to execute actions, related to the contnent objects on block.
	Enable to delete content, or change its location inside the block by switching contents 'sub_row_id's"""
	website = authorization_check(request, website_id)
	page = website.page_set.get(pk=page_id)
	print("POST", request.POST)
	#block_id = request.POST['block_props']
	#row_id = block_id[block_id.find("row ")+4:block_id.find(" col")]
	#row = Row.objects.filter(row_id=row_id, page=page).first() #equivalent to get or None, at this case when only one object can match the conditions
	if "row_id" in request.POST: #looks ugly in this structure. written it because the error arrived (i think so) when i used request.POST["row_id"] but it was not exist (not sure because it gave multivalue error)
		row_id = request.POST["row_id"]
		row = Row.objects.filter(row_id=row_id, page=page).first() #equivalent to get or None, at this case when only one object can match the conditions
		#col_id = block_id[block_id.find(" col ")+5:block_id.find(" sub_row")] 
		col_id = request.POST["col_id"]
		block = Block.objects.get(row = row, col_id =col_id)
	#content_obj = Content.objects.filter(block=block, sub_row_id=sub_row_id).first() #equivalent to get or None, at this case when only one object can match the conditions
	if "content_id" in request.POST:
		print("entered the haveing content id")
		view_data = {}
		content_obj = Content.objects.get(id=request.POST["content_id"])
		if action == "relateToBlock":
			new_sub_row_id = block.highestSubRow()+1
			content_obj.sub_row_id = new_sub_row_id
			content_obj.content_object = block
			content_obj.save()
			view_data["sub_row_id"] = content_obj.sub_row_id #for template usage
			view_data["block_width"] = block.width
			"""Note: building the requierd url at the view was necessary, because we wouldn't be
			able to use template tags with the ajax returned variables, because template tags
			are server side and will be evaluated before the ajax will be activate."""
			edit_url = reverse('miniwebs:content_obj_properties', kwargs={'website_id' : website.id, 'page_id' : page.id,
			 'row_id' : row_id, 'col_id' : col_id, 'sub_row_id' : new_sub_row_id})
			view_data["content_edit_url"] = edit_url
			print("view data which will sent",view_data)
			return JsonResponse(view_data)
		if action == "relateToPage":
			content_obj.sub_row_id = -1
			content_obj.content_object = page
			content_obj.save()
	elif "sub_row_id" in request.POST:
		print("entered the NOT haveing content id")
		#might change the row below to use 'get' instead of 'filter'?
		#sub_row_id = block_id[block_id.find(" sub_row")+8:]
		sub_row_id = request.POST["sub_row_id"]
		content_obj = Content.objects.filter(blocks=block, sub_row_id=sub_row_id).first() #equivalent to get or None, at this case when only one object can match the conditions
		if (action == "delete"): #very temp structure # maybe possible to somehow do content_obj.action for all case with building some methods
			content_obj.delete()
		if (action == "moveContentDown"):
			next_content = Content.objects.filter(blocks=block, sub_row_id__gt=sub_row_id).order_by('sub_row_id').first()
			switchSubRowId(content_obj, next_content)
		if (action == "moveContentUp"):
			prev_content = Content.objects.filter(blocks=block, sub_row_id__lt=sub_row_id).order_by('sub_row_id').last()
			switchSubRowId(prev_content, content_obj)
	else:
		if action == "deleteallcontents":
			print("enter the delete all contents")
			Content.objects.filter(blocks__row__page=page).delete()
	return JsonResponse({})


def switchSubRowId(first_content, next_content): 
	"""Switching content's sub_row_id value, to change the order the content being represented
	inside a block"""
	curren_id = first_content.sub_row_id
	first_content.sub_row_id = next_content.sub_row_id
	next_content.sub_row_id = curren_id
	first_content.save()
	next_content.save()
