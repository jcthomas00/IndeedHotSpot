//file that bridges gap b/w ORM and controller

//import our custon ORM
var orm = require("../config/orm.js");

//Create a controller object with 3 abilities: add, update and select
var users = {

};

//package model for use by the controller
module.exports = users;