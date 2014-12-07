/**
 * @package Modalator Captures common bootstrap modal usage patterns.
 * @author Joel Dalley 
 * @version 2014/Dec/06
 */
var Modalator = (function() {
    var DIALOG_DEFAULT_WIDTH = 240;

    // Cache constructed modal dialogs.
    var dialogs = {};

    /**
     * @function setAttributes().
     * @param object node A DOM node.
     * @param object attrs Attributes configuration.
     * @return void DOM node side-effects only.
     */
    function setAttributes(node, attrs) {
        for (var name in attrs) {
            typeof attrs[name] === 'function'
                ? node[name] = attrs[name]
                : node.setAttribute(name, attrs[name]);
        }
    }

    /**
     * @method Modalator.appendToDOM().
     * @param array children DOM nodes.
     * @param object [opt] root A DOM node to append to, or undefined.
     * @return void DOM side-effects only.
     */
    var appendToDOM = function(children, root) {
        // If not given a root node, assume <body> exists.
        if (typeof root === 'undefined') {
            root = document.getElementsByTagName('body')[0];
        }
        for (var i = 0; i < children.length; i++) {
            root.appendChild(children[i]);
        }
    }

    /**
     * A <button> constructor.
     * @method Modalator.launcher.button() 
     * @param object config Button configuration.
     * @return <button> The configured DOM node.
     */
    var launcher = {
        button: function(config) {
            var attrs = config.attrs || {};
            attrs.type = 'button';
            attrs['data-toggle'] = 'modal';
            attrs.href = attrs.href || '#';
            attrs.class = attrs.class || 'btn btn-primary';

            var btn = document.createElement('button');
            btn.innerHTML = config.text || 'Launch';
            setAttributes(btn, attrs);
            return btn;
        },
    };
    
    /**
     * A bootstrap modal dialog constructor.
     * @method Modalator.dialog().
     * @param mixed arg string|object
     *   - if arg is a string, return the cached dialog.
     *   - if arg is an object, construct, cache & return a dialog.
     * @return <div> The configured bootstrap modal dialog DOM node.
     */
    var dialog = function(arg) {
        // Attempt to load from cache.
        if (typeof arg === 'string') {
            if (typeof dialogs[arg] !== 'undefined') {
                return dialogs[arg];
            }
            else {
                throw "No registered dialog `" + arg + "`";
            }
        }

        var attrs;

        // Modal dialog container div.
        var dialog = document.createElement('div');
        attrs = arg.attrs || {};
        attrs['data-width'] = attrs['data-width'] || DIALOG_DEFAULT_WIDTH;
        attrs.style = attrs.style || 'display:none';
        attrs.class = attrs.class || 'modal fade';
        attrs.tabindex = attrs.tabindex || '-1';
        setAttributes(dialog, attrs);

        // Modal dialog header.
        var head = document.createElement('div');
        attrs = arg.head && arg.head.attrs || {};
        attrs.class = attrs.class || 'modal-header';
        setAttributes(head, attrs);
        
        // Modal dialog "x" (cancel) button.
        var x = document.createElement('button');
        x.innerHTML = 'x';
        attrs = arg.x && arg.x.attrs || {};
        attrs.type = 'button';
        attrs.class = 'close';
        attrs['aria-hidden'] = 'true';
        attrs['data-dismiss'] = 'modal';
        setAttributes(x, attrs);
        head.appendChild(x);

        // Modal dialog header text.
        var titleCfg = arg.title || {};
        var title = document.createElement(titleCfg.tag || 'h2');
        title.innerHTML = titleCfg.text || 'Dialog';
        setAttributes(title, titleCfg.attrs || {});
        head.appendChild(title);
        dialog.appendChild(head);

        // Modal dialog body.
        var body = document.createElement('div');
        attrs = arg.body && arg.body.attrs || {};
        attrs.class = attrs.class || 'modal-body';
        setAttributes(body, attrs);

        // Optional body text, before any fields.
        if (arg.body && arg.body.text) {
            var bodyText = document.createElement('div');
            bodyText.innerHTML = arg.body.text;
            body.appendChild(bodyText);
        }

        // Modal dialog fields.
        if (!arg.fields) { arg.fields = [] }
        for (var i = 0; i < arg.fields.length; i++) {
            var fieldCfg = arg.fields[i];

            var label = document.createElement('label');
            label.innerHTML = fieldCfg.label;
            body.appendChild(label);

            if (fieldCfg.type.match(/^(text|password)$/)) {
                var input = document.createElement('input');
                setAttributes(input, fieldCfg.attrs || {});
                body.appendChild(input);
            }
            else if (fieldCfg.type === 'select') {
                var select = document.createElement('select');
                attrs = fieldCfg.attrs || {};
                setAttributes(select, fieldCfg.attrs || {});

                if (!fieldCfg.options) { fieldCfg.options = [] }
                for (var n = 0; n < fieldCfg.options.length; n++) {
                    var optCfg = fieldCfg.options[n] || {};

                    var option = document.createElement('option');
                    option.innerHTML = optCfg.text || '';
                    setAttributes(option, optCfg.attrs || {});
                    select.appendChild(option);
                }
                body.appendChild(select);
            }
        }

        if (body.childNodes.length) { dialog.appendChild(body) }

        // Modal dialog footer.
        var foot = document.createElement('div');
        attrs = arg.foot && arg.foot.attrs || {};
        attrs.class = 'modal-footer';
        setAttributes(foot, attrs);

        // Cancel button.
        var cancelCfg = arg.cancel || {};
        var cancel = document.createElement('button');
        cancel.innerHTML = cancelCfg.text || 'Cancel';
        attrs = cancelCfg.attrs || {};
        attrs.type = 'button';
        attrs['data-dismiss'] = 'modal';
        attrs.class = attrs.class || 'btn';
        setAttributes(cancel, attrs);

        // Affirm button.
        var affirmCfg = arg.affirm || {};
        var affirm = document.createElement('button');
        affirm.innerHTML = affirmCfg.text || 'Submit';
        attrs = affirmCfg.attrs || {};
        attrs.class = attrs.class || 'btn btn-primary';
        if (!attrs.onclick) {
            attrs['data-toggle'] = 'modal';
            attrs.href = attrs.href || '#' + arg.attrs.id;
        }
        setAttributes(affirm, attrs);

        foot.appendChild(cancel);
        foot.appendChild(affirm);
        dialog.appendChild(foot);

        // Cache & return.
        dialogs[arg.attrs.id] = dialog;
        return dialog;
    };

    return {
        appendToDOM: appendToDOM,
        launcher: launcher,
        dialog: dialog
    };
})();
