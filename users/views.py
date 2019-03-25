from django.shortcuts import render, redirect
from django.contrib import messages
from miniwebs.models import Website, Page, Row, Block, Content, TextContent, ImageContent
from django.contrib.auth.models import User
from .forms import UserRegisterForm
from django.contrib.auth import authenticate, login


def register(request): 
	if request.method == 'POST':
		form = UserRegisterForm(request.POST)
		if form.is_valid():
			form.save()
			username = form.cleaned_data.get('username')
			password = form.cleaned_data.get('password1')
			user_obj = User.objects.get(username=username)
			example_web1 = Website.objects.get(web_url='tnet')
			websiteDeepCopy(user_obj, example_web1) #Auto creating website, for project demonstration
			user = authenticate(username=username, password=password)
			login(request, user)
			messages.success(request, 'Thank you for registering. You are now logged in.')
			return redirect('main_route')
	else:
		form = UserRegisterForm()
	return render(request, 'users/register.html', {'form' : form})


def websiteDeepCopy(user_object, website):	
	old_pages = website.page_set.all()
	print("old_pages",old_pages)

	website.pk = None #this is how the documentation instruct to copy model objects
	website.user = user_object
	website.web_url = website.web_url+"_"+str(user_object.id) #to create a unique, editable website
	website.business_name = website.business_name
	website.save()

	for page in old_pages:
		print("page in loop", page)
		if page.relates_to==page: #gets main pages and recreates them
			old_son_pages = page.page_set.exclude(page=page.relates_to) #gets the son pages, excluding private case when the "son" page we get is acctualy the main page itself who was self attached as a main page indication.
			print("old son pages", old_son_pages)
			pageDeepCopy(website, page, page)
			
			for son_page in old_son_pages: #now we can attach them to the recreated parents
				old_grandson_pages = son_page.page_set.all()
				pageDeepCopy(website, son_page, page)

				for grandson in old_grandson_pages:
					pageDeepCopy(website, grandson, son_page)

def pageDeepCopy(website, page, page_relates_to):
	old_rows = page.row_set.all()
	old_page_contents = Content.objects.filter(pages=page)

	page.pk = None
	page.website = website
	page.save()

	page.relates_to = page_relates_to #can relate the new page to itslef, only after the new page was saved
	page.save()
	
	for page_content in old_page_contents:
		contentDeepCopy(website, page_content, page)
	

	for row in old_rows:
		old_blocks = row.block_set.all()
		row.pk = None
		row.page = page
		row.save()

		for block in old_blocks:
			old_contents = Content.objects.filter(blocks=block)
			block.pk = None
			block.row = row
			block.save()


			for content in old_contents:
				contentDeepCopy(website, content, block, page)
				"""
				old_acctualcontent = None
				if hasattr(content, 'textcontent'):
					old_acctualcontent = content.textcontent
				elif hasattr(content, 'imagecontent'):
					old_acctualcontent = content.imagecontent			

				content.pk = None
				content.content_object = block
				content.save()

				if old_acctualcontent is not None:
					old_acctualcontent.pk = None
					old_acctualcontent.content = content
					old_acctualcontent.save()"""

def contentDeepCopy(website, content, block_or_page_relates_to, page=None): #drop page arg after fixing the url page implementation
	old_acctualcontent = None
	if hasattr(content, 'textcontent'):
		old_acctualcontent = content.textcontent
	elif hasattr(content, 'imagecontent'):
		old_acctualcontent = content.imagecontent			

	content.pk = None
	content.content_object = block_or_page_relates_to
	if content.url_link:
		previous_web_url = website.web_url[:website.web_url.rfind('_'+str(website.user.id))]
		if previous_web_url in content.url_link:
			new_url_link = content.url_link.replace(previous_web_url, website.web_url) #later can leave it outside the nearestif, because exp not in link, nothing will happend
			if page == website.page_set.last(): #very TEMPORARY IMPLEMENTATION works only for the private case,
		#soon the url will contatin the page name itself instead of an id and it wont be needed any update!
				new_page_url =  website.page_set.first().id
			if page == website.page_set.first(): #very TEMPORARY IMPLEMENTATION works only for the private case,
		#soon the url will contatin the page name itself instead of an id and it wont be needed any update!
				new_page_url = page.id+1
			content.url_link = new_url_link[:new_url_link[:-1].rfind('/')+1]+str(new_page_url)+'/' #very TEMPORARY IMPLEMENTATION
	content.save()
		

	if old_acctualcontent is not None:
		old_acctualcontent.pk = None
		old_acctualcontent.content = content
		old_acctualcontent.save()




"""
def copyWebDbToDb(request):
	website = Website.objects.get(web_url='Tnet')
	old_pages = website.page_set.all()
	for page in old_pages:
		print("current page",page)
		old_rows = page.row_set.all()

		row_list = []
		for row in old_rows:
			old_blocks = row.block_set.all()

			block_list = []
			for block in old_blocks:
				old_contents = Content.objects.filter(blocks=block)

				content_list = []
				for content in old_contents:
					old_acctualcontent = None
					typee = None
					if hasattr(content, 'textcontent'):
						old_acctualcontent = content.textcontent
						typee = 'textcontent'
					elif hasattr(content, 'imagecontent'):
						old_acctualcontent = content.imagecontent
						typee = 'imagecontent'
					print("type(old_acctualcontent)", type(old_acctualcontent)==TextContent)			

					if old_acctualcontent is not None:
						old_acctualcontent.pk = None
						old_acctualcontent.content = None
						old_acctualcontent.save(using='postgre')

					content.pk = None
					content.content_object = None
					content.save(using='postgre')
					content_list.append(content)


					if old_acctualcontent is not None:
						print("the content object i want to attach: ",content)
						old_acctualcontent.content = content
						old_acctualcontent.save(using='postgre')

				block.pk = None
				block.row = None
				block.save(using='postgre')
				block_list.append(block)

				for content1 in content_list:
					content1.content_object=block
					content1.save()


			row.pk = None
			row.page = None
			row.save(using='postgre')
			row_list.append(row)

			for block1 in block_list:
				block1.row=row
				block1.save()

		page.pk = None
		page.website = None
		page.relates_to = None
		page.save(using='postgre')

		for row1 in block_list:
			row1.page=page
			row1.save()

		#page.relates_to = page #just the simple case for main pages
		#page.save()
				
	print("old pages",old_pages)

	website.pk = None #this is how the documentation instruct to copy model objects
	website.user = None
	website.web_url = website.web_url+"_" #to create a unique, editable website
	website.business_name = website.business_name
	website.save(using='postgre')
	print("continuing after the web save")
	print("old pages",old_pages)
	
	return redirect('main_route')

"""