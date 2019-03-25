		/* somthing i might want to fix
		notice in many functions i make some actions after doc ready
		it seems wrong cause i think its running without relation to buttuon press
		try to get in after the on click or change or somthing */

		var tuto_stage
		var current_tuto_marked_elem

		var nextRowId = 0 //because of the users ability to change the order of the rows, the last row id, will not necessarily be the id of the last row at the html stracture (which will be given back by simple JS). instead of looping through the elements ids and look for the hightest index, i decided to create a variable for row id counter. 
		
		//can consider later just to update the id's every row switch or delete, and then can just get the next id from counting rows and adding 1


		//adds new row to the page
		$(document).ready(function(){
			$(".addRow").on('click', function(){
				if (nextRowId==0){
					$("#preview").show()
					$("#submit").show()
				}
				createMainRow(Number(nextRowId))
				if ((tuto_stage == 1) || (tuto_stage == 3)){
					tutorial_stage();
				}
//				$("#creationPanel").append(createMainRow(Number(nextRowId)));
//				nextRowId += 1 
			});
		});

		//adds new container to an existing row
		$(document).ready(function(){
			var contChild = 'div div div div .addContainer' //cannot refer direclty to the .addContainer because this element was created dynamically by JS
			$("#creationPanel").on('click', contChild, function(){
				rowId = $(this).attr("id").charAt($(this).attr("id").length-1)
				if ($("#pageRow"+rowId).children().length!=0){ //find colId
					var prevCont = $("#pageRow"+rowId).children().last()
					newColId = Number($(prevCont).attr("id").charAt($(prevCont).attr("id").length-1))+1
				} else {
					newColId = 0
				}
				createContainer(rowId, newColId, 2, 0)
				if (tuto_stage == 2){
					tutorial_stage();
				}
				if ((tuto_stage == 4) && ($("#creationPanel").find(".propCont").length >=4)){
					tutorial_stage();
				}
//				$("#pageRow"+rowId).append(createContainer(Number(newColId)));
//				hideShowButt(rowId) 
			});
		});

		//Slide a row to the top of the row above it
		$(document).ready(function(){
			var buttChild = 'div div div div .moveRowUp' //cannot refer direclty to the .moveRowUp because this element was created dynamically by JS
			$("#creationPanel").on('click', buttChild, function(){
				//rowDiv = $(this).parent().parent().parent().parent()
				rowDiv = $(this).parents(':eq(3)')
				if (!$(".mainrow").first().is(rowDiv)){
					console.log("aint first!!!")
//					updateConsNames(rowDiv); 
					rowDiv.insertBefore(rowDiv.prev())
				}
			});
		});

		//Slide a row to the buttom of the row below it
		$(document).ready(function(){
			var buttChild = 'div div div div .moveRowDown' //cannot refer direclty to the .moveRowDown because this element was created dynamically by JS
			$("#creationPanel").on('click', buttChild, function(){
				//rowDiv = $(this).parent().parent().parent().parent()
				rowDiv = $(this).parents(':eq(3)')
				if (!$(".mainrow").last().is(rowDiv)){
					console.log("aint lasr!!!")
//					updateConsNames(rowDiv.next()); 
					rowDiv.insertAfter(rowDiv.next())
				}
			});
		});

		//updating container's width
		$(document).ready(function(){
			var prevWidth;
			var widthChild = 'div div div div div .width' //cannot refer direclty to the .width because this element was created dynamically by JS
			$("#creationPanel").on('focus', widthChild, function(){ 
				prevWidth = $(this).val();
			}).on('change', widthChild, function(){
				var width = $(this).val();
				changeProp(prevWidth, width, 'width', $(this))
				prevWidth = width //requierd in case that the field doesn't loses focus between value changes
			});
		});

		//updating container's offset
		$(document).ready(function(){
			var prevOffset;
			var offsetChild = 'div div div div div .offset' //cannot refer direclty to the .offset because this element was created dynamically by JS
			$("#creationPanel").on('focus', offsetChild, function(){
				prevOffset = $(this).val();
			}).on('change', offsetChild, function(){
				var offset = $(this).val()
				changeProp(prevOffset, offset, 'offset', $(this))
				prevOffset = offset //requierd in case that the field doesn't loses focus between value changes
			});
		});

		// delete a container
		$(document).ready(function(){
			var widthChild = 'div div div div div .deleteContainer' //cannot refer direclty to the .deleteContainer because this element was created dynamically by JS
			$("#creationPanel").on('click', widthChild, function(){
			//	if ($(this).parent().siblings().length >=1){
				rowIdField = $(this).parents(':eq(2)').attr('id')
				rowId = rowIdField.charAt( rowIdField.length-1)
				if ($(this).parent().parent().find('.contentIndication').length){ //if contentIndication class obj exist, it means that the current block linked to content
					if(confirm("Deleting this block will break the relation between the block to its content. Are you sure you want to delete this block?")){
						$(this).parent().parent().remove()
						alert("Note: Structure changes will be saved only when clicking the Save button. refreshing the page will restore the current saved structure");
					}
				} else {
					$(this).parent().parent().remove()
					
				}
				hideShowButt(rowId)	
			//}
			// else {
			//		alert("It is not possible to have an empty row, please delete the entire row or change the properties of this container accoring to your needs")
			//	}			
			});	
		});

		// delete a row, including its containers
		$(document).ready(function(){
			var rowChild = 'div div div div .deleteRow' //cannot refer direclty to the .deleteRow because this element was created dynamically by JS
			$("#creationPanel").on('click', rowChild, function(){
				//if ($(this).parent().parent().parent().parent().find('.contentIndication').length){ //if contentIndication class obj exist, it means that the current block linked to content
				if ($(this).parents(':eq(3)').find('.contentIndication').length){ //if contentIndication class obj exist, it means that the current block linked to content	
					if(confirm("Clicking on this button will Delete the Entire Row, delete its Blocks, and break the relation between the row's blocks to their content, Are you sure you want to make this action?")){
						//$(this).parent().parent().parent().parent().remove()
						$(this).parents(':eq(3)').remove()
						alert("Note: Structure changes will be saved only when clicking the Save button. refreshing the page will restore the current saved structure");
					}
					return
				}
				if (confirm("Clicking on this button will Delete the Entire Row and its Blocks, Are you sure you want to make this action?")) {			
					//$(this).parent().parent().parent().parent().remove()
					$(this).parents(':eq(3)').remove()
				}			
			})
		})


		//show/update the exmaple content type
		$(document).ready(function(){
			var conTypeChild = 'div div div div div .selectType' //cannot refer direclty to the .selectType because this element was created dynamically by JS
			$("#creationPanel").on('change', conTypeChild, function(){
				//contWidth = $(this).parent().parent().children().children(".width").val()
				contWidth = $(this).parents(':eq(1)').find(".width").val()
				typeChoice = $(this).val()
				//contentDiv = $(this).parent().parent().children(".exampleContent")
				contentDiv = $(this).parents(':eq(1)').children(".exampleContent")
				contentDiv.html("");
				contentDiv.append(ContentGenrator(typeChoice, contWidth))
				if ($(this).val()){
					$(this).parent().parent().attr("style","")
					if (tuto_stage == 8){
						tutorial_stage();
					}
				} else {
					$(this).parent().parent().attr("style","border:2px solid DodgerBlue;")
				}
			})
		})

		$(document).ready(function(){
			$("#stractureForm").submit(function(){
				//gives rowId and colId to each form fields which will be sent to the server.
				//due to ability to switch between rows, the id field of a row will not necesseraly indicate its place on the page, and because of the ability to delete lines, the indexes will not necesseraly be adjacent. moreover, the POST request is being passed to the server side as a dictionary, which is an unordered object and cannot represent the structure and order of the lines
				if ($("#creationPanel").find(".propCont").length <= 3){
					alert("Please Create at least 4 Containers before proceeding to the next stage")
					return false
				}
				var rowId = 0
				var newIndexes
				$(".pageRow").each(function(){
					var colId = 0
					$(this).children(".propCont").each(function(){
						newIndexes = rowId+";"+colId
						$(this).find('.width').attr("name", "width "+newIndexes)
						$(this).find('.offset').attr("name", "offset "+newIndexes)
						$(this).find('.attachedContentId').attr("name", "attachedContentId "+newIndexes)
						colId += 1
					})
					if ($(this).children(".propCont").length != 0){
					//increase the rowId only if the current line contained any containers
						rowId +=1
					}	
				})
			})
		})
			

		//example content creator for page preview
		function ContentGenrator(conType, width){
			if (conType == "text"){
				text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Magna eget est lorem ipsum dolor sit amet consectetur adipiscing. Nisl condimentum id venenatis a condimentum vitae. Morbi quis commodo odio aenean. Urna et pharetra pharetra massa massa ultricies mi quis. Nec ullamcorper sit amet risus nullam eget felis eget nunc. Pharetra et ultrices neque ornare aenean euismod elementum nisi quis. Quis hendrerit dolor magna eget est lorem ipsum dolor sit. Rhoncus est pellentesque elit ullamcorper. A lacus vestibulum sed arcu non odio euismod lacinia at. Odio morbi quis commodo odio aenean. Mattis enim ut tellus elementum. Massa tempor nec feugiat nisl pretium fusce id. Quam lacus suspendisse faucibus interdum posuere lorem ipsum. Sit amet mattis vulputate enim nulla aliquet porttitor. Tempor commodo ullamcorper a lacus vestibulum sed arcu. Dui id ornare arcu odio ut sem. Ut morbi tincidunt augue interdum velit. Egestas congue quisque egestas diam in arcu cursus. Amet nisl suscipit adipiscing bibendum est ultricies integer quis auctor. Imperdiet proin fermentum leo vel orci porta. Sed turpis tincidunt id aliquet risus. Urna duis convallis convallis tellus id interdum. Ut tristique et egestas quis ipsum. Feugiat sed lectus vestibulum mattis ullamcorper velit. Scelerisque varius morbi enim nunc. Pellentesque dignissim enim sit amet venenatis urna. Gravida neque convallis a cras semper auctor neque vitae. A lacus vestibulum sed arcu. In est ante in nibh mauris cursus mattis molestie. Varius duis at consectetur lorem donec massa sapien faucibus. Adipiscing vitae proin sagittis nisl rhoncus mattis rhoncus. Dignissim diam quis enim lobortis scelerisque fermentum. Iaculis urna id volutpat lacus. Adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla. Nec feugiat in fermentum posuere urna. Mauris commodo quis imperdiet massa tincidunt nunc. Scelerisque eleifend donec pretium vulputate sapien. A erat nam at lectus urna. Rhoncus dolor purus non enim praesent elementum facilisis. Id velit ut tortor pretium viverra suspendisse potenti. Duis tristique sollicitudin nibh sit amet commodo nulla facilisi. Velit sed ullamcorper morbi tincidunt ornare massa eget egestas purus. Mattis rhoncus urna neque viverra justo nec. Diam volutpat commodo sed egestas egestas fringilla phasellus faucibus. Nec ullamcorper sit amet risus nullam. Nunc faucibus a pellentesque sit amet porttitor eget. Lectus vestibulum mattis ullamcorper velit. Viverra aliquet eget sit amet tellus cras adipiscing enim. Ornare arcu odio ut sem nulla pharetra diam sit. In massa tempor nec feugiat. Adipiscing elit pellentesque habitant morbi tristique senectus et netus. Nam at lectus urna duis convallis convallis tellus id interdum. Ut morbi tincidunt augue interdum. Tellus in hac habitasse platea dictumst vestibulum rhoncus est. Ut diam quam nulla porttitor massa id neque. Cras semper auctor neque vitae tempus quam. Aenean et tortor at risus viverra. Magna ac placerat vestibulum lectus mauris. Elit eget gravida cum sociis natoque penatibus et."
			    return text.slice(0,145*width)
			}

			if (conType == "image"){
			    wid = String(width*90)
			    return "<img src='https://via.placeholder.com/"+wid+"x300?text=Image area' alt='Place Holder'>"
			}

			if (conType == "form"){
			    return "soon enough"
			}
		};


		function createMainRow(rowId) { //just added space after the end of pageRow class, might make some probs
			var mainRow = '<div class="row mainrow '+rowId+'" id="mainrow'+rowId+'"> <div class="col-md-11 structureArea"><div class="row pageRow '+rowId+'" id="pageRow'+rowId+'"></div></div>  <div class="col-md-1 buttsArea">				    	<div class="row">  	   <div class="col-md-12">	<br><br>			    	   		<button class="glyphicon glyphicon-arrow-up moveRowUp '+rowId+'" type="button" title="Click to Slide the current row Up" id="moveRowUp'+rowId+'" style="width:80px; height:30px"></button><br><button class="glyphicon glyphicon-plus addContainer '+rowId+'" type="button" title="Click to Add Blocks to the current row" id="contButt'+rowId+'" style="width:80px; height:30px"></button><br>			    	   		<button class="glyphicon glyphicon-remove deleteRow '+rowId+'" type="button" title="click to Delete the line" id="delRowButt'+rowId+'" style="width:80px; height:30px"></button><br><button class="glyphicon glyphicon-arrow-down moveRowDown '+rowId+'" type="button" title="Click to Slide the current row Down" id="moveRowDown'+rowId+'" style="width:80px; height:30px"></button></div></div></div></div>';
			$("#creationPanel").append(mainRow);
			nextRowId += 1 
		}
				

		function changeProp(prevVal, newVal, type, changedElem){
			// I prefered passing $this instead of using event.currentTarget, cause then i would have to pass the elemId of the child eith
			//rowIdField = changedElem.parent().parent().parent().attr('id')
			rowIdField = changedElem.parents(':eq(2)').attr('id')
			rowId = rowIdField.charAt( rowIdField.length-1)
			var valAftChan = lineLength(rowId)-Number(prevVal)+Number(newVal);
			if (valAftChan <= 12){ //going to change index soon				
				changedElem.parent().parent().attr("class", function(i, origValue){
					var n = origValue.indexOf("offset");
					if (type=='width'){
						var sub = origValue.substring(n);
						if (tuto_stage == 5){
							tutorial_stage();
						}
						return "col-md-"+newVal+" "+sub;
					}
					if (type=='offset'){
						var sub = origValue.substring(0,n);
						if (tuto_stage == 6){
							tutorial_stage();
						}
						return sub+"offset-md-"+newVal+" propCont";
					}
				});
				hideShowButt(rowId)
			} else {
				alert("This value cannot be choosen, The combination of the block's width and offset is too wide for the page's structure");
				changedElem.val(prevVal);
			};
		};


		function lineLength(rowId){ //looks like its working well
			var lenCount = 0
			console.log("add to count:")
			$("#pageRow"+rowId).children("div").each(function(){ 
				var contClass = $(this).attr("class")
				var wIndex = contClass.indexOf("col-md-")
				var oIndex = contClass.indexOf("offset-md-")
				lenCount += Number(contClass.substring( wIndex+7, wIndex+9)) + Number(contClass.substring(oIndex+10,oIndex+12)) //adds elem's width and offset
				console.log("width: ",Number(contClass.substring( wIndex+7, wIndex+9)),"offset: ", Number(contClass.substring(oIndex+10,oIndex+12)) )
			});
			return lenCount;
		}


		function hideShowButt(rowId) {	
			contButt = $("#contButt"+rowId)
			if (lineLength(rowId) >= 11){
			  	contButt.attr({
		  	        "disabled" : true,
		  	        "title" : "To add more elements, decrease the width or offset of existing elements at the line"
			  	});
			} else {
			  	contButt.attr({
			  		"disabled" : false,
			  		"title" : "Click to Add Blocks to the current row"
		  		})
			}
		}


		function tutorial_stage(){
			tutorial_box = $("#tutorial");
			var message;
			console.log ('$("#creationPanel div div div div #contButt0")',$("#creationPanel div div div div #contButt0"))
			console.log('$("#creationPanel").find("#contButt0")',$("#creationPanel").find("#contButt0"))
			if (tuto_stage == 0){
				$("#skipBackground").hide()
				//to avoid instruction duplication if elements already exists
				console.log("enter tuto stage 0")
				if ($("#creationPanel").find(".mainrow").length >=1){ //if structure already have rows, skip 2 stages
					console.log("found more then 1 row")
					$("#chooseBackground").css('border-style', 'none none solid solid')
					$("#chooseBackground").css('border-color', 'DodgerBlue') //it needs a special frame which the simple 'tuto_update' function should not make.
					tuto_stage += 2
				} else {
					console.log("didnt found more then 1 row")
					message = "Now Please Click the + (plus) button to Add a Row to the page's template"
					tuto_update($("#chooseBackground"), message, $("#addRow"))
					return
				}
			}

			if (tuto_stage == 1){
				console.log("enter tuto stage 1")
				message = "Click the + (plus) at the right side of the newly created row to Add a Content Container to the row"
				tuto_update($("#addRow"), message, $("#creationPanel").find(".addContainer"))
				return
			}

			if (tuto_stage == 2){
				console.log("enter tuto stage 2")
				message = "Click the Lowest Red Framed + (plus) button again to Add a another Row to the page's template"
				tuto_update($("#creationPanel").find(".addContainer"), message, $("#addRow"))
				return
			}

			if (tuto_stage == 3){
				message = 'Keep adding containers until there will be at least 4 Containers at the different rows'
				tuto_update($("#addRow"), message,$("#creationPanel").find(".addContainer"))
				return
			}

			if (tuto_stage == 4){
				message = 'Great! now Change the "Blocks Width" value to determine the width of the content block'
				tuto_update($("#creationPanel").find(".addContainer"), message,$("#creationPanel").find(".width"))
				return
			}
			if (tuto_stage == 5){
				message = 'Change the "Distance from the left element" value to determine the the block area distance from its left block/border. Notice that you will not be able to choose a width and distance values of blocks, which will be wider then a full row.'
				tuto_update($("#creationPanel").find(".width"), message,$("#creationPanel").find(".offset"))
				return
			}
			if (tuto_stage == 6){
				message = "Click at the 'Page Preview' button to see a simulation of the Page's structure"
				tuto_update($("#creationPanel").find(".offset"), message,$("#preview"))
				return
			}
			if (tuto_stage == 7){
				message = "Choose an ExampleContent Type to Preview the Page's Structure with Content Inside it"
				tuto_update($("#preview"), message,$("#creationPanel").find(".selectType"))
				return
			}
			if (tuto_stage == 8){
				message = 'You can keep filling the containers with and Example Content Image or Text, Whenever you feels like you have got a good demonstration of the page, Click the "Keep Editing" button'
				tuto_update($("#creationPanel").find(".selectType"), message,$("#propsPanel"))
				return
			}
			if (tuto_stage == 9){
				message = 'Please add more containers, and keep Building and Modifing the Page Structure and the Containers Width and Distance. FOR A BETTER PROJECT DISPLAY WE DEEPLY RECOMMAND TO CREATE SEVERAL ROW AND APPLY VARIOUS CONTAINERS WIDTHS AND DISTANCES. When the template is ready, click the Save Structure button. We recommand you to try to use the other functions that you havent used yet such as Uploading Background Images, Switching Between Rows, Deleting Rows, Deleting Containers'
				tuto_update($("#propsPanel").find(".selectType"), message)
				return
			}
		}

		function tuto_update(previous_marked_elem, new_text, new_marking_elem)
		{
			previous_marked_elem.css("border", "")
			if (previous_marked_elem.is($("#chooseBackground"))){ //private case for default background
				$("#chooseBackground").css('border-style', 'none none solid solid')
				$("#chooseBackground").css('border-color', 'DodgerBlue')
			}
			if (new_marking_elem) {
				new_marking_elem.css("border", "3px solid red")
			}
			tutorial_box.text(new_text)
			tuto_stage++
			current_tuto_marked_elem = new_marking_elem //documenting for usage in other functions
		}


		$(document).ready(function(){
			$("#skipBackground").on('click', function(){
				console.log("entered the skipBackground button event")
				tutorial_stage();
			});
		});

		$(document).ready(function(){
			$("#skipTutorial").on('click', function(){
				tuto_stage = -1
				$(this).hide()
				$("#activateTutorial").show()
				$("#tutorial").hide()
				$("#tutorial").text("")
				$("#skipBackground").hide()
				current_tuto_marked_elem.css("border", "") //disactivation visual instructions
				if (current_tuto_marked_elem.is($("#chooseBackground"))){ //private case for default background
					console.log("entered the condition")
					$("#chooseBackground").css('border-style', 'none none solid solid')
					$("#chooseBackground").css('border-color', 'DodgerBlue')
				}
			});
		});

		$(document).ready(function(){
			$("#activateTutorial").on('click', function(){
				initialTutorialStageConsideringImageStatus() //activating instructions
			});
		});

		/*Determing initial tutorial stage with respect to image uploaded by the user.
		Due to the requierment of the page to refresh when uploading and image (form must be sent)
		we distinguish between 2 initial tutorial stage - before image uploaded, and after it (or if skipped) */
		function initialTutorialStageConsideringImageStatus() {
			$("#activateTutorial").hide()
			$("#skipTutorial").show()
			$("#tutorial").show()
			tuto_stage = 0
			if (!($(".background_thumbnail").length)){
				$("#chooseBackground").css("border", "3px solid red")
				current_tuto_marked_elem = $("#chooseBackground")
				var firstStepInstructions = '<p>Welcome to the page Structure Editor\'s Toturial</p>				<p>This Tool will help you to design the Page\'s Template</p>				<p>Let\'s begin with Choosing a BackGround Image for the Page (red framed), after choosing and image, Press the Upload Image button</p>'
				$("#tutorial").append(firstStepInstructions)
				$("#skipBackground").show()
				console.log("enter aint found image")
			} else {
				tutorial_stage()
				console.log("enter found image")
			}
		}

		$(document).ready(function(){
			$("#uploadImage, #removeBackground").on('click', function(){
				if ($("#creationPanel").find(".propCont").length != 0){
					if(confirm("This Action will cause a page Refresh. ANY USAVED CHANGES WILL BE DELETED. are you sure you want to make this action? Please make sure your'e structure is saved before clicking yes.")){

					} else {
						return false
					}
				}
			});
		});

		//IMPORTENT NOTE: although it will be much a better design for the createContainer function to  receive only args for block indexes, i couldnt find a way to properly refer to a queryset's index (find a block in row queryset). both the slice function or a custom template tag are returning objects which does not have the "." functionality for getting children and attributs. only the django "for loop" returns proper objects. therefore i decided to temporarily send all requierd objects information from caller. later i will make a better designed function with JSON  
		function createContainer(row, col, width, offset, contentTitles, contentIds) { 
			console.log("row col",row,col, width, offset)
			var container = ""
			container += '<div style="border:2px solid DodgerBlue;" class="col-md-'+width+' offset-md-'+offset+' propCont" id="propCont'+col+'"> 	<div class="properties">	<b>Blocks Width</b><br>			<select class="width" id="width'+col+'">	    	  	<option value="12">full width</option><option value="10">five sixths</option>	    	  	<option value="8">two thirds</option>	    	  	<option value="6">half</option>	    	  	<option value="4">third</option>	    	  	<option value="2" selected="">sixth</option>	    	</select>	    	<br><br>	    <b>Distance from left element</b><br>						    		    	<select class="offset" id="offset'+col+'"> <option value="10">five sixths</option>	    	  	<option value="8">two thirds</option>	    	  	<option value="6">half</option>	    	  	<option value="4">third</option>	    	  	<option value="2">sixth</option>	    	  	<option value="0" selected="">none</option>	  <br>  	</select> <input class="attachedContentId" id="attachedContentId'+col+'" value="'+contentIds+'" type="hidden"><br><br> <button class="glyphicon glyphicon-remove deleteContainer" type="button" title="Click to delete this block" id="delete '+col+'"></button></div>'
			container +='<div class="conType" style="display:none;" ><b>Select Content Type</b><select class="selectType" id="selectType'+col+'" >			<option value=""></option><option value="text">Text</option>				  	<option value="image">Image</option>				  					</select></div>'
			container += '<div class="exampleContent" id="exampleContent'+col+'" style="display:none;"></div>'
			if (contentTitles){ //if contentTitles has received, existingContent must exit at the DB and be received either.
				//container+='<div class="exampleContent" id="exampleContent'+col+'" style="display:none;">'+existingContent+'</div>'
				container+='<p style="display:inline">attached content</p> <i class="glyphicon glyphicon-book contentIndication" style="font-size:24px;" title="This Block has attached content\ncontent titles:\n'+contentTitles+'"></i>'
			} /*else {
				container +='<div class="conType" style="display:none;" ><b>Select Content Type</b><select class="selectType" id="selectType'+col+'" >			<option value=""></option><option value="text">Text</option>				  	<option value="image">Image</option>				  	<option value="form">Form</option>				</select></div>'
				container += '<div class="exampleContent" id="exampleContent'+col+'" style="display:none;"></div>' 
			} */
			container +='</div>'
			currRow = $("#pageRow"+row)
			currRow.append(container);
			currCont = currRow.children("#propCont"+col)
			currCont.find(".width").val(width)
			currCont.find(".offset").val(offset)
			hideShowButt(row) 
		}


		/*
				function updateConsNames(next_row_div){
					//the function updates the col container's fields names, as part of line switch process
					//notice that index gaps my occure due to lines which was deleted, in such cases adding and subtracting one unit from each index, might not switch the order of the 2 lines (assuming lower index is 2 and higher is 5, after adding and subtracting 2 will become 3 and 5 will become 4 and the order of the 2 elements will not change properly). in order to deal with such cases, (and when treating only with the special case of 2 adjacent lines, we can create 2 adjacent indexes with respect to the upper line index.
					//argument: the mainrow object of the row wich is located at a physically lower area at the structure (next to the other)
					var nameFieldVal = next_row_div.prev().find(".width").attr("name")// must get the name from the width and offset fields, those are the only elemnt whos being sent by the form, therfore the only elements who has a name. all width and offset elems at the same line will have the same row value under name field.
					var prev_rowId = Number(nameFieldVal.substring(nameFieldVal.indexOf(" "),nameFieldVal.indexOf(";")));
					namesRowUpdate(next_row_div, prev_rowId);
					namesRowUpdate(next_row_div.prev(), prev_rowId+1);
				}


				function namesRowUpdate(row_div, new_row_id){
					//notice that the 'id' attribute will not be changed. the JS functionality cares only about recognazing the relation between all the line's elements (by id) and not caring about the lines location (documented with 'name'), except for finding the top and bot rows which not requiers indexes.
					var colId
					var newIndexes
					row_div.find(".propCont").each(function(){
						colId = $(this).attr('id').charAt($(this).attr('id').length-1) //remain const, therefore we can derive it from id field.
						newIndexes = new_row_id+";"+colId
						$(this).find('.width').attr("name", "width "+newIndexes)
						$(this).find('.offset').attr("name", "offset "+newIndexes) 
					})
				}
		*/