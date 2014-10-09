var dropApp = {};

function datApp(){
	var dropContainer;
	var	dropListing;

	dropApp.setup = function () {
		dropListing = document.getElementById("dropListing");
		dropContainer = document.getElementById("dropzone");

		dropContainer.addEventListener("dragenter", function(event){
			event.stopPropagation();
			event.preventDefault();
		}, false);
		dropContainer.addEventListener("dragover", function(event){
			event.stopPropagation();
			event.preventDefault();
		}, false);
		dropContainer.addEventListener("drop", dropApp.handleDrop, false);
	};

	dropApp.handleDrop = function (event) {
		var dt = event.dataTransfer,
			files = dt.files;

		event.stopPropagation();
		event.preventDefault();

		$.each(files, function(i, file){
			function readItems(){
				console.log("FILE SIZE: "+(file.size/1000000) + "+ MB");
				console.log("FILE TYPE: "+file.type);
				var reader = new FileReader();
				reader.index = i;
				reader.file = file;
				reader.addEventListener("loadend", dropApp.buildImageListItem, false);
				reader.readAsDataURL(file);
			}
			if(file.size < 2097152) {
				if(file.type != "image/jpeg" && file.type != "image/png") {
					alert("Incorrect file type");
				}
				else {
					readItems();
				}

			} else {
				alert("File is too large, needs to be below 2MB.");
			}
		});
	};

	dropApp.buildImageListItem = function(event) {
		var data = event.target.result,
			file = event.target.file,
			getBinaryDataReader = new FileReader();
		console.log(data);

		var thumb = 	'<li class="droppedItem">';
			thumb += 		'<img id="'+file.name+'" src="'+data+'" alt="thumbnail to be published"/>';
			thumb += 		'<div class="options">';
			thumb += 			'<img class="trash" src="img/trash.png"/>';
			thumb += 		'</div>';
			thumb += 	'</li>';
		$("#dropListing").append(thumb);
	};

	window.addEventListener("load", dropApp.setup, false);


	$(document).on("click", ".options",function(){
		$(this).parent().remove();
	});

	$("#dropzone").on("dragenter", function() {
		$("#overlay").css({
			"opacity" : "1",
			"z-index" : "1"
		});
	});

	$("#dropzone").on("drop", function() {
		$("#overlay").css({
			"opacity" : "0",
			"z-index" : "-1"
		});
	});

	$("#overlay").on("dragleave", function() {
		$(this).css({
			"opacity" : "0",
			"z-index" : "-1"
		});
	});
}
datApp();
