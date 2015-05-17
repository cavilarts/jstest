define([
	'jquery',
	'knockout'
	], function(
		$,
		ko
	){
		var indexData,
			$usersCont = $('.user-list__main-list'),
			$qualifyBtn = $('.userid'),
			$finderUsers = $('.user-list'),
			$qualifySec = $('.section-qualify'),
			$closeUser = $('.section-qualify__close'),
			userQualify = ko.observable();

		$.ajax({
			"url": "../../content/json/index.json",
			"method": "GET"
		}).done(function(response){
			console.log(response);
			indexData = response;
			ko.applyBindings(indexData, $finderUsers[0]);
		}).fail(function(error){
			console.log(error);
		});

		$usersCont.on("click", $qualifyBtn, qualifyUser);

		function qualifyUser() {

			var userId = $(this).attr('data-userid');

			$.ajax({
				"url": "../../content/json/qualifyUser.json",
				"method": "GET",
				"data": {userid: userId}
			}).done(function(response) {
				var winHeight = $('body').height();
				if(typeof userQualify() !== "object"){
					
					userQualify(response);
					$qualifySec.css({'height': winHeight});
					ko.applyBindings(userQualify, $qualifySec[0]);
				}else{
					userQualify(response);
					userQualify.valueHasMutated();
				}
				window.scrollTo(0, 0);

			}).fail(function(error) {
				console.log(error);
			});
		}

		$closeUser.on("click", function(){
			$qualifySec.removeClass('active');
		});
	

});
