	function saveImageToS3() {
		var signature = "[your signature]";
		var policy = {
			"expiration": "2014-10-31T00:00:00Z",
			"conditions": [
				{"bucket": "sister-test"},
				["starts-with", "$key", ""],
				{"acl": "public-read"},
				["starts-with", "$Content-Type", ""],
				["content-length-range", 0, 1048576]
			]
		};
		var params = {
			'policyDocument' : JSON.stringify(policy)
		};
		var data = JSON.stringify({
			//signature is stored on ElasticSearch, so replace with whatever you're using
			"method": "es.getSignatureForS3",
			"params": [params],
			"auth": null, "id": 0, "jsonrpc": "2.0s"
		});
		$.ajax({
			url: '[your url storing the signature/policy]',
			type: 'POST',
			contentType: 'application/json',
			data: data,
			dataType: 'json',
			success: function(data){
				console.log('got the result policy and sig', data);
				uploadDragToS3(data.result.policy, data.result.signature);
				uploadToS3(data.result.policy, data.result.signature);
			}
		});
	}

	function uploadDragToS3(policy, signature) {
		var files = $(".droppedItem > img");

		console.log(files);
			files.each(function(i, value){
				console.log(i, value, this.id);
				var key =  this.id;
				var acl = 'public-read';
				var S3key = '[your S3 key]';
				var fileVal = value.getAttribute("src");

				$("body").prepend('<form id="dragDropUploadForm_'+i+'"></form>');

				var fd = new FormData(document.getElementById('dragDropUploadForm_'+i));
					fd.append('key', key);
					fd.append('acl', acl);
					fd.append('Content-Type', 'image/jpeg');
					fd.append('AWSAccessKeyId', S3key);
					fd.append('policy', policy);
					fd.append('signature', signature);
					fd.append('file', dataURItoBlob(value.getAttribute("src")));
				var xhr = new XMLHttpRequest();

				xhr.open('POST', 'https://bucket-test.s3.amazonaws.com/', true);

				xhr.send(fd);
			});
	}
	function dataURItoBlob(dataURI) {
		var binary = atob(dataURI.split(',')[1]);
		var array = [];
		for(var i = 0; i < binary.length; i++) {
			array.push(binary.charCodeAt(i));
		}
		return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
	}


	function uploadToS3(policy, signature) {
		var filename = $('#bannerFileSelect').val().split('\\')[$('#bannerFileSelect').val().split('\\').length - 1];
		var key =  filename;
		var acl = 'public-read';
		var S3key = '[your s3 key]';

		if(key != "No file chosen" > -1) {
			$('#bannerUploadForm').prepend("<input type='hidden' name='Content-Type' value='image/jpg'>");
			$('#bannerUploadForm').prepend("<input type='hidden' name='signature' value='" + signature + "'>");
			$('#bannerUploadForm').prepend("<input type='hidden' name='policy' value='" + policy + "'>");
			$('#bannerUploadForm').prepend("<input type='hidden' name='acl' value='" + acl + "'>");
			$('#bannerUploadForm').prepend("<input type='hidden' name='AWSAccessKeyId' value='" + S3key + "'>");
			$('#bannerUploadForm').prepend("<input type='hidden' name='key' value='" + key + "'>");

			var fd = new FormData(document.getElementById('bannerUploadForm'));
			console.log($("#bannerUploadForm"));
			var xhr = new XMLHttpRequest();
			xhr.addEventListener('load', function() {
				console.log("========SINGLE FILE UPLOAD=========");
			}, false);
			xhr.open('POST', 'https://bucket-test.s3.amazonaws.com/', true);
			xhr.send(fd);
		}
		else {
			console.log("NOTHING TO UPLOAD FROM READER");
		}

	}

$("#selectFile").click(function(){
	saveImageToS3();
});
