/*
 * Ember-Data: http://guides.emberjs.com/v1.13.0/object-model/computed-properties-and-aggregate-data/
 */
import Ember from "ember";
import { module, test} from 'qunit';
import startApp from '../helpers/start-app';

var App;

module('ember-data v1.13.0 | computed property', {
  beforeEach: function () {
    App = startApp();
  },
  afterEach: function () {
    Ember.run(App, 'destroy');
  }
});

test('computed property lazy load', function (assert) {
  var car = Ember.Object.extend({
    name: Ember.computed('money', function () {
      return this.get('money') <= 200000 ? 'Audio' : 'Porsche';
    }),
    money: 200000
  }).create();

  assert.equal(car.get('name'), 'Audio', "my first car name is Audio when I have some money");

  car.set('money', Math.pow(2, 64));
  assert.equal(Ember.cacheFor(car, "name"), undefined, "car name should not be update to " +
    "'Porsche' before invoke car.get('name') function");
  assert.equal(car.get('name'), 'Porsche', "my second car name is Porsche when I do not care about money :)");
});

test('computed property depend on object', function (assert) {
  var rectangle = Ember.Object.extend({
    area: Ember.computed('size.height', 'size.width', function () {
      return this.get('size.height') * this.get('size.width');
    }),
    size: {
      height: 10,
      width: 10
    }
  }).create();

  assert.equal(rectangle.get('area'), 100, "the area should be 100");

  rectangle.set('size.height', 50);
  assert.equal(rectangle.get('area'), 500, "the area should be 500 after rectangle.size.height updated");

  rectangle.set('size.width', 20);
  assert.equal(rectangle.get('area'), 1000, "the area should be 1000 after rectangle.size.width updated");

  rectangle.set('size', {height: 1, width: 1});
  assert.equal(rectangle.get('area'), 1, "the area should be 1 after rectangle.size updated");
});

test('set or overwrite computed property', function (assert) {
  var rectangle = Ember.Object.extend({
    area: Ember.computed('size.height', 'size.width', function () {
      return this.get('size.height') * this.get('size.width');
    }),
    size: {
      height: 10,
      width: 10
    }
  }).create();

  assert.equal(rectangle.get('area'), 100, "the area should be 100");

  rectangle.set('area', 0);
  assert.equal(rectangle.get('area'), 0, "the area should be 0 after set property of 'area' ");

  rectangle.set('size', {height: 10, width: 10});
  assert.equal(rectangle.get('area'), 0, "the area still be 0 even if depend property changed");
});

test('computed property depend on a chained object', function (assert) {
  var my = Ember.Object.extend({
    website: Ember.computed('blog.post.paragraph', function () {
      return this.get('blog.id') + this.get('blog.post.id') + (this.get('blog.post.paragraph.id') ? " - " + this.get('blog.post.paragraph.id') : "");
    }),
    blog: {
      id: "",
      post: {
        id: "",
        paragraph: {
          id: ""
        }
      }
    }
  }).create();

  my.set('blog', {id: "http://www.cnblogs.com/cuiyansong/", post: {id: "", paragraph: {id: ""}}});
  assert.equal(my.get('website'), "http://www.cnblogs.com/cuiyansong/", "should be my blog site");

  my.set('blog.post', {id: "p/4550150.html", paragraph: {id: ""}});
  assert.equal(my.get('website'), "http://www.cnblogs.com/cuiyansong/p/4550150.html", "should add post");

  my.set('blog.post.paragraph', {id: "paragraph 3"});
  assert.equal(my.get('website'), "http://www.cnblogs.com/cuiyansong/p/4550150.html - paragraph 3", "should add paragraph");
});

test('computed property depend on @each', function (assert) {
  var Size = Ember.Object.extend({height: 0, width: 0});
  var rectangle = Ember.Object.extend({
    totalArea: Ember.computed('sizeArray.@each', function () {
      return this.get('sizeArray').reduce(function (prev, cur) {
        return prev + Ember.get(cur, 'height') * Ember.get(cur, 'width');
      }, 0);
    }),
    sizeArray: [
      Size.create({height: 10, width: 10}),
      Size.create({height: 10, width: 10})
    ]
  }).create();
  var sizeArray = rectangle.get('sizeArray');

  assert.equal(rectangle.get('totalArea'), 200, "the total area should be 200");

  sizeArray.pushObject(Size.create({height: 10, width: 10}));
  assert.equal(rectangle.get('totalArea'), 300, "the total area should be 300 after added");

  sizeArray.removeAt(0);
  assert.equal(rectangle.get('totalArea'), 200, "the total area should be 200 after removed");

  sizeArray[0].set('height', 20);
  assert.equal(rectangle.get('totalArea'), 200, "the total area should not be changed");

  sizeArray.clear();
  assert.equal(rectangle.get('totalArea'), 0, "the total area should be 0 after reset rectangle.sizeArray");
});

