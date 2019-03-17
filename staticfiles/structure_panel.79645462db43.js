		/* somthing i might want to fix
		notice in many functions i make some actions after doc ready
		it seems wrong cause i think its running without relation to buttuon press
		try to get in after the on click or change or somthing */



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

		var nextRowId = 0 //because of the users ability to change the order of the rows, the last row id, will not necessarily be the id of the last row at the html stracture (which will be given back by simple JS). instead of looping through the elements ids and look for the hightest index, i decided to create a variable for row id counter. 
		
		//can consider later just to update the id's every row switch or delete, and then can just get the next id from counting rows and adding 1

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