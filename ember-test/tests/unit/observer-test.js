import Ember from "ember";
import { module, test} from 'qunit';
import startApp from '../helpers/start-app';

var App;

module('ember-data v1.13.0 | observer', {
  beforeEach: function () {
    App = startApp();
  },
  afterEach: function () {
    Ember.run(App, 'destroy');
  }
});

test('observe on Ember.Object with Ember.ComputedProperty', function (assert) {
  var count = 0;
  var content = Ember.Object.extend({
    setName: function (name) {
      Ember.set(this, 'name', name);
    },
    hasName: Ember.computed.alias('name'),
    name: null
  }).create();
  content.addObserver('name', function(){
    count++;
    assert.ok(this.get('hasName'), "name should not be null");
  });

  content.setName('Stephen');
  assert.ok(count > 0, "observer should be invoke");
});
