var last_tuto_stage = 4
var tuto_stage
var current_tuto_marked_elem


function tutorial_stage(){
	tutorial_box = $("#tutorial");
	var message;
	if (tuto_stage == 0){
		message = "Have you seen how the Content relocated at the Dropped in container? Now Please Click the Up or Down Arrows for a block with more then one piece of content inside"
		tuto_update($(".contentBox"), message, $(".moveContentUp, .moveContentDown"))
		console.log("enter tuto stage 0")
		return
	}
	if (tuto_stage == 1){
		message = "Nice! Please Click and Drag one of the Contents, and Drop It in a the Page's UnDisplayed Contents Area"
		tuto_update($(".moveContentUp, .moveContentDown"), message, $("#unAttachedConts"))
		return
	}
	if (tuto_stage == 2){
		message = "Notice that you can drop Undisplayed contents back in a container anytime (you can try it right now). Now Click on Content's Delete Button to delete a Content, then click Yes for the message displayed"
		tuto_update($("#unAttachedConts"), message, $(".delContentButt"))
		$("#unAttachedConts").css("border", "solid DodgerBlue")
		return
	}
	if (tuto_stage == 3){
		message = "Click The Preview Button to see a Preview of this page"
		tuto_update($(".delContentButt"), message, $("#preview"))
		return
	}
	if (tuto_stage == last_tuto_stage){
		message = "Congratulations! You have reached the end of the tutorial. You can now Edit / Delete (notice the 'Delete All Contents' button at the top of this box) the auto contents and start Adding New ones. You can combine Text and Images to match your needs. You are able to click the Preview button anytime to see your results. WhenEver You feels like the page is Ready, click the Finish Button below. Do Not Worry, you will be able to edit the page anytime."
		tuto_update($("#preview"), message )
		$("#deleteAutoContents").show()
		return
	}

}

function allowDrop(ev) {
  ev.preventDefault();
}

function drag(ev) {
  ev.dataTransfer.setData("text", ev.target.id);
  console.log("entered data from transfer")
}

function dropInBlock(ev, elem) { //seperate later and can call dropInBlock. and other dropInPage
  dropInUserSide(ev, elem)
  titlesOrContents(elem, 'contents')
  elem.appendChild(elem.querySelector(".addContentLink")) //push to be the last child
  contentActions("relateToBlock", fitAttrForBlock, $(contentElem), $(contentElem).attr("id"))
  if (tuto_stage == 0){
  	tutorial_stage();
  }
}

function dropInPage(ev, elem) {
  dropInUserSide(ev, elem)
  titlesOrContents(elem, 'titles')
  contentActions("relateToPage", fitAttrForPage, $(contentElem), $(contentElem).attr("id"))
  if (tuto_stage == 2){
  	tutorial_stage();
  }
}

function dropInUserSide(ev, elem){
	ev.preventDefault();
	var data = ev.dataTransfer.getData("text");
	contentElem = document.getElementById(data)
	elem.appendChild(contentElem);
}

function titlesOrContents(elem, parttoshow){
	var conTitleBox = $(contentElem).children(".contentTitle") 
	var actualCont = $(contentElem).children(".acctualContent") 
	if (parttoshow=='titles'){
		console.log("entered the titles area")
		actualCont.hide()
		conTitleBox.show()
		$(contentElem).children(".contentsButtons").hide()
	}
	else if(parttoshow=='contents') {
		console.log("entered the contents area")
		actualCont.show()
		conTitleBox.hide()
		$(contentElem).children(".contentsButtons").show()
	}
}


function fitAttrForBlock(contBox, response){
	console.log("sub row id", response.sub_row_id)
	contBox.attr("value", response.sub_row_id)
	/*Note: building the requierd url at the view was necessary, because we wouldn't be
	able to use template tags with the ajax returned variables, because template tags
	are server side and will be evaluated before the ajax will be activate.*/
	$(contBox).find(".editContLink").attr("href", response.content_edit_url)
	if ($(contBox).find(".contentImage")){
		$(contBox).find(".contentImage").attr("width", response.block_width*80)
	}
}

function fitAttrForPage(contBox){
	contBox.attr("value", "") //Because there is no sub_row_id
	$(contBox).find(".editContLink").attr("href","")
}

$(document).ready(function(){
	$("#preview").on('click', function(){
		if (tuto_stage == 4){
			tutorial_stage();
		}
	})
})

function tuto_update(previous_marked_elem, new_text, new_marking_elem)
{
	previous_marked_elem.css("border", "")
	if (new_marking_elem) {
		new_marking_elem.css("border", "3px solid red")
	}
	tutorial_box.text(new_text)
	tuto_stage++
	current_tuto_marked_elem = new_marking_elem //documenting for usage in other functions
}

$(document).ready(function(){
	$("#skipToturial").on('click', function(){
		disActivateTutorial()
		current_tuto_marked_elem.css("border", "") //disactivation visual instructions
		if (current_tuto_marked_elem == $("#unAttachedConts")){ //private case for default background
			$("#unAttachedConts").css("border", "solid DodgerBlue")
		}
	});
});

function disActivateTutorial(){
	$("#skipToturial").hide()
	$("#tutorial").hide()
	$("#tutorial").text("")
	$("#activateTutorial").show()
	$("#deleteAutoContents").show()
	tuto_stage = -1
}

$(document).ready(function(){
	$("#activateTutorial").on('click', function(){
		initializeTutorial()
	});
});

function initializeTutorial(){
	$("#activateTutorial").hide()
	$("#skipToturial").show()
	$("#tutorial").show()
	$("#deleteAutoContents").hide()
	tuto_stage = 0
	$(".mainDiv .contentBox").css("border", "3px solid red")
	current_tuto_marked_elem = $(".mainDiv .contentBox")
	$("#tutorial").append("<p>Welcome to the page\'s Content Management panel</p>				<p>With this Tool, You will be able to Manage and Insert Content into the Structure You Have designed at the previous stage</p>				<p>To begin, Please Click and Drag one of the Contents (marked with red frame), and Drop It in a Different Block</p><p>Notice that dragging an image to a different sized container will automatically change the image\'s dimensions to fit it's new container</p>")

}


$(document).ready(function(){
	$(".editContent, .addContent").on('click', function(ev){
		console.log("tuto_stage ",tuto_stage)
		if (!((tuto_stage == -1) || (tuto_stage == last_tuto_stage+1))){
			ev.preventDefault();
			alert("Please Finish the tutorial OR Click the 'Skip Tutorial' Button before pressing the Add Content / Edit Content buttons.")
		}
	})
})

$(document).ready(function(){
	$("#deleteAutoContents").on('click', function(){
		if(confirm("This Action will Delete the entire page contents Permanently, are you sure you want to make this action?")){
			contentActions("deleteallcontents", deleteAllContents)
			alert("Note that you can recreate example content by creating a New Page. you can also restore an example website (i.e traveling blog) by creating a New User")
		} else {
			return false
		}
	})
})

function deleteAllContents(){
	$(".contentBox").each(function(){
		$(this).remove()
	})
} 



$(document).ready(function(){
	$(".delContentButt").on('click', function(){
		if(confirm("It will not be possible to restore deleted content. Are you sure you want to make this action? Note: to hide the content, and still maintain it for a future use, please press cancel, and then drag the content to the page's unattached content area")){
			contentActions("delete", deleteCon, $(this).parent().parent())
		}
	})
})

function deleteCon(contBox){
	contBox.remove();
	if (tuto_stage == 3){
		tutorial_stage();
	}
}

$(document).ready(function(){
	$(".moveContentDown").on('click', function(){
		if (!$(this).parent().parent().parent().find(".contentBox").last().is($(this).parent().parent())){
			contentActions("moveContentDown", moveDown, $(this).parent().parent())
		}
	})
})

function moveDown(contBox){
	switchElemId(contBox, contBox.next())
	switchContainerContentEditUrl(contBox, contBox.next())
	contBox.insertAfter(contBox.next())
	//temp: if i would like to reload the content boxes i think i would pass the content objects from the view (cause its difficult to get the django block object at the js) but it still makes a problem in case i would like to send types of contents like forms and pics
}

$(document).ready(function(){
	$(".moveContentUp").on('click', function(){
		if (!$(this).parent().parent().parent().find(".contentBox").first().is($(this).parent().parent())){
			contentActions("moveContentUp", moveUp, $(this).parent().parent())
		}
	})
})

function moveUp(contBox){
	switchElemId(contBox.prev(), contBox)
	switchContainerContentEditUrl(contBox.prev(), contBox)
	contBox.insertBefore(contBox.prev())
}

