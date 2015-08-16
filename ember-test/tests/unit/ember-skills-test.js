import Ember from "ember";
import { module, test} from 'qunit';
import startApp from '../helpers/start-app';

var App;

module('ember.js test | ember skills', {
  beforeEach: function () {
    App = startApp();
  },
  afterEach: function () {
    Ember.run(App, 'destroy');
  }
});

test('get ember computed property', function (assert) {
  var o = Ember.Object.extend({
    name: Ember.computed('firstName', 'lastName', function () {
      return this.get('firstName') + this.get('lastName');
    }),
    firstName: "Ember",
    lastName: ".js"
  }).create();

  assert.notEqual(o.name, "", "do not use o.name to get property");
  assert.equal(o.get('name'), "Ember.js", "used o.get('name') to get property");
});

test('get unknown object property by Ember.get function', function (assert) {
  var o1 = {name: "Ember.js"};
  var o2 = Ember.Object.extend({
    name: Ember.computed(function(){
      return "Ember.js";
    })
  }).create();

  assert.equal(o1.name, "Ember.js", "o1.name function should be ok with javascript object");
  assert.notEqual(o2.name, "Ember.js", "o2.name function should not be ok with Ember object");

  assert.equal(o1.get, undefined, "o1.get function should not be ok with javascript object");
  assert.equal(o2.get('name'), "Ember.js", "o2.get function should be ok with Ember object");

  assert.equal(Ember.get(o1, "name"), "Ember.js", "Ember.get function should be ok with javascript object");
  assert.equal(Ember.get(o2, "name"), "Ember.js", "Ember.get function should be ok with Ember object");
});
