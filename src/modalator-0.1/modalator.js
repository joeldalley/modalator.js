var Modalator = (function() {
    var dialogs = {};

    var appendToDOM = function(children, root) {
        if (typeof root === 'undefined') {
            root = document.getElementsByTagName('body')[0];
        }
        for (var i = 0; i < children.length; i++) {
            root.appendChild(children[i]);
        }
    }

    var launcher = {
        button: function(config) {
            var btnClass = config.class || 'btn btn-primary';
            var btn = document.createElement('button');
            btn.setAttribute('data-toggle', 'modal');
            btn.setAttribute('href', config.href);
            btn.setAttribute('class', btnClass);
            btn.setAttribute('type', 'button');
            btn.innerHTML = config.text;;
            return btn;
        },
    };

    var dialog = function(arg) {
        if (typeof arg === 'string') {
            if (typeof dialogs[arg] !== 'undefined') {
                return dialogs[arg];
            }
            else {
                throw "No registered dialog `" + arg + "`";
            }
        }

        var dialogClass = arg.attrs.class || 'modal fade';
        var dialog = document.createElement('div');
        dialog.setAttribute('id', arg.attrs.id);
        dialog.setAttribute('style', 'display:none');
        dialog.setAttribute('class', dialogClass);
        dialog.setAttribute('tabindex', arg.attrs.tabindex);
        dialog.setAttribute('data-width', arg.attrs['data-width']);

        var head = document.createElement('div');
        head.setAttribute('class', 'modal-header');
        
        var x = document.createElement('button');
        x.setAttribute('type', 'button');
        x.setAttribute('class', 'close');
        x.setAttribute('data-dismiss', 'modal');
        x.setAttribute('aria-hidden', 'true');
        x.innerHTML = 'x';
        head.appendChild(x);

        var h3 = document.createElement('h3');
        h3.innerHTML = arg.title;
        head.appendChild(h3);
        dialog.appendChild(head);

        var body = document.createElement('div');
        body.setAttribute('class', 'modal-body');

        if (!arg.fields) { arg.fields = [] }
        for (var i = 0; i < arg.fields.length; i++) {
            var field = arg.fields[i];

            var label = document.createElement('label');
            label.innerHTML = field.label;
            body.appendChild(label);

            if (field.type.match(/^(text|password)$/)) {
                var input = document.createElement('input');
                input.setAttribute('name', field.name);
                input.setAttribute('type', field.type);
                input.setAttribute('value', field.value || '');
                input.setAttribute('class', field.class || '');
                body.appendChild(input);
            }
            else if (field.type === 'select') {
                var select = document.createElement('select');
                select.setAttribute('name', field.name);
                select.setAttribute('class', field.class || '');

                if (!field.options) { field.options = [] }
                for (var n = 0; n < field.options.length; n++) {
                    var option = document.createElement('option');
                    var value = field.options[n].value || '';
                    option.setAttribute('value', value);
                    option.innerHTML = field.options[n].text || ''
                    select.appendChild(option);
                }
                body.appendChild(select);
            }
        }
        dialog.appendChild(body);

        var foot = document.createElement('div');
        foot.setAttribute('class', 'modal-footer');

        var cancelClass = arg.cancel && arg.cancel.class || 'btn';
        var cancel = document.createElement('button');
        cancel.setAttribute('type', 'button');
        cancel.setAttribute('data-dismiss', 'modal');
        cancel.setAttribute('class', cancelClass);
        cancel.innerHTML = arg.cancel && arg.cancel.text || 'Cancel';
        foot.appendChild(cancel);

        var affirmClass = arg.affirm.class || 'btn btn-primary';
        var affirm = document.createElement('button');
        affirm.setAttribute('class', affirmClass);
        affirm.innerHTML = arg.affirm.text || 'Submit';
        if (arg.affirm.click) {
            affirm.onclick = arg.affirm.click;
        }
        else {
            affirm.setAttribute('data-toggle', 'modal');
            affirm.setAttribute('href', arg.affirm.href);
        }
        foot.appendChild(affirm);
        dialog.appendChild(foot);

        dialogs[arg.attrs.id] = dialog;
        return dialog;
    };

    return {
        appendToDOM: appendToDOM,
        launcher: launcher,
        dialog: dialog
    };
})();
