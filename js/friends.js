(function($) {
	window.Friend = Backbone.Model.extend({});
	
	window.Friends = Backbone.Collection.extend({
		model: Friend,
		url: "http://api.jabbslad.com/friends",
		parse: function(response) {
			var resp = [];
			$.each(response, function(obj) {
				response[obj].gamertag = obj;
				resp.push(response[obj]);
			});
			
			return _.sortBy(resp, function(friend) {
				return "" + ((friend.online=="true") ? 0 : 1) + friend.gamertag.toLowerCase();
			});
		}
	});
	
	window.friends = new Friends();
	
	$(document).ready(function() {
		
		window.FriendView = Backbone.View.extend({
			template: _.template($("#friend-template").html()),
			tagName: 'li',
			className: 'friend',
			
			initialize: function() {
				_.bindAll(this, 'render');
			},
			
			render: function() {
				$(this.el).addClass((this.model.get('online')=="true") ? "online" : "offline").html(this.template(this.model.toJSON()));
				return this;
			}
		});
		
		window.FriendsListView = Backbone.View.extend({
			template: _.template($("#friends-list-template").html()),
			
			initialize: function() {
				_.bindAll(this, 'render');
				this.collection.bind('reset', this.render);
			},
			
			render: function() {
				var $friends,
				collection = this.collection;
				$(this.el).html(this.template({}));
				$friends = this.$(".friends");
				this.collection.each(function(friend) {
					var view = new FriendView({
						model: friend,
						collection: collection
					});
					$friends.append(view.render().el);
				})
				return this;
			}
		});
		
		window.XboxFriends = Backbone.Router.extend({
			routes: {
				'': 'home'
			},
			
			initialize: function() {
				this.friendsListView = new FriendsListView({
					collection: window.friends
				});
			},
			
			home: function() {
				$('#container').empty();
				$('#container').append(this.friendsListView.render().el);
			}
		});
		
		window.App = new XboxFriends();
		Backbone.history.start();
	});
})(jQuery);
