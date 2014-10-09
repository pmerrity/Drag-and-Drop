function Drop(){
	var self = this;

	self.init = function() {
		console.log("init")
		var self = this;

		self.dropSetup = function() {
			console.log("drop set")
			var dropList = $("#dropListing");
			var dropzone = $("#dropzone");
			console.log(dropzone)
			dropzone.on("dragenter", function(e) {
				console.log("yes");
				e.stopPropagation();
				e.preventDefault();
			});

			dropzone.on("dragover", function(e) {
				console.log("over")
				e.stopPropagation();
				e.preventDefault();
			});

			dropzone.on("drop", self.listen;
		};


		self.listen = function(e){
			console.log("OH HAI")
			e.stopPropagation();
			e.preventDefault();

			var files = e.dataTransfer.files;

			$.each(files, function(i, file){
				console.log("hello", i);

				function read() {
					var reader = new FileReader();

					reader.index = i;
					reader.file = file;
					reader.on("loadEnd", constructImage, false);
				}
			});
		};


		self.setClcks = function(){
			$(document).on("click", ".options",function(){
				$(this).parent().remove();
			});

			$("#dropzone").on("dragenter", function() {
				$("#overlay").css({
					"opacity" : "1",
					"z-index" : "1"
				});
			});

			$("#overlay").on("dragleave", function() {
				$(this).css({
					"opacity" : "0",
					"z-index" : "-1"
				});
			});

			$("#dropzone").on("drop", function() {
				$("#overlay").css({
					"opacity" : "0",
					"z-index" : "-1"
				});
			});
		};

		self.dropSetup();
		self.setClcks();
	};

	self.run = function() {
		self.sendForm();
	};
}
