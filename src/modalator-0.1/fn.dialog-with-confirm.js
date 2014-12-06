Modalator.dialogWithConfirm = function(dialogConfig, confirmCallback) {
    var dialogId = dialogConfig.attrs.id;
    var confirmId = dialogId + '-confirm';

    dialogConfig.affirm.tabindex = '-2';
    dialogConfig.affirm.href = '#' + confirmId;
    var dialog = Modalator.dialog(dialogConfig);
    Modalator.dialog(dialogId);
    Modalator.dialog(dialogId);

    var confirmDialog = Modalator.dialog({
        title: 'Are you sure?',
        attrs: {id: confirmId, tabindex: '-1', 'data-width': 200},
        affirm: {
            text: 'Yes',
            click: function() {
                confirmCallback(dialogId, confirmId);
            },
        },
        cancel: {text: 'No'}
    });

    return [dialog, confirmDialog];
};
