F2.Apps["3493749374339473947394397439473972018"] = (function() {

	var App_Class = function (appConfig, appContent, root) {
		this.ui = appConfig.ui;
		this.appContent = appContent;
		this.$root = root;
	};

	App_Class.prototype.init = function () {

		this.ui.updateHeight();
		
		//F2.log("¡Vámonos! Flickr interestingness coming up...");

		this.getPhotos();
	};

	App_Class.prototype.getPhotos = function(){
		$.ajax({
			url: "http://api.flickr.com/services/rest/?method=flickr.interestingness.getList&api_key=40a949bcac34140aaf6321f9c384f4bd&per_page=1&page=1&format=json",
			data: {},
			jsonpCallback: "jsonFlickrApi",
			dataType: "jsonp",
			context:this
		}).done(function(jqxhr,txtStatus){
			//F2.log(jqxhr)
			this.loadPhoto(jqxhr.photos.photo[0]);
		}).fail(function(jqxhr,txtStatus){
			$("div.imgPlaceholder", this.$root).html("Booof! Flickr or something failed.");
		});
	}

	App_Class.prototype.loadPhoto = function(photo){
		var url = this.makePhotoURL(photo);
		//F2.log(url);
		$('<img src="' + url + '" class="img-polaroid">')
			.appendTo( $('div.imgPlaceholder', this.$root))
			.load($.proxy(function() {
				this.ui.updateHeight();
			}, this));
	}

	App_Class.prototype.makePhotoURL = function(photo){
		//see: http://www.flickr.com/services/api/misc.urls.html
		return ["http://farm", photo.farm, ".staticflickr.com/", photo.server, "/",photo.id, "_" ,photo.secret, ".jpg"].join("");
	}

	return App_Class;
})();