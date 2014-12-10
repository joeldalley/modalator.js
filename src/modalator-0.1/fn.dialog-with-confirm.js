/**
 * @method Modalator.dialogWithConfirm().
 * @param object config A dialog configuration.
 * @return array Pair of (<div>, <div>): the dialog and its confirm dialog.
 */
Modalator.dialogWithConfirm = function(config) {
    'use strict'; 

    // By default, when the dialog affirm button is 
    // clicked, advance to the confirmation dialog.
    var confirmId = config.attrs.id + '-confirm';

    if (!config.affirm) { config.affirm = {attrs: {}} }
    else if (!config.affirm.attrs) { config.affirm.attrs = {} }
    config.affirm.attrs.href = '#' + confirmId;

    var dialog = Modalator.dialog(config);

    var confirmDialog = Modalator.dialog({
        title: {text: 'Are you sure?', tag: 'h3'},
        attrs: {id: confirmId, 'data-width': 200},
        affirm: {
            text: 'Yes', 
            attrs: {onclick: config.confirmCallback}
        },
        cancel: {text: 'No'}
    });

    return [dialog, confirmDialog];
};
