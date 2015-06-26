(function(exports) {

    function PersonInfo() {

        this.firstName = ko.observable('Bob');
        this.middleName = ko.observable('The');
        this.lastName = ko.observable('Builder');

        this.email = ko.observable('bob@bobsbuilders.com');
        this.notes = ko.observable('Lorem ipsum...');

        this.sendWelcomeEmail = ko.observable(true);
        this.favoriteFood = ko.observable('chinese');
        this.isDirty = ko.observable(false);
    }

    PersonInfo.prototype = {
        submit: function () {
            alert('Saved ' + this.firstName + ' ' + this.lastName + '!');
        }
    };

    exports.sample = {
        PersonInfo: PersonInfo
    };
})(window)