/*!
 * Knockout Nav Away Binding Handler v0.0.1
 * https://github.com/dflor003/ko-nav-away
 * (c) Danil Flores <dflor003@gmail.com>
 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
 */

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
                        var $inputs = $('input,textarea, select', $root);
                        $inputs
                            .filter(function() { return ko.dataFor(this) === viewModel; })
                            .each(function() {
                                var key = 'nav-away',
                                    element = this,
                                    context = ko.contextFor(element),
                                    bindings = ko.bindingProvider.instance.getBindings(element, context),
                                    valueBinding = bindings['value'] || bindings['textInput'] || bindings['checked'];

                                if (!valueBinding || !ko.isObservable(valueBinding) || !ko.isWriteableObservable(valueBinding)) {
                                    return;
                                }

                                var original = ko.unwrap(valueBinding),
                                    isArray = original instanceof Array,
                                    data = {
                                        originalValue: !isArray ? original : original.slice(0), // Copy array values instead of reference to array
                                        observable: valueBinding,
                                        isArray: isArray
                                    };

                                data.isDirty = ko.computed({
                                    read: function() {
                                        var currentValue = data.observable(),
                                            originalValue = data.originalValue;

                                        // Check array equality
                                        if (data.isArray) {
                                            if (!currentValue ^ !originalValue) {
                                                return true;
                                            }

                                            if (!currentValue && !originalValue) {
                                                return false;
                                            }

                                            if (currentValue.length !== originalValue.length) {
                                                return true;
                                            }

                                            for(var i = 0; i < currentValue.length; i++) {
                                                if (currentValue[i] !== originalValue[i]) {
                                                    return true;
                                                }
                                            }

                                            return false;
                                        }

                                        // Default
                                        return data.observable() !== data.originalValue;
                                    }
                                });

                                boundObservables.push(data);
                                ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                                    ko.utils.arrayRemoveItem(boundObservables, data);
                                });
                            });
                    }
                }
            }, bindingContext);

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