test('computed property depend on []', function (assert) {
  var Size = Ember.Object.extend({height: 0, width: 0});
  var rectangle = Ember.Object.extend({
    totalArea: Ember.computed('sizeArray.[]', function () {
      return this.get('sizeArray').reduce(function (prev, cur) {
        return prev + Ember.get(cur, 'height') * Ember.get(cur, 'width');
      }, 0);
    }),
    sizeArray: [
      Size.create({height: 10, width: 10}),
      Size.create({height: 10, width: 10})
    ]
  }).create();
  var sizeArray = rectangle.get('sizeArray');

  assert.equal(rectangle.get('totalArea'), 200, "the total area should be 200");

  sizeArray.pushObject(Size.create({height: 10, width: 10}));
  assert.equal(rectangle.get('totalArea'), 300, "the total area should be 300 after added");

  sizeArray.removeAt(0);
  assert.equal(rectangle.get('totalArea'), 200, "the total area should be 200 after removed");

  sizeArray[0].set('height', 20);
  assert.equal(rectangle.get('totalArea'), 200, "the total area should not be changed");

  sizeArray.clear();
  assert.equal(rectangle.get('totalArea'), 0, "the total area should be 0 after reset rectangle.sizeArray");
});

test('computed property depend on @each.height', function (assert) {
  var Size = Ember.Object.extend({height: 0, width: 0});
  var rectangle = Ember.Object.extend({
    totalArea: Ember.computed('sizeArray.@each.height', function () {
      return this.get('sizeArray').reduce(function (prev, cur) {
        return prev + Ember.get(cur, 'height') * Ember.get(cur, 'width');
      }, 0);
    }),
    sizeArray: [
      Size.create({height: 10, width: 10}),
      Size.create({height: 10, width: 10})
    ]
  }).create();
  var sizeArray = rectangle.get('sizeArray');

  assert.equal(rectangle.get('totalArea'), 200, "the total area should be 200");

  sizeArray.pushObject(Size.create({height: 10, width: 10}));
  assert.equal(rectangle.get('totalArea'), 300, "the total area should be 300 after added");

  sizeArray.removeAt(0);
  assert.equal(rectangle.get('totalArea'), 200, "the total area should be 200 after removed");

  sizeArray[0].set('height', 20);
  assert.equal(rectangle.get('totalArea'), 300, "the total area should be 300 after 'height' changed");

  sizeArray[0].set('width', 20);
  assert.equal(rectangle.get('totalArea'), 300, "the total area should not be changed after 'width' changed");

  sizeArray.clear();
  assert.equal(rectangle.get('totalArea'), 0, "the total area should be 0 after reset rectangle.sizeArray");
});

test("one computed property depend on another computed property", function (assert) {
  var computedCount = 0;
  var Family = Ember.Object.extend({
    money: 10,
    tax: 0.4,

    childCost: Ember.computed('parentIncome', function () {
      computedCount++;
      return this.get('parentIncome') * 0.1;
    }),

    parentIncome: Ember.computed('money', 'tax', function () {
      computedCount++;
      return this.get('money') - this.get('money') * this.get('tax');
    })
  });
  var family = Family.create({ money: 10000}) ;

  assert.equal(Ember.cacheFor(family, 'parentIncome'), undefined, "should not know parentIncome before asking for parentIncome");
  assert.equal(Ember.cacheFor(family, 'childCost'), undefined, "should not know childCost before asking for childCost");
  assert.equal(computedCount, 0, "should not invoke any computed property");

  assert.equal(family.get('parentIncome'), 6000, "parentIncome should be equal to 9000 after-tax when you asking for parentIncome");
  assert.equal(Ember.cacheFor(family, 'childCost'), undefined, "should not compute childCost before asking for parentIncome");
  assert.equal(computedCount, 1, "should just invoke one time");

  assert.equal(family.get('childCost'), 600, "child may get $600 from parent when asking for childCost");
  assert.equal(computedCount , 2, "should compute childCost once");

  family.set('money', "20000");
  assert.equal(Ember.cacheFor(family, 'parentIncome'), undefined, "should not know parentIncome before asking for parentIncome");
  assert.equal(Ember.cacheFor(family, 'childCost'), undefined, "should not know childCost before asking for childCost");
  assert.equal(computedCount , 2, "should not compute any function");
  assert.equal(family.get('childCost'), 1200, "childCost should be 1200 and parentIncome updated when asking for childCost");
  assert.equal(computedCount , 4, "when asking for childCost, parentIncome should computed");
});





