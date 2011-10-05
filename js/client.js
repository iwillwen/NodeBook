(function ($) {
	var $submit = $('#submit')
		id = location.pathname.substring(1).split('/')[1];
	if (id !== '') {
		$.get('/getnote', {id: id}, function (msg) {
			$('#content').val(msg);
		});
	}
	$submit.live('click', function () {
		$.ajax({
			type: 'POST',
			url: '/postnote',
			data: {
				content: $('#content').val()
			},
			beforeSend: function(xhr) {
				xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
			},
			success: function (msg) {
				$('#url').val(msg);
				var li = $('<li data-theme="e" class="ui-btn ui-btn-icon-right ui-li ui-li-has-alt ui-btn-up-e"><div class="ui-btn-inner ui-li ui-li-has-alt"><div class="ui-btn-text"><a class="content ui-link-inherit" href="' + msg + '">' + $('#content').val() + '</a></div></div><a href="javascript:;" data-icon="delete" class="delete ui-li-link-alt ui-btn ui-btn-up-e" title="删除" data-theme="e"><span class="ui-btn-inner"><span class="ui-btn-text"></span><span title="" data-theme="b" class="ui-btn ui-btn-up-b ui-btn-icon-notext ui-btn-corner-all ui-shadow"><span class="ui-btn-inner ui-btn-corner-all"><span class="ui-btn-text"></span><span class="ui-icon ui-icon-delete ui-icon-shadow"></span></span></span></span></a></li>');
				$('#notes').append(li);
				_notes.push({
					url: msg,
					content: $('#content').val()
				});
				$('#content').val('');
				localStorage.notes = JSON.stringify(_notes);
			},
			error: function () {
				$('#url').val('添加失败');
				$('#content').val('');
			}
		});
	});
})(jQuery);