function switchElemId(firstElem, nextEleme){
	var firstVal=firstElem.attr('value')
	firstElem.attr('value',nextEleme.attr('value'))
	nextEleme.attr('value', firstVal)
	if (tuto_stage == 1){
		tutorial_stage();
	}
}

function switchContainerContentEditUrl(firstElem, nextEleme){
	var firstConentEditUrl=firstElem.find(".editContLink")
	var nextContentEditUrl=nextEleme.find(".editContLink")
	var firstVal=firstConentEditUrl.attr("href")
	firstConentEditUrl.attr("href", nextContentEditUrl.attr("href"))
	nextContentEditUrl.attr("href", firstVal)
}

/*	function createBoxContents(rowId, colId, subRowId) {
		var boxContent = """{{ content.content|linebreaksbr }}								<form action="should be container content here, fix it if this function is needed" method="post">									{% csrf_token %}									<button type="submit" class="glyphicon glyphicon-edit editContent {{content.sub_row_id}}" name="cell_num_edit" value="row {{row.row_id}} col {{block.col_id}} sub_row {{content.sub_row_id}}" title="Update Content"></button>								</form>									<button type="button" class="glyphicon glyphicon-arrow-up moveContentUp {{content.sub_row_id}}"  title="Click to Slide the current Content cell Up" id="moveContentUp{{content.sub_row_id}}"></button>									<button class="glyphicon glyphicon-arrow-down moveContentDown {{content.sub_row_id}}" type="button" title="Click to Slide the current Content cell Down" id="moveContentDown{{content.sub_row_id}}"></button>									<button type="button" class="glyphicon glyphicon-remove delContentButt {{content.sub_row_id}}" id="delContentButt{{content.sub_row_id}}" name="cell_num_delete" value="row {{row.row_id}} col {{block.col_id}} sub_row {{content.sub_row_id}}" title="click to Delete the Content"></button><br>"""
		$("#creationPanel").append(mainRow);
	} */

	/*	$(document).ready(function(){
			console.log("yes, its inside")
			{% for row in page.row_set.all %}
				console.log("inside the row loop") 
				var rowId="{{ row.row_id|escapejs }}"
				$(".container-fluid").append("<div class='row' id='pagerow"+rowId+"'></div>");
				{% for block in row.block_set.all %}
					blockId = "{{block.col_id}}"
					contDiv='<div style="border-style: solid; border-color: DodgerBlue;" class="col-md-{{ block.width }} offset-md-{{ block.distance }} examples" id=contentCont'+blockId+'>'
					$("#pagerow"+rowId).append(contDiv)
					createContent(rowId, blockId)
					//add here the rest of the struc
				{% endfor %}
			{% endfor %}
		})

		function createContent(block, rowId, blockId){ //maybe dont need to pass block and can get from block id
			//im having a problem now how to pass the block DB object as a javascript arg, and how
			//will i later pass it at the up and down arrows
			{% for content in block.content_set.all %}
				contentBox="""<div class="contentBox" id="contentBoxrow{{row.row_id}}col{{block.col_id}}sub_row {{content.sub_row_id}}">						{{ content.content|linebreaksbr }}						<form action="{% url 'miniwebs:content_obj_properties' website.id page.id %}" method="post">							{% csrf_token %}							<button type="submit" class="glyphicon glyphicon-edit editContent {{content.sub_row_id}}" name="cell_num_edit" value="row {{row.row_id}} col {{block.col_id}} sub_row {{content.sub_row_id}}" title="Update Content"></button>						</form>							<button type="button" class="glyphicon glyphicon-arrow-up moveContentUp {{content.sub_row_id}}"  title="Click to Slide the current Content cell Up" id="moveContentUp{{content.sub_row_id}}"></button>							<button class="glyphicon glyphicon-arrow-down moveContentDown {{content.sub_row_id}}" type="button" title="Click to Slide the current Content cell Down" id="moveContentDown{{content.sub_row_id}}"></button>							<button type="button" class="glyphicon glyphicon-remove delContentButt {{content.sub_row_id}}" id="delContentButt{{content.sub_row_id}}" name="cell_num_delete" value="row {{row.row_id}} col {{block.col_id}} sub_row {{content.sub_row_id}}" title="click to Delete the Content"></button><br>					</div>"""
				parentCont = $("#pagerow"+rowid).find("#contentCont"+blockId+)
				parentCont.append(contentBox)
			{% endfor %}
			
		} */