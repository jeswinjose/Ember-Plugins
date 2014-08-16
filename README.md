Ember-plugins
===========

Ember Js is a MVC framework for creating Ambitious web applications(http://emberjs.com/). This repository is aimed at developing some reusable components for ember js applications.

The plugins currently supported are 

1) Infinite scrolling using emberJS.
     Use infinite-scrolling-view.js for infinite scrolling support in your application ,mix this mixin into the particular view you want to get noted when scroll bar reaches bottom of the particular view.It calls getMore function (that your view should impliment) when scrollbar reaches the end so that you can populate more data to the view as needed.
