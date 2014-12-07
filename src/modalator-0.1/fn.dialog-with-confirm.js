/**
 * @method Modalator.dialogWithConfirm().
 * @param object dialogConfig A dialog configuration.
 * @param function confirmCallback A callback function, which accepts two
 *                 arguments: the dialog and its confirm dialog div ids.
 * @return array Pair of (<div>, <div>): the dialog and its confirm dialog.
 */
Modalator.dialogWithConfirm = function(dialogConfig, confirmCallback) {
    var dialogId = dialogConfig.attrs.id;
    var confirmId = dialogId + '-confirm';
 
    // By default, when the dialog affirm button is 
    // clicked, advance to the confirmation dialog.
    dialogConfig.attrs.href = '#' + confirmId;

    var dialog = Modalator.dialog(dialogConfig);

    var onConfirmClick = function() { 
        confirmCallback(dialogId, confirmId)
    };

    var confirmDialog = Modalator.dialog({
        title: {text: 'Are you sure?', tag: 'h3'},
        attrs: {id: confirmId, 'data-width': 200},
        affirm: {text: 'Yes', attrs: {onclick: onConfirmClick}},
        cancel: {text: 'No'}
    });

    return [dialog, confirmDialog];
};
