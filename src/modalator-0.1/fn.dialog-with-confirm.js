Modalator.dialogWithConfirm = function(dialogConfig, confirmCallback) {
    var dialogId = dialogConfig.attrs.id;
    var confirmId = dialogId + '-confirm';

    dialogConfig.attrs.href = '#' + confirmId;
    dialogConfig.attrs.tabindex = '-2';
    var dialog = Modalator.dialog(dialogConfig);

    var confirmDialog = Modalator.dialog({
        title: {text: 'Are you sure?', tag: 'h3'},
        attrs: {id: confirmId, tabindex: '-1', 'data-width': 200},
        affirm: {
            text: 'Yes',
            attrs: {
                onclick: function() {
                    confirmCallback(dialogId, confirmId);
                }
            }
        },
        cancel: {text: 'No'}
    });

    return [dialog, confirmDialog];
};
