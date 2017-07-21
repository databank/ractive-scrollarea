
Ractive.components.scrollarea = Ractive.extend({
	isolated: true,
	template: "\
		<div class='viewport {{class}}' style='position: relative;overflow: hidden;{{style}}' on-mousewheel='scroll'>\
				<div class='viewport-inner' style='position: relative;white-space: nowrap;top: {{top}}px; left: {{left}}px;'>\
					{{ yield }}\
				</div>\
				<span style='display: inline-block;' class='{{scrollbar_class}}' style='height: {{scrollbar.height}}%; top: {{scrollbar.top}}%'></span>\
			</div>",

	scroll: function(v) {
		this.fire('scroll', { dx: 0, dy: v })
	},
	update_scroll: function(event) {
		if (!event)
			event = { dx: 0, dy: 0 }


		var outer = this.find( '.viewport' ).getBoundingClientRect();
		var inner = this.find( '.viewport-inner' ).getBoundingClientRect();

		if (inner.height < outer.height) {
			this.set('scrollbar.height', 0)

			// bugfix: when area shrinks and scrollbar no longer needed, reset scroll to top
			this.set('scrollbar.top', 0 )
			this.set('top', 0 )
			
			return false;
		}

		//var minLeft = outer.width - inner.width;
		var minTop = outer.height - inner.height;


		//var left = Math.max( minLeft, Math.min( 0, this.get( 'left' ) + event.dx ) )
		var top = Math.max( minTop, Math.min( 0, this.get( 'top' ) + event.dy ) )
		var scrollbar_height = ( outer.height * 100 ) / inner.height;
		var scrollbar_remaining_100percent = 100 - scrollbar_height;
		var scroll_percent = Math.abs(Math.round(top*100/minTop))

		this.set('scrollbar.top', (scroll_percent * scrollbar_remaining_100percent)/100  )
		this.set('scrollbar.height', scrollbar_height )
		this.set({
			//left: left,
			top: top
		});
	},
	onrender: function () {
		//console.log(this.partials.content)
		var ractive = this
		this.observer = new MutationObserver(function() {ractive.update_scroll()})
		this.observer.observe(this.find('.viewport-inner'), {childList: true,subtree: true,characterData: true,attributes: false,})

		this.on( 'scroll', function ( event ) {

			if (event.original)
				event.original.preventDefault(); // prevent entire page from scrolling

			this.update_scroll(event)

		})
		this.update_scroll()
	},
	data: {
		left: 0,
		top: 0
	}
})
