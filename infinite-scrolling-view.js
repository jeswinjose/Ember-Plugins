/**
 * Little useful mixin which on adding in a view calls the getMore() methord of view on scrollbar reaching the end
 * @class InfiniteScrollingViewMixin
 * @namespace App
 * @extends Ember.Mixin
 */
App.InfiniteScrollingViewMixin = Em.Mixin.create({

  isRequestFired: false,
  //bind scrolling to the view on didInsertElement
  didInsertElement: function() {
    this.bindScrolling();
    this._super();
  },
  //unbind scrolling
  willRemoveElement: function() {
      this.unbindScrolling();
      this._super();
  },

  bindScrolling: function() {
    var _this = this;
    var onScroll = function(){
      return _this.scrolled();
    };
    this.$().bind('touchmove', onScroll);//bind touch and scrollevent
    this.$().bind('scroll', onScroll);
  },

  //called when view is scrolled
  scrolled: function() {
    if(this.isScrolledToBottom()) {
      var _this = this;
      //reload the data
      if(!this.get('isRequestFired')) {
        this.set('isRequestFired', true);
        Em.RSVP.Promise.cast(this.getMore()).then(function() {   //casting if implimenting view doesnt return a promise
           _this.set('isRequestFired', false);
        });
      }

    }
  },

  //checks to see if scrolled to bottom
  isScrolledToBottom: function() {
    var distanceToViewportTop =  this.get('element').scrollHeight-this.get('element').offsetHeight;
    var viewPortTop =  this.$().scrollTop();
    if (viewPortTop === 0) {
      // if we are at the top of the page, don't do
      // the infinite scroll thing
      return false;
    }
    return (distanceToViewportTop-viewPortTop === 0);
  },

  unbindScrolling: function() {
    this.$().unbind('scroll');
    this.$().unbind('touchmove');
  }

});
