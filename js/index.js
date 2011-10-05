V5.registerPage("index", function () {
    var iscroll;
    var initialize = function (id) {
        var page = this;
        var view = V5.View(page.node);
        var contentBox = view.$('textarea');
        var proxy = new EventProxy();
        var _notes = JSON.parse(localStorage.notes);

        if (id) {
            $.get('/getnote', {id: id}, function (msg) {
                contentBox.val(msg);
            });
        }

        iscroll = new iScroll(view.$("article")[0], {
            onBeforeScrollStart : function (e) {
            }
        });

        view.bind("redirect", function (event) {
            var target = $(event.currentTarget);
            var hash = target.attr("href");
            page.openView(hash.replace("#", ""));
            event.preventDefault();
        });

        proxy.bind("openDialog", function (url) {
            contentBox.val('');
            var buffer = "";
            buffer += "<div class='dialog hidden'>";
            buffer +=   "<div class='inner'>";
            buffer +=       "<div class='title'>新笔记</div>";
            buffer +=       "<h3>地址：</h3>";
            buffer +=       "<div class='content'><input type='text' name='url' value='" + url + "' /></div>";
            buffer +=       "<div id='share-buttons'>";
            buffer +=           "<a href='javascript:;' id='sina-share'>";
            buffer +=               "<img src='http://www.sinaimg.cn/blog/developer/wiki/share_button_m.gif' alt=''>";
            buffer +=           "</a>";
            buffer +=           "<a href='javascript:;' id='qq-share'>";
            buffer +=               "<img src='http://open.t.qq.com/images/resource/button24.png' alt=''>";
            buffer +=           "</a>";
            buffer +=       "</div>";
            buffer +=       "<div class='buttons'><a class='yes' href='javascript:;'>返回</a></div>";
            buffer +=   "</div>";
            buffer += "</div>";
            var dialog = new V5UI.Dialog({className: "dialog", modal: true}, {}, function () {
                dialog.close().destroy();
            }, buffer);
            dialog.open();
        });

        view.bind("submit", function (event) {
            var message = contentBox.val();
            $.ajax({
                type: 'POST',
                url: '/postnote',
                headers:{
                    'content-type': 'application/x-www-form-urlencoded'
                },
                data: {
                    content: message
                },
                success: function (newurl) {
                    $('#url').val(newurl);
                    _notes.push({
                        url: newurl,
                        content: message
                    });

                    localStorage.notes = JSON.stringify(_notes);
                    proxy.fire("openDialog", newurl);
                },
                error: function () {
                    proxy.fire("openDialog", '添加失败');
                }
            });
            event.preventDefault();
        });

        view.delegateEvents({
            "click nav a": "redirect",
            "click .submit": "submit",
        });
    };

    return {
        initialize: initialize
    };
});
V5.registerPage("list", function () {
    var iscroll;
    var initialize = function () {
        var page = this;
        var view = V5.View(page.node);
        if (!localStorage.notes) {
            localStorage.notes = '[]';
        }

        iscroll = new iScroll(view.$("article")[0], {
            onBeforeScrollStart : function (e) {
            }
        });

        var _notes = JSON.parse(localStorage.notes);
        V5.getTemplate("list", function (tmpl) {
            view.$('#notes').html(_.template(tmpl, {data: _notes}));
            iscroll.refresh();
        });

        view.bind("deleteNote", function (event) {
            var item = $(event.currentTarget).closest("li");
            var url = item.find('.content').attr('href'),
                index;
            for (var i = 0; i < _notes.length; i++) {
                if (_notes[i].url == url) {
                    _notes.splice(i, 1);
                }
            }
            localStorage.notes = JSON.stringify(_notes);
            item.remove();
        });

        view.bind("redirect", function (event) {
            var target = $(event.currentTarget);
            var hash = target.attr("href");
            page.openView(hash.replace("#", ""));
            event.preventDefault();
        });

        view.delegateEvents({
            "click nav a": "redirect",
            'click .delete': "deleteNote"
        });
    };

    var reappear = function () {
        var page = this;
        var view = V5.View(page.node);
        var _notes = JSON.parse(localStorage.notes);
        V5.getTemplate("list", function (tmpl) {
            view.$('#notes').html(_.template(tmpl, {data: _notes}));
            iscroll.refresh();
        });
    };

    return {
        initialize: initialize,
        reappear: reappear
    };
});

