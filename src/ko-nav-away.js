(function () {

    var allFieldChangeObservables = [],
        oldOnUnload = undefined;

    ko.bindingHandlers.navaway = {
        init: function(root, valueAccessor, allBindings, viewModel, bindingContext) {
            var $root = $(root),
                passedDirtyTracker = valueAccessor(),
                boundObservables = ko.observableArray([]),
                anyFieldsChanged = ko.computed({
                    read: function () {
                        var fields = boundObservables();
                        for(var i = 0; i < fields.length; i++) {
                            if (fields[i].isDirty()) {
                                return true;
                            }
                        }

                        return false;
                    },
                    deferEvaluation: true
                });

            if (ko.isWriteableObservable(passedDirtyTracker)) {
                anyFieldsChanged.subscribe(function (newVal) {
                    passedDirtyTracker(newVal);
                });
            }

            allFieldChangeObservables.push(anyFieldsChanged);
            ko.applyBindingsToNode(root, {
                template: {
                    data: viewModel,
                    afterRender: function () {
                        var $inputs = $('input,textarea', $root);
                        $inputs
                            .filter(function() { return ko.dataFor(this) === viewModel; })
                            .each(function() {
                                var key = 'nav-away',
                                    element = this,
                                    context = ko.contextFor(element),
                                    bindings = ko.bindingProvider.instance.getBindings(element, context),
                                    valueBinding = bindings['value'] || bindings['textInput'];

                                if (!valueBinding || !ko.isObservable(valueBinding) || !ko.isWriteableObservable(valueBinding)) {
                                    return;
                                }

                                var data = {
                                    originalValue: ko.unwrap(valueBinding),
                                    observable: valueBinding
                                };
                                data.isDirty = ko.computed({
                                    read: function() { return data.observable() !== data.originalValue; }
                                });

                                boundObservables.push(data);
                                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                                    ko.utils.arrayRemoveItem(boundObservables, data);
                                });
                            });
                    }
                }
            });

            if (window.onbeforeunload !== ko.bindingHandlers.navaway.checkOnWindowUnload) {
                oldOnUnload = window.onbeforeunload;
                window.onbeforeunload = ko.bindingHandlers.navaway.checkOnWindowUnload;
            }

            return { controlsDescendantBindings: true };
        },
        checkOnWindowUnload: function () {
            for(var i = 0; i < allFieldChangeObservables.length; i++) {
                var isDirty = allFieldChangeObservables[i]();
                if (isDirty === true) {
                    return 'Are you sure you want to leave the page? You may have unsaved changes.';
                }
            }

            return typeof oldOnUnload === 'function' ? oldOnUnload() : undefined;
        }
    };

})();