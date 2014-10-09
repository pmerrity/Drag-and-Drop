Drag-Drop
=========

Description
-----------

This is a completed demo of a drag-and-drop upload box. This particular one integrates with Amazon's S3 web service. Feel free to use it, and I would appreciate it if you linked your work to this repo or my portfolio:

perrymerrity.com

:]

Features
--------
This demo contains the following features:

* Browseer is blocked from opening up the image when dropped anywhere (including outsidee of the dropzone becuase it was annoying me and because good UX).
* On `dragover` an overlay with an animated gif appears (also because good UX).
* On `drop` the broswer gets the image data and stores the local file as a thumbnail.
* Thumbnails have a checkered background to look pretty.
* Thumbnails can be removed
* Currently only accepts JP[E]G and PNG image file types. Anything else will be rejected.
* Files over 2MB will also be rejected.

Demo
----

You can find a demo [here](demos.perrymerrity.com/drag-drop) (coming soon)

Uploading to Amazon S3
----------------------

I removed my personal S3 credentials for obvious reasons. This is also tailored to how my system handles the signature and policy required to post to S3. If you want to stick wtih the original functionality you'll need to do the following:

* Tweak the AJAX call to retrieve your policy/signature
* Add your `AWSAccessKeyId` to the variable `s3Key` in `s3.js` either in the script or dynamically (mine was just directly in the script).
* Update the URL referencing the S3 bucket you will be uploading to. It is at the end of each function `uploadDragToS3` and `uploadToS3`. 
* Finally, look at the `conditions` object and update the field `bucket` to match the one you will be uploading to

Bugs
----

Currently unaware of any bugs, but I will update this as I come across any. Feel free to submit issues and I'll update it.

References
----------

It took a LOT to build this. If you just want to use this as a basis, but still need help here's what I found useful:

* [Mozilla's Docs](https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications#Selecting_files_using_drag_and_drop)
* [Uploading Blobs (Tutorial)](http://www.html5rocks.com/en/tutorials/file/xhr2/#toc-send-blob)
* [Really long but fantastic Stackoverflow answer](http://stackoverflow.com/questions/20537696/remember-and-repopulate-file-input/20537822#20537822)
* [Uploading to S3](https://aws.amazon.com/articles/1434)