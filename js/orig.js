$(document).ready(function(){

	var dropApp = dropApp || {};

	(function(){
		var dropContainer,
			dropListing,
			imgPreviewFragment = document.createDocumentFragment(),
			domElements;

		dropApp.setup = function() {
			dropListing = $("#dropListing");
			dropContainer = $("#dropzone");

			dropContainer.bind("dragenter", function(event){
				dropListing.innerHTML = '';
				event.stopPropagation();
				event.preventDefault();
			}, false);
			dropContainer.bind("dragover", function(event){
				event.stopPropagation();
				event.preventDefault();
			}, false);
			dropContainer.bind("drop", dropApp.handleDrop, false);
		};

		dropApp.uploadProgressXHR = function(event) {
				if (event.lengthComputable) {
					var percentage = Math.round((event.loaded * 100) / event.total),
						loaderIndicator = event.target.log.firstChild.nextSibling.firstChild;
						console.log(loaderIndicator);
						console.log(event.target.self);
						console.log(event.target);
					if (percentage < 100) {
						loaderIndicator.style.width = (percentage*2) + "px";
						loaderIndicator.textContent = percentage + "%";
					}
				}
			};

			dropApp.loadedXHR = function(event) {
				var currentImageItem = event.target.log;

				currentImageItem.addClass("loaded");
				console.log("xhr upload of "+event.target.log.id+" complete");
			};

		dropApp.uploadError = function(error) {
			console.log("error: " + error.code);
		};

		dropApp.processXHR = function(file, index, bin) {
			var xhr = new XMLHttpRequest(),
				container = $("#droppedItem_"+index),
				fileUpload = xhr.upload,
				progressDomElements = [
					document.createElement('div'),
					document.createElement('p')
				];

			progressDomElements[0].className = "progressBar";
			progressDomElements[1].textContent = "0%";
			progressDomElements[0].appendChild(progressDomElements[1]);

			container.appendChild(progressDomElements[0]);

			fileUpload.log = container;

			fileUpload.addEventListener("progress", function(event) {
				if (event.lengthComputable) {
					var percentage = Math.round((event.loaded * 100) / event.total),
						loaderIndicator = container.firstChild.nextSibling.firstChild;
					if (percentage < 100) {
						loaderIndicator.style.width = (percentage*2) + "px";
						loaderIndicator.textContent = percentage + "%";
					}
				}
			}, false);

			fileUpload.addEventListener("load", function(event) {
				container.className = "loaded";
				console.log("xhr upload of "+container.id+" complete");
			}, false);

			fileUpload.addEventListener("error", dropApp.uploadError, false);

			xhr.open("POST", "../upload.php");
			xhr.overrideMimeType('text/plain; charset=x-user-defined-binary');
//			xhr.sendAsBinary(bin);
		};

		dropApp.handleDrop = function (event) {
			var dt = event.dataTransfer,
				files = dt.files,
				count = files.length;

			event.stopPropagation();
			event.preventDefault();

			for (var i = 0; i < count; i++) {
				if(files[i].size < 1048576) {
					var file = files[i],
						droppedFileName = file.name,
						reader = new FileReader();
					reader.index = i;
					reader.file = file;

					reader.addEventListener("loadend", dropApp.buildImageListItem, false);
					reader.readAsDataURL(file);
				} else {
					alert("File is too large, needs to be below 1MB.");
				}
			}
		};

		dropApp.buildImageListItem = function (event) {
			domElements = [
				document.createElement('li'),
				document.createElement('a'),
				document.createElement('img'),
				document.createElement('p')
			];

			var data = event.target.result,
				index = event.target.index,
				file = event.target.file,
				getBinaryDataReader = new FileReader();

			domElements[2].src = data; // base64 encoded string of local file(s)
			domElements[1].append(domElements[2]);
			domElements[0].id = "droppedItem_"+index;
			domElements[0].className = "droppedItem";
			domElements[0].append(domElements[1]);

			imgPreviewFragment.apend(domElements[0]);

			dropListing.append(imgPreviewFragment);

			getBinaryDataReader.addEventListener("loadend", function(evt){dropApp.processXHR(file, index, evt.target.result);}, false);
			getBinaryDataReader.readAsBinaryString(file);
		};

		window.addEventListener("load", dropApp.setup, false);

		var image = $(".droppedItem img");
		if(image.height() < $(".droppedItem").height()) {
			image.css({
				"height" : "100%",
				"width" : "auto"
			});
		}
	})();
});
