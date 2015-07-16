# Knockout NavAway Binding Handler
An **unobtrusive** KnockoutJS Binding Handler for prompting a user with an "You have unsaved work" prompt upon navigating away from a page that may have unsaved viewmodel changes.

## TODO
This project is a work in progress at the moment. Here are a few pending tasks:

* Host the example page.
* Write up the usage documentation.
* Expose a ```ko.navaway``` object:
  * Allow consumers to update what the initial state is (i.e. ajax save and now you need what's on the page to be the initial state). ```ko.navaway.updateToCurrent()```
  * Allow consumers to query if there are any changes on the page. ```ko.navaway.pageDirty()```
  * Allow consumers to programmatically reset the page to its original state. ```ko.navaway.reset()```
* More test cases.
* More jasmine tests.

## Contributing
Clone the repository using your favorite tool.

Development Dependencies:

* NodeJS
* Bower
* Karma-CLI (Optional)

Run the following commands to set everything up:

```sh
$ npm install               # Install node modules
$ bower install             # Install client-side dependencies
$ npm install -g jake       # Install jake globally for build tools
$ npm install -g karma-cli  # (Optional) Install karma globally for testing
```

To startup karma and run all tests upon saving changes:

```sh
$ npm test
# Or if you installed karma globally
$ karma start
```

Updating release:

```sh
$ jake build # Make sure you have jake installed globally
```