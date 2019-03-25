from django import template
from miniwebs.models import Website, Page, Row, Block, Content, TextContent, ImageContent
from django.db.models import Q, F


register = template.Library()


@register.filter
def AvailableParents(curr_page, website):
    """ This function will return the pages which are relevant to be used as a parent page for certain page.
    the function makes assure not to produce any relationship which is deeper then 2 levels
    of descendants (son, grandson) to a certain page.
    logic: return from website pages, if website's page's level + curr_page level <=2.
    excludin curr_page itslef
    website paramater is required when creating a new page (page=None)"""
   
    if curr_page == None:
        return website.page_set.filter(Q(relates_to__id=F('id')) | Q(relates_to__relates_to__id=F('relates_to__id')))
        #for page creating, return top level, and second level pages
    #print ("the page set", curr_page.page_set.all())
    if curr_page.page_set.exclude(relates_to__id=F('id')): #checks if sons exists (not including self as son)
        for parent in curr_page.page_set.exclude(relates_to__id=F('id')):
            if parent.page_set.exclude(relates_to__id=F('id')): #checjs if grandsons exists (not including self as son)
                #print ("the secondary set", parent.page_set.all())
                #print ("its a grand", curr_page)
                return [] #return an empty iterable
        #print ("its a father", website.page_set.filter(relates_to__id=F('id')))
        return website.page_set.filter(relates_to__id=F('id')).exclude(id=curr_page.id) #return only top level pages
    else:
        #print ("not a parent", website.page_set.filter(Q(relates_to__id=F('id')) | Q(relates_to__relates_to__id=F('relates_to__id'))))
        return website.page_set.filter(Q(relates_to__id=F('id')) | Q(relates_to__relates_to__id=F('relates_to__id'))).exclude(id=curr_page.id)
        #returns top levels, and second level pages


@register.filter
def DepthLevel(curr_page):
    """ returns the depth (descendants level) of the relationship"""
    
    #front_str = "Depth of relationship: "
    front_str = "Number of sub pages generations: "
    if curr_page == None:
        return ""
    if curr_page.page_set.exclude(relates_to__id=F('id')): 
        for parent in curr_page.page_set.exclude(relates_to__id=F('id')):
            if parent.page_set.exclude(relates_to__id=F('id')): 
                return front_str+str(2)
        return front_str+str(1) 
    else:
        return front_str+str(0)



@register.filter
def PageIdOrAltStr(curr_page): #i think this will be only temporary and maybe send the value from the get view
    """ if page exists, returns its page_id, otherwise return string 'current' """
    
    if curr_page == None:
        return "current"
    else:
        return curr_page.id

@register.filter
def definePageLinkClass(url, cont_type):
    if (url == None) or (url =="") or (url =="#"): #temporary taking care of some previously default URL value
        if cont_type=="img":
            return "unLinkedImage"
        elif cont_type=="text":
            return "unLiknedText"
    else:
        return ""


@register.filter
def disableBrowserImageDemandInCaseImageExists(content_obj):
    print ("entered the filter")
    if hasattr(content_obj, 'imagecontent'):
        if content_obj.imagecontent.image.url != "":
            return "novalidate"
    return ""


 