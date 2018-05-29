var baseUrl = 'http://admin.web:10014/';

function loginAction() {
// 	var loginname = $('#commentForm').serializeJSON().loginname;
	var userName = $('#commentForm').serializeJSON().userName;
	console.log(JSON.stringify($('#commentForm').serializeJSON()))
	$.ajax({
		type: "post",
		//		url: baseUrl + "api/jp-BIRM-UserProfile-ms//users/login",
		url: YZ.ajaxURLms + "api/jp-HCZZ-PAMonitor-app-ms/user/login",
		data: JSON.stringify($('#commentForm').serializeJSON()),
		dataType: "text",
		async: false,
		headers: {
			"Content-Type": "application/json;charset=UTF-8"
		},
		success: function success(data) {
			console.log(data);
		// 	if(data == true || data == 'true') {
    //
		// 		//get userid by loginname
		// 		$.ajax({
		// 			type: "get",
		// 			url: baseUrl + "api/jp-BIRM-UserProfile-ms//users/bigUserBigModelByloginName/" + loginname,
		// 			dataType: "json",
		// 			async: false,
		// 			headers: {
		// 				"Content-Type": "application/json;charset=UTF-8"
		// 			},
		// 			success: function success(data) {
		// 				console.log(data);
		// 				var userId = data.userId;

						//get page grant by userId
						// $.ajax({
						// 	type: "get",
						// 	url: baseUrl + "api/jp-BIRM-UserProfile-ms//opt/function/user/" + userId,
						// 	dataType: "json",
						// 	async: false,
						// 	headers: {
						// 		"Content-Type": "application/json;charset=UTF-8"
						// 	},
						// 	success: function success(data) {
						// 		console.log(data);
						// 		var length = data.length;
						// 		var bsPageGrants = [];
						// 		var flagNum = 0;
						// 		for(var i = 0; i < length; i++) {
						// 			if(data[i].displayname.match('BS')) {
						// 				bsPageGrants.push(data[i]);
						// 			}
						// 		}
						// 		var pageGrantsLength = bsPageGrants.length;
						// 		var html = '';
						// 		var navHtml = '';
						// 		var iframeHtml = '';
						// 		for(var _i = 0; _i < pageGrantsLength; _i++) {
            //
						// 			html += '<li>\n\t\t\t\t\t\t\t\t\t<a href="#">\n\t\t\t\t\t\t\t\t<i class="fa fa-info"></i>\n\t\t\t\t\t\t\t\t<span class="nav-label">' + bsPageGrants[_i].name + '</span>\n\t\t\t\t\t\t\t\t<span class="fa arrow"></span>\n\t\t\t\t\t\t\t    </a>\n\t\t\t\t\t\t\t    <ul class="nav nav-second-level">\n\t\t\t\t\t\t\t    ';
						// 			bsPageGrants[_i].children.forEach(function(item, index) {
						// 				var pageName = item.displayname.substring(13);
						// 				var pageUrl = 'index_' + pageName + '.html';
						// 				if(flagNum == 0) {
						// 					navHtml = '<a href="javascript:;" class="active J_menuTab" data-id="' + pageUrl + '">' + item.name + '</a>';
						// 					iframeHtml = '<iframe class="J_iframe" name="iframe0" width="100%" height="100%" src="' + pageUrl + '" frameborder="0" data-id="' + pageUrl + '" seamless></iframe>';
						// 					flagNum++;
						// 				}
						// 				html += '<li>\n\t\t\t\t\t\t\t\t\t<a class="J_menuItem" href="' + pageUrl + '">' + item.name + '</a>\n\t\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t\t';
						// 			});
						// 			html += '</ul>\n\t\t\t\t\t\t        </li>\n\t\t\t\t\t\t        ';
						// 		}
            //
						// 		sessionStorage.setItem("html", html);
                data = $.parseJSON( data );
								sessionStorage.setItem("userName", userName);
								sessionStorage.setItem("userRole", data.userRole);
						// 		sessionStorage.setItem("navHtml", navHtml);
						// 		sessionStorage.setItem("iframeHtml", iframeHtml);
						// 		sessionStorage.setItem("userId", userId);
								$(location).attr('href', 'index.html');
						// 	}
						// });
				// 	}
				// });
		// 	} else {
		// 		layer.msg('登录失败！', {
		// 			icon: 0
		// 		});
		// 	}
		},

		error: function error(returndata) {
			console.log(returndata);

			layer.msg('登录失败！', {
				icon: 0
			});
		}
	});
}