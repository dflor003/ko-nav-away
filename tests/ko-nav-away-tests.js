(function (exports) {

    function Option(code, desc) {
        this.code = code;
        this.desc = desc;
    }

    function MyViewModel() {
        this.isDirty = ko.observable(false);
        this.stringField = ko.observable('Bob');
        this.arrayField = ko.observableArray([]);
        this.numberField = ko.observable(2);
        this.boolField = ko.observable(true);
        this.objectField = ko.observable(MyViewModel.options[1]);
        this.nonObservable = 'Foo';
    }

    MyViewModel.options = [
        new Option('FOO', 'The foo'),
        new Option('BAR', 'The bar'),
        new Option('BAZ', 'The baz')
    ];

    exports.MyViewModel = MyViewModel;

    var DomUtils = {
        /**
         * Sets the value on the input element and ensures it fires events that knockout can understand.
         * @param input Input DOM element
         * @param value New value for element
         */
        setValue: function(input, value) {
            input = input && typeof input.jquery !== 'undefined' ? input[0] : input;
            input.value = value;
            ko.utils.triggerEvent(input, 'change');
        },

        /**
         * Select a value on the given SELECT element with the given index
         * @param select The SELECT element
         * @param index The index of the option to select
         */
        setSelected: function (select, index) {
            select = select && typeof select.jquery !== 'undefined' ? select[0] : select;
            select.selectedIndex = index;
            ko.utils.triggerEvent(select, 'change');
        },

        /**
         * Click on an input such as a radio button or checkbox.
         * @param input The input to click on
         */
        click: function (input) {
            input = input && typeof input.jquery !== 'undefined' ? input[0] : input;
            ko.utils.triggerEvent(input, 'click');
        }
    };

    describe('ko-nav-away', function () {
        var $sandbox,
            setup;

        beforeEach(function () {
            // Prevent actual window onbeforeunload getting triggered
            spyOn(ko.bindingHandlers.navaway, 'checkOnWindowUnload');

            // Some KO binding handlers (i.e. value) update the observable values in a setTimeout to get around
            // browser-specific quirks. To get around this, make setTimeout behave synchronously.
            spyOn(window, 'setTimeout').and.callFake(function (callback) {
                callback();
            });

            // DOM sandbox
            $sandbox = sandbox({
                class: 'container',
                'data-bind': 'navaway: isDirty'
            });

            // Shortcut for setting up a DOM-based test
            setup = function (model, elements) {
                $sandbox.append(elements);
                ko.applyBindings(model, $sandbox[0]);
            };
        });

        describe('with text fields', function () {

            it('should track changes with "value" binding', function () {
                // Arrange
                var model = new MyViewModel();
                setup(model, [
                    $('<input id="field" type="text" data-bind="value: stringField" />')
                ]);
                var $input = $sandbox.find('#field');

                // Precondition
                expect(model.isDirty()).toBe(false);
                expect(model.stringField()).toBe('Bob');
                expect($input.val()).toBe('Bob');

                // Act
                DomUtils.setValue($input, 'New value');

                // Assert
                expect($input).toHaveValue('New value');
                expect(model.isDirty()).toBe(true);
                expect(model.stringField()).toBe('New value');
            });

            it('should track changes with "textInput" binding', function () {
                // Arrange
                var model = new MyViewModel();
                setup(model, [
                    $('<input id="field" type="text" data-bind="textInput: stringField" />')
                ]);
                var $input = $sandbox.find('#field');

                // Precondition
                expect(model.isDirty()).toBe(false);
                expect(model.stringField()).toBe('Bob');
                expect($input.val()).toBe('Bob');

                // Act
                DomUtils.setValue($input, 'New value');

                // Assert
                expect($input).toHaveValue('New value');
                expect(model.isDirty()).toBe(true);
                expect(model.stringField()).toBe('New value');
            });

            it('should revert dirty flag when value set back to initial with "value" binding', function () {
                // Arrange
                var model = new MyViewModel();
                setup(model, [
                    $('<input id="field" type="text" data-bind="value: stringField" />')
                ]);
                var $input = $sandbox.find('#field');
                DomUtils.setValue($input, 'Changed value');

                // Precondition
                expect(model.isDirty()).toBe(true);
                expect(model.stringField()).toBe('Changed value');
                expect($input.val()).toBe('Changed value');

                // Act
                DomUtils.setValue($input, 'Bob');

                // Assert
                expect($input).toHaveValue('Bob');
                expect(model.isDirty()).toBe(false);
                expect(model.stringField()).toBe('Bob');
            });

            it('should revert dirty flag when value set back to initial with "textInput" binding', function () {
                // Arrange
                var model = new MyViewModel();
                setup(model, [
                    $('<input id="field" type="text" data-bind="textInput: stringField" />')
                ]);
                var $input = $sandbox.find('#field');
                DomUtils.setValue($input, 'Changed value');

                // Precondition
                expect(model.isDirty()).toBe(true);
                expect(model.stringField()).toBe('Changed value');
                expect($input.val()).toBe('Changed value');

                // Act
                DomUtils.setValue($input, 'Bob');

                // Assert
                expect($input).toHaveValue('Bob');
                expect(model.isDirty()).toBe(false);
                expect(model.stringField()).toBe('Bob');
            });
        });

        describe('with textarea fields', function () {
            it('should track changes with "value" binding', function () {
                // Arrange
                var model = new MyViewModel();
                setup(model, [
                    $('<textarea id="field" data-bind="value: stringField">')
                ]);
                var $textarea = $sandbox.find('#field');

                // Precondition
                expect(model.isDirty()).toBe(false);
                expect(model.stringField()).toBe('Bob');
                expect($textarea.val()).toBe('Bob');

                // Act
                DomUtils.setValue($textarea, 'New value');

                // Assert
                expect($textarea).toHaveValue('New value');
                expect(model.isDirty()).toBe(true);
                expect(model.stringField()).toBe('New value');
            });

            it('should revert dirty flag when value set back to initial with "value" binding', function () {
                // Arrange
                var model = new MyViewModel();
                setup(model, [
                    $('<textarea id="field" data-bind="value: stringField">')
                ]);
                var $textarea = $sandbox.find('#field');
                DomUtils.setValue($textarea, 'Changed value');

                // Precondition
                expect(model.isDirty()).toBe(true);
                expect(model.stringField()).toBe('Changed value');
                expect($textarea.val()).toBe('Changed value');

                // Act
                DomUtils.setValue($textarea, 'Bob');

                // Assert
                expect($textarea).toHaveValue('Bob');
                expect(model.isDirty()).toBe(false);
                expect(model.stringField()).toBe('Bob');
            });
        });

        describe('with checkbox fields', function () {

            describe('for boolean field', function () {
                it('should track changes with "checked" binding', function () {
                    // Arrange
                    var model = new MyViewModel();
                    setup(model, [
                        $('<input type="checkbox" id="field" data-bind="checked: boolField">')
                    ]);
                    var $checkbox = $sandbox.find('#field');

                    // Precondition
                    expect(model.isDirty()).toBe(false);
                    expect(model.boolField()).toBe(true);
                    expect($checkbox).toBeChecked();

                    // Act
                    DomUtils.click($checkbox);

                    // Assert
                    expect($checkbox).not.toBeChecked();
                    expect(model.isDirty()).toBe(true);
                    expect(model.boolField()).toBe(false);
                });

                it('should revert dirty flag when value set back to initial with "checked" binding', function () {
                    // Arrange
                    var model = new MyViewModel();
                    setup(model, [
                        $('<input type="checkbox" id="field" data-bind="checked: boolField">')
                    ]);
                    var $checkbox = $sandbox.find('#field');
                    DomUtils.click($checkbox);

                    // Precondition
                    expect(model.isDirty()).toBe(true);
                    expect(model.boolField()).toBe(false);
                    expect($checkbox).not.toBeChecked();

                    // Act
                    DomUtils.click($checkbox);

                    // Assert
                    expect($checkbox).toBeChecked();
                    expect(model.isDirty()).toBe(false);
                    expect(model.boolField()).toBe(true);
                });
            });

            describe('for array-bound fields', function () {
                it('should track changes with "checked" binding', function () {
                    // Arrange
                    var model = new MyViewModel();
                    model.arrayField(['bar']);
                    setup(model, [
                        $('<input type="checkbox" id="field1" value="foo" data-bind="checked: arrayField">'),
                        $('<input type="checkbox" id="field2" value="bar" data-bind="checked: arrayField">'),
                        $('<input type="checkbox" id="field3" value="baz" data-bind="checked: arrayField">')
                    ]);
                    var $foo = $sandbox.find('#field1'),
                        $bar = $sandbox.find('#field2'),
                        $baz = $sandbox.find('#field3');

                    // Precondition
                    expect(model.isDirty()).toBe(false);
                    expect(model.arrayField()).toEqual(['bar']);
                    expect($foo).not.toBeChecked();
                    expect($bar).toBeChecked();
                    expect($baz).not.toBeChecked();

                    // Act
                    DomUtils.click($foo);

                    // Assert
                    expect(model.isDirty()).toBe(true);
                    expect(model.arrayField()).toEqual(['bar', 'foo']);
                    expect($foo).toBeChecked();
                    expect($bar).toBeChecked();
                    expect($baz).not.toBeChecked();
                });

                it('should revert dirty flag when value set back to initial with "checked" binding', function () {
                    // Arrange
                    var model = new MyViewModel();
                    model.arrayField(['bar']);
                    setup(model, [
                        $('<input type="checkbox" id="field1" value="foo" data-bind="checked: arrayField">'),
                        $('<input type="checkbox" id="field2" value="bar" data-bind="checked: arrayField">'),
                        $('<input type="checkbox" id="field3" value="baz" data-bind="checked: arrayField">')
                    ]);
                    var $foo = $sandbox.find('#field1'),
                        $bar = $sandbox.find('#field2'),
                        $baz = $sandbox.find('#field3');
                    DomUtils.click($baz);

                    // Precondition
                    expect(model.isDirty()).toBe(true);
                    expect(model.arrayField()).toEqual(['bar', 'baz']);
                    expect($foo).not.toBeChecked();
                    expect($bar).toBeChecked();
                    expect($baz).toBeChecked();

                    // Act
                    DomUtils.click($baz);

                    // Assert
                    expect(model.isDirty()).toBe(false);
                    expect(model.arrayField()).toEqual(['bar']);
                    expect($foo).not.toBeChecked();
                    expect($bar).toBeChecked();
                    expect($baz).not.toBeChecked();
                });
            });
        });

        describe('with radio button fields', function () {
            it('should track changes with "checked" binding', function () {
                // Arrange
                var model = new MyViewModel();
                setup(model, [
                    $('<input type="radio" id="field1" name="radio-group" data-bind="checked: numberField, checkedValue: 1">'),
                    $('<input type="radio" id="field2" name="radio-group" data-bind="checked: numberField, checkedValue: 2">'),
                    $('<input type="radio" id="field3" name="radio-group" data-bind="checked: numberField, checkedValue: 3">')
                ]);
                var $rdo1 = $sandbox.find('#field1'),
                    $rdo2 = $sandbox.find('#field2'),
                    $rdo3 = $sandbox.find('#field3');

                // Precondition
                expect(model.isDirty()).toBe(false);
                expect(model.numberField()).toBe(2);
                expect($rdo1).not.toBeChecked();
                expect($rdo2).toBeChecked();
                expect($rdo3).not.toBeChecked();

                // Act
                DomUtils.click($rdo1);

                // Assert
                expect(model.isDirty()).toBe(true);
                expect(model.numberField()).toBe(1);
                expect($rdo1).toBeChecked();
                expect($rdo2).not.toBeChecked();
                expect($rdo3).not.toBeChecked();
            });

            it('should revert dirty flag when value set back to initial with "checked" binding', function () {
                // Arrange
                var model = new MyViewModel();
                setup(model, [
                    $('<input type="radio" id="field1" name="radio-group" data-bind="checked: numberField, checkedValue: 1">'),
                    $('<input type="radio" id="field2" name="radio-group" data-bind="checked: numberField, checkedValue: 2">'),
                    $('<input type="radio" id="field3" name="radio-group" data-bind="checked: numberField, checkedValue: 3">')
                ]);
                var $rdo1 = $sandbox.find('#field1'),
                    $rdo2 = $sandbox.find('#field2'),
                    $rdo3 = $sandbox.find('#field3');
                DomUtils.click($rdo3);

                // Precondition
                expect(model.isDirty()).toBe(true);
                expect(model.numberField()).toBe(3);
                expect($rdo1).not.toBeChecked();
                expect($rdo2).not.toBeChecked();
                expect($rdo3).toBeChecked();

                // Act
                DomUtils.click($rdo2);

                // Assert
                expect(model.isDirty()).toBe(false);
                expect(model.numberField()).toBe(2);
                expect($rdo1).not.toBeChecked();
                expect($rdo2).toBeChecked();
                expect($rdo3).not.toBeChecked();
            });
        });

        describe('with dropdown lists', function () {
            describe('that are object-based lists', function () {
                it('should track changes with "value" binding', function () {
                    // Arrange
                    var model = new MyViewModel();
                    setup(model, [
                        $('<select id="field" data-bind="value: objectField, options: MyViewModel.options, optionsText: \'desc\', optionsCaption: \'Select a value...\'" />')
                    ]);
                    var $select = $sandbox.find('#field');

                    // Precondition
                    expect(model.isDirty()).toBe(false);
                    expect(model.objectField()).toBe(MyViewModel.options[1]);
                    expect($select.children('option:contains("The bar")')).toBeSelected();

                    // Act
                    DomUtils.setSelected($select, 1);

                    // Assert
                    expect(model.isDirty()).toBe(true);
                    expect(model.objectField()).toBe(MyViewModel.options[0]);
                    expect($select.children('option:contains("The foo")')).toBeSelected();
                });

                it('should revert dirty flag when value set back to initial with "value" binding', function () {
                    // Arrange
                    var model = new MyViewModel();
                    setup(model, [
                        $('<select id="field" data-bind="value: objectField, options: MyViewModel.options, optionsText: \'desc\', optionsCaption: \'Select a value...\'" />')
                    ]);
                    var $select = $sandbox.find('#field');
                    DomUtils.setSelected($select, 3);

                    // Precondition
                    expect(model.isDirty()).toBe(true);
                    expect(model.objectField()).toBe(MyViewModel.options[2]);
                    expect($select.children('option:contains("The baz")')).toBeSelected();

                    // Act
                    DomUtils.setSelected($select, 2);

                    // Assert
                    expect(model.isDirty()).toBe(false);
                    expect(model.objectField()).toBe(MyViewModel.options[1]);
                    expect($select.children('option:contains("The bar")')).toBeSelected();
                });
            });

            describe('that are value-based lists', function () {
                it('should track changes with "value" binding', function () {
                    // Arrange
                    var model = new MyViewModel();
                    model.stringField('BAZ');
                    setup(model, [
                        $('<select id="field" data-bind="value: stringField, options: MyViewModel.options, optionsValue: \'code\', optionsText: \'desc\', optionsCaption: \'Select a value...\'" />')
                    ]);
                    var $select = $sandbox.find('#field');

                    // Precondition
                    expect(model.isDirty()).toBe(false);
                    expect(model.stringField()).toBe('BAZ');
                    expect($select.children('option:contains("The baz")')).toBeSelected();

                    // Act
                    DomUtils.setSelected($select, 2);

                    // Assert
                    expect(model.isDirty()).toBe(true);
                    expect(model.stringField()).toBe('BAR');
                    expect($select.children('option:contains("The bar")')).toBeSelected();
                });

                it('should revert dirty flag when value set back to initial with "value" binding', function () {
                    // Arrange
                    var model = new MyViewModel();
                    model.stringField('BAZ');
                    setup(model, [
                        $('<select id="field" data-bind="value: stringField, options: MyViewModel.options, optionsValue: \'code\', optionsText: \'desc\', optionsCaption: \'Select a value...\'" />')
                    ]);
                    var $select = $sandbox.find('#field');
                    DomUtils.setSelected($select, 0);

                    // Precondition
                    expect(model.isDirty()).toBe(true);
                    expect(model.stringField()).toBe(undefined);
                    expect($select.children('option:contains("Select a value...")')).toBeSelected();

                    // Act
                    DomUtils.setSelected($select, 3);

                    // Assert
                    expect(model.isDirty()).toBe(false);
                    expect(model.stringField()).toBe('BAZ');
                    expect($select.children('option:contains("The baz")')).toBeSelected();
                });
            });
        });
    });

})(window);