(function(exports) {

    function Option(code, desc) {
        this.code = code;
        this.desc = desc;
    }

    var suffixes = [
        new Option('MR', 'Mr.'),
        new Option('MS', 'Ms.'),
        new Option('MRS', 'Mrs.'),
        new Option('JR', 'Jr.'),
        new Option('SR', 'Sr.'),
        new Option('ESQ', 'Esq.')
    ];

    function PersonInfo() {

        this.firstName = ko.observable('Bob');
        this.middleName = ko.observable('The');
        this.lastName = ko.observable('Builder');
        this.suffix = ko.observable(suffixes[5]);

        this.email = ko.observable('bob@bobsbuilders.com');
        this.notes = ko.observable('Lorem ipsum...');

        this.sendWelcomeEmail = ko.observable(true);
        this.favoriteFood = ko.observable('chinese');
        this.itemsToSend = ko.observableArray(['newsletter']);
        this.isDirty = ko.observable(false);
    }

    PersonInfo.prototype = {
        submit: function () {
            alert('Saved ' + this.firstName + ' ' + this.lastName + '!');
        }
    };

    exports.sample = {
        PersonInfo: PersonInfo,
        Option: Option,
        Suffixes: suffixes
    };
})(window)