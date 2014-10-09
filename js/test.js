var dropzone;

dropzone = document.getElementById("dropzone");
dropzone.addEventListener("dragenter", dragenter, false);
dropzone.addEventListener("dragover", dragover, false);
dropzone.addEventListener("drop", drop, false);

function dragenter(e) {
	e.stopPropagation();
	e.preventDefault();
}

function dragover(e) {
	e.stopPropagation();
	e.preventDefault();
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();

	var filesArray = e.dataTransfer.files;

	for (var i = 0; i < filesArray.length; i++) {
		handleFiles(filesArray[i]);

	}
}

function handleFiles(files) {
	var file = files;

	function readItems(){
		console.log((file.size/1000000) + "+ MB");
		console.log(file.type);
		console.log(file.name);
		var preview = document.getElementById("dropListing");
		var img = document.createElement("img");
		img.classList.add("obj");
		img.setAttribute("id", "dat");
		img.file = file;
		preview.appendChild(img); // Assuming that "preview" is a the div output where the content will be displayed.
		var reader = new FileReader();
		reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
		reader.readAsDataURL(file);
		saveImageToS3(file);
		$("#selectFile").click(function(){
			console.log("click");
			saveImageToS3();
			sendFile(file);
		});
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

}

function saveImageToS3(file){
	var policy = {
		"expiration": "2014-10-31T00:00:00Z",
		"conditions": [
			{"bucket": "sister-test"},
			["starts-with", "$key", ""],
			{"acl": "public-read"},
			["starts-with", "$Content-Type", ""],
			["content-length-range", 0, 1048576]
		]
	}

	var params = {
		'policyDocument' : JSON.stringify(policy)
	};

	var data = JSON.stringify({
		"method": "es.getSignatureForS3",
		"params": [params],
		"auth": null, "id": 0, "jsonrpc": "2.0s"
	});

	$.ajax({
		url: 'http://api.sister.tv/api/jsonrpc/',
		type: 'POST',
		contentType: 'application/json',
		data: data,
		dataType: 'json',
		success: function(data){
			console.log('got the result policy and sig', data);
			setS3Data(file, data.result.policy, data.result.signature);
			uploadToS3(data.result.policy, data.result.signature);
		}
	});
}

function sendFile(file) {
	var fd = new FormData($("#dragDropUploadForm_")[0]);
	fd.append('files', file);
	var xhr = new XMLHttpRequest();

	xhr.open('POST', 'https://sister-test.s3.amazonaws.com/', true);

	xhr.onload = function() {
		if(xhr.status === 200) {
			console.log("DRAG AND DROP SUCCESSFUL");
		}
		else {
			console.log("NOPE NOPE NOPE NOPE NOPE")
		}
	}
	xhr.send(fd);
}

function setS3Data(file, policy, signature) {

		var key =  document.getElementById("dat").file.name;
		var acl = 'public-read';
		var S3key = '0KMZHPQ56ZMG07Q3HG02';

		var acl = 'public-read';
		var fd = new FormData();

		fd.append('key', key);
		fd.append('acl', acl);
		fd.append('Content-Type', 'image/jpeg');
		fd.append('AWSAccessKeyId', S3key);
		fd.append('policy', policy);
		fd.append('signature', signature);
		fd.append('file', $("#dat").attr("src"));

	var xhr = new XMLHttpRequest();

	xhr.open('POST', 'https://sister-test.s3.amazonaws.com/', true);

	xhr.onload = function() {
		if(xhr.status === 200) {
			console.log("DRAG AND DROP SUCCESSFUL");
		}
		else {
			console.log("NOPE NOPE NOPE NOPE NOPE")
		}
	}
	xhr.send(fd);
//
//		var form = 	'<form id="dragDropUploadForm_" class="dropForms">';
//		form += 	'<input type="hidden" name="key" value="' + key + '"/>';
//		form += 	'<input type="hidden" name="AWSAccessKeyId" value="' + S3key + '">';
//		form += 	'<input type="hidden" name="acl" value="' + acl + '">';
//		form += 	'<input type="hidden" name="policy" value="' + policy + '">';
//		form += 	'<input type="hidden" name="signature" value="' + signature + '">';
//		form += 	'<input type="hidden" name="Content-Type" value="image/jpg">';
//		form += '</form>';
//		$("body").prepend(form);

}

function uploadToS3(policy, signature) {
	var filename = $('#bannerFileSelect').val().split('\\')[$('#bannerFileSelect').val().split('\\').length - 1];
	var key =  filename;
	var acl = 'public-read';
	var S3key = '0KMZHPQ56ZMG07Q3HG02';

	if(key != "No file chosen" > -1) {
		$('#bannerUploadForm').prepend("<input type='hidden' name='Content-Type' value='image/jpg'>");
		$('#bannerUploadForm').prepend("<input type='hidden' name='signature' value='" + signature + "'>");
		$('#bannerUploadForm').prepend("<input type='hidden' name='policy' value='" + policy + "'>");
		$('#bannerUploadForm').prepend("<input type='hidden' name='acl' value='" + acl + "'>");
		$('#bannerUploadForm').prepend("<input type='hidden' name='AWSAccessKeyId' value='" + S3key + "'>");
		$('#bannerUploadForm').prepend("<input type='hidden' name='key' value='" + key + "'>");

		var fd = new FormData(document.getElementById('bannerUploadForm'));
		var xhr = new XMLHttpRequest();
		xhr.addEventListener('load', function() {
			console.log("========SINGLE FILE UPLOAD=========");
		}, false);
		xhr.open('POST', 'https://sister-test.s3.amazonaws.com/', true);
		xhr.send(fd);
	}
	else {
		console.log("NOTHING TO UPLOAD FROM READER");
	}

}
