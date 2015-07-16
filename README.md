# Knockout NavAway Binding Handler

An **unobtrusive** KnockoutJS Binding Handler for prompting a user with an "You have unsaved work" prompt upon navigating away from a page that may have unsaved viewmodel changes.

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
$ npm install -g karma-cli  # (Optional) Install karma globally for testing
```

To startup karma and run all tests upon saving changes:

```sh
$ npm test
# Or if you installed karma globally
$ karma start
```