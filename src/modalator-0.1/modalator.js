/**
 * @package Modalator Captures common bootstrap modal usage patterns.
 * @author Joel Dalley 
 * @version 2014/Dec/06
 */
var Modalator = (function() {
    'use strict'; 

    var DIALOG_DEFAULT_WIDTH = 240;

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

    function combinedAttributes(attrs, defaults) {
        var combined = defaults || {};
        for (var key in attrs) { combined[key] = attrs[key] }
        return combined;
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

    var launcher = {
        /**
         * A <button> constructor.
         * @method Modalator.launcher.button() 
         * @param object config Button configuration.
         * @return <button> The configured DOM node.
         */
        button: function(config) {
            var attrs = combinedAttributes(config.attrs || {}, {
                type: 'button',
                'data-toggle': 'modal',
                href: '#',
                class: 'btn btn-primary'
            });

            var btn = document.createElement('button');
            btn.innerHTML = config.text || 'Launch';
            setAttributes(btn, attrs);
            return btn;
        },

        /**
         * An <a> constructor.
         * @method Modalator.launcher.anchor() 
         * @param object config Anchor configuration.
         * @return <a> The configured DOM node.
         */
         anchor: function(config) {
            var attrs = combinedAttributes(config.attrs || {}, {
                'data-toggle': 'modal',
                href: '#',
                class: 'text-primary'
            });

            var a = document.createElement('a');
            a.innerHTML = config.text || 'Launch';
            setAttributes(a, attrs);
            return a;
         }
    };
    
    /**
     * A bootstrap modal dialog constructor.
     * @method Modalator.dialog().
     * @param mixed arg object Dialog configuration.
     * @return <div> The configured bootstrap modal dialog DOM node.
     */
    var dialog = function(arg) {
        var attrs;

        // Modal dialog container div.
        var dialog = document.createElement('div');
        attrs = combinedAttributes(arg.attrs || {}, {
            'data-width': DIALOG_DEFAULT_WIDTH,
            style: 'display:none',
            class: 'modal fade',
            tabindex: '-1'
        });
        setAttributes(dialog, attrs);

        // Modal dialog header.
        var head = document.createElement('div');
        attrs = combinedAttributes(arg.head && arg.head.attrs || {}, {
            class: 'modal-header'
        });
        setAttributes(head, attrs);
        
        // Modal dialog "x" (cancel) button.
        var x = document.createElement('button');
        x.innerHTML = 'x';
        attrs = combinedAttributes(arg.x && arg.x.attrs || {}, {
            type: 'button',
            class: 'close',
            'aria-hidden': 'true',
            'data-dismiss': 'modal'
        });
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
        attrs = combinedAttributes(arg.body && arg.body.attrs || {}, {
            class: 'modal-body'
        });
        setAttributes(body, attrs);

        // Optional body text, before any fields.
        if (arg.body && arg.body.text) {
            var bodyText = document.createElement('div');
            setAttributes(bodyText, arg.body.text.attrs || {});
            bodyText.innerHTML = arg.body.text;
            body.appendChild(bodyText);
        }

        // Modal dialog fields.
        var fieldsLen = arg.fields ? arg.fields.length : 0;
        for (var i = 0; i < fieldsLen; i++) {
            var fieldCfg = arg.fields[i];
            var fieldParent = body;

            var fieldContainerCfg = fieldCfg.container;
            if (fieldContainerCfg) {
                var containerTag = fieldContainerCfg.tag || 'div';
                var container = document.createElement(containerTag);
                setAttributes(container, fieldContainerCfg.attrs || {});
                body.appendChild(container); 
                fieldParent = container;
            }

            var labelCfg = fieldCfg.label;
            if (labelCfg) {
                var label = document.createElement('label');
                label.innerHTML = labelCfg.text || '';
                setAttributes(label, labelCfg.attrs || {});
                fieldParent.appendChild(label);
            }

            attrs = combinedAttributes(fieldCfg.attrs || {}, {
                class: 'form-control'
            });

            if (fieldCfg.type.match(/^(text|password)$/)) {
                var input = document.createElement('input');
                setAttributes(input, attrs);
                fieldParent.appendChild(input);
            }
            else if (fieldCfg.type === 'select') {
                var select = document.createElement('select');
                setAttributes(select, attrs);

                var optsLen = fieldCfg.options ? fieldCfg.options.length : 0;
                for (var n = 0; n < optsLen; n++) {
                    var optCfg = fieldCfg.options[n] || {};
                    var option = document.createElement('option');
                    option.innerHTML = optCfg.text || '';
                    setAttributes(option, optCfg.attrs || {});
                    select.appendChild(option);
                }

                fieldParent.appendChild(select);
            }
        }

        if (body.childNodes.length) { dialog.appendChild(body) }

        // Modal dialog footer.
        var foot = document.createElement('div');
        attrs = combinedAttributes(arg.foot && arg.foot.attrs || {}, {
            class: 'modal-footer'
        });
        setAttributes(foot, attrs);

        // Cancel button.
        var cancelCfg = arg.cancel || {};
        var cancel = document.createElement('button');
        cancel.innerHTML = cancelCfg.text || 'Cancel';
        attrs = combinedAttributes(cancelCfg.attrs || {}, {
            type: 'button',
            'data-dismiss': 'modal',
            class: 'btn'
        });
        setAttributes(cancel, attrs);

        // Affirm button.
        var affirmCfg = arg.affirm || {};
        var affirm = document.createElement('button');
        affirm.innerHTML = affirmCfg.text || 'Submit';

        var defaults = {class: 'btn btn-primary'};
        if (!affirmCfg.attrs || !affirmCfg.attrs.onclick) {
            defaults['data-toggle'] = 'modal';
            defaults.href = '#' + arg.attrs.id;
        }
        attrs = combinedAttributes(affirmCfg.attrs || {}, defaults);
        setAttributes(affirm, attrs);

        foot.appendChild(cancel);
        foot.appendChild(affirm);
        dialog.appendChild(foot);

        return dialog;
    };

    return {
        appendToDOM: appendToDOM,
        launcher: launcher,
        dialog: dialog
    };
})();
