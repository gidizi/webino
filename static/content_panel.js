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