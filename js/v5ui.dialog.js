/*global $, document, _ */
/**
 * Overlay UI widget.
 */
var V5UI = V5UI || {};
(function (UI) {
    var body = $(document.body);
    var Overlay = function () {};
    Overlay.node = null;
    Overlay.create = function () {
        if (!Overlay.node) {
            var node = $("<div class='overlay hidden'></div>");
            body.append(node);
            Overlay.node = node;
        }

        return Overlay.node;
    };
    Overlay.width = function () {
        return body.width() + "px";
    };
    Overlay.height = function () {
        return document.documentElement.scrollHeight + "px";
    };
    UI.Overlay = Overlay;
}(V5UI));
/**
 * Dialog UI widget.
 */
(function (UI) {
    var body = $(document.body);
    var Dialog = function (options, l10n, okHandle, node) {
        if (typeof node === "object") {
            this.dialogNode = node;
        } else {
            node = node || UI.Dialog.defaultTemplate;
            var dialogNode = $(_.template(node, l10n));
            body.append(dialogNode);
            this.dialogNode = dialogNode;
        }
        var h = Array.prototype.slice.apply(arguments, [4]);
        this.init.apply(this, [options, okHandle, h]);
    };

    Dialog.prototype.init = function (options, okHandle, h) {
        var self = this,
            node = this.dialogNode;
        if (options.className) {
            node.addClass(options.className);
        }
        if (options.refer) {
            this.refer = options.refer;
        }
        if (options.modal) {
            this.dialogOverlayNode = UI.Overlay.create();
        }
        if (okHandle) {
            node.delegate(".yes", "click", okHandle);
        }
        node.delegate(".cancel", "click", function (event) {
            event.preventDefault();
            self.close();
            self.destroy();
        });
        if (options.afterClose) {
            this.afterClose = options.afterClose;
        }
    };

    Dialog.prototype.open = function () {
        var node = this.dialogNode,
            overlay = this.dialogOverlayNode,
            top,
            left;
        node.removeClass("hidden");
        top = (body.height() - node.height()) / 2;
        node.css("top", top);
        left = (body.width() - node.width()) / 2;
        node.css("left", left);
        if (overlay) {
            overlay.removeClass("hidden");
        }
        return this;
    };
    
    Dialog.prototype.close = function () {
        var g = this.dialogNode;
        g.addClass("hidden");
        g.removeClass("fixed");
        if (this.dialogOverlayNode) {
            this.dialogOverlayNode.addClass("hidden");
        }
        return this;
    };

    Dialog.prototype.destroy = function () {
        this.dialogNode.remove();
    };

    UI.Dialog = Dialog;
}(V5UI));
/**
 * Dialog UI widget and template.
 */
(function (UI) {
    // Default dialog template
    var buffer = "";
    buffer += "<div class='dialog hidden'>";
    buffer +=     "<div class='inner'>";
    buffer +=         "<div class='title'><%=title%></div>";
    buffer +=         "<div class='buttons'>";
    buffer +=             "<a class='cancel' href='javascript:;'><%=cancel%></a>";
    buffer +=             "<a class='yes' href='javascript:;'><%=yes%></a>";
    buffer +=         "</div>";
    buffer +=     "</div>";
    buffer += "</div>";
    UI.Dialog.defaultTemplate = buffer;
}(V5UI));
(function (UI) {
    var buffer = "";
    buffer += "<div class='dialog hidden'>";
    buffer +=   "<div class='inner'>";
    buffer +=       "<div class='title'><%=title%></div>";
    buffer +=       "<div class='comment'><input type='text' placeholder='<%=placeholder%>' /></div>";
    buffer +=       "<div class='buttons'>";
    buffer +=           "<a class='cancel' href='javascript:;'><%=cancel%></a>";
    buffer +=           "<a class='yes' href='javascript:;'><%=ok%></a>";
    buffer +=       "</div>";
    buffer +=   "</div>";
    buffer += "</div>";
    UI.Dialog.commitTemplate = buffer;
}(V5UI));
(function (UI) {
    var buffer = "";
    buffer += "<div class='dialog hidden'>";
    buffer +=   "<div class='loading_animation'>";
    buffer +=   "</div>";
    buffer +=   "<%=loading%>";
    buffer += "</div>";
    UI.Dialog.loadingTemplate = buffer;
}(V5UI));

(function (UI) {
    var buffer = "";
    buffer += "<div class='dialog hidden'>";
    buffer +=   "<div class='inner'>";
    buffer +=       "<div class='title'><%=title%></div>";
    buffer +=       "<div class='content'><%=content%></div>";
    buffer +=       "<div class='buttons'><a class='yes' href='javascript:;'><%=ok%></a></div>";
    buffer +=   "</div>";
    buffer += "</div>";
    UI.Dialog.messageTemplate = buffer;
}(V5UI));

(function (UI) {
    var buffer = "";
    buffer += "<div class='dialog hidden'>";
    buffer +=   "<div class='inner'>";
    buffer +=       "<div class='content'><%=content%></div>";
    buffer +=       "<div class='buttons'><a class='yes' href='javascript:;'><%=ok%></a></div>";
    buffer +=   "</div>";
    buffer += "</div>";
    UI.Dialog.noticeTemplate = buffer;
}(V5UI));