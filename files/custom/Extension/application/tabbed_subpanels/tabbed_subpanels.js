$('ul.subpanel_list').css('visibility','hidden');

var tsp = new TabbedSubPanels();

$(document).ready( function()
{
	d_ready = true;

	if(tsp.subpanels_present() )
	{
		tsp.subpanel_count();
		tsp.subpanels_finished_loading_count();

		if( !tsp.already_executed_check() )
		{	tsp.run();
		}
	}
});


/*
$(document).ajaxComplete( function()
{
	if(tsp.subpanels_present() )
	{
		tsp.subpanel_count();
		tsp.subpanels_finished_loading_count();

		if( !tsp.already_executed_check() )
		{	tsp.run();
		}
	}
});
*/


function TabbedSubPanels()
{
	that_tsp   = this;
	this.cache = [];

	this.cache_and_log = function(name, value)
	{
		this.cache[name] = value;
		console.log('TSP - ' + name + ' = ' + value );
	}


	// check to ensure that there are subpanels on the page to process
	this.subpanels_present = function()
	{
		var present = this.cache['subpanels_present'];

		if(typeof present === 'undefined' )
		{	present   = false;
			subpanels = $('#subpanel_list').html();

			if(subpanels !== undefined)
			{	present = true;
			}
		}

		var return_val = present;

		this.cache_and_log('subpanels_present', return_val);
		return return_val;
	};


	// return the number of subpanels present on page
	this.subpanel_count = function()
	{
		var count = this.cache['subpanel_count'];

		if(typeof count === 'undefined' )
		{	count = 0;
			if(this.subpanels_present() )
			{
				console.log('counting subpanels');
				content = $('ul#subpanel_list').html();
				count   = $('ul#subpanel_list').children().length;
			}
		}
		var return_val = count;
//		alert(count);
//		alert(content);

		this.cache_and_log('subpanel_count', return_val);
		return return_val;
	};


	// return the number of subpanels that have finished loading
	this.subpanels_finished_loading_count = function()
	{
		var count = 0;

		console.log('counting footable-loaded subpanels');
		if(this.subpanels_present() )
		{
			count = $('ul#subpanel_list .footable-loaded').length;
		}

		var return_val = count;

		this.cache_and_log('subpanels_finished_loading_count', return_val);
		return return_val;
	};


	// check to see if we have already executed this.run()
	this.already_executed_check = function()
	{
		executed  = $('#tabbed_subpanels_list').html();  // to ensure we haven't already executed
	
		var return_val = false;
		if(! (executed === undefined) )
		{	return_val = true;
		}

		this.cache_and_log('already_executed_check', return_val);
		return return_val;
	};

	this.run = function()
	{
		console.log( 'tabbing subpanels. this alert is being used to debug js race condition.' );
	
		var tab_links          = '';
		var tabs               = '';

		function tab_title(tab_id)
		{  
			$('#'+tab_id + ' h3 a').remove();
			$('#'+tab_id + ' h3 span span').remove();
	
			return $('#'+tab_id + ' h3 span').html();
		}

		$.each( $('ul#subpanel_list').children(), function()
		{
			id = this.id;
			tab_links += '<li><a href="#' + id + '" class="tabbed_subpanel_link">' + tab_title(id) + '</a></li>';
		});
	
		var tabbed_link_list  = '<ul id="tabbed_subpanels_list">' + tab_links + '</ul>';
//		alert(tabbed_link_list);

		$('#subpanel_list').wrap('<div id="tabbed_subpanels_wrapper"></div>');
		$('#tabbed_subpanels_wrapper').prepend( tabbed_link_list );
		$('#tabbed_subpanels_wrapper').tabs();

	};

};
