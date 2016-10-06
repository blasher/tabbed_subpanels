$('ul.subpanel_list').css('visibility','hidden');

var tsp = new TabbedSubPanels();
tsp.run();

function TabbedSubPanels()
{
	this.debug = false;
	this.cache = [];
	this.load_check_count = 0; 
	this.deferred = $.Deferred();

	this.log = function(log_str)
	{
		if( this.debug )
		{	console.log('TSP - ' + log_str );
		}
	}

	this.cache_and_log = function(name, value)
	{
		this.cache[name] = value;
		var log_str      = name + ' = ' + value;
		this.log( log_str  );
	}


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
		{	count   = 0;

			this.log('counting subpanels');
			content = $('ul#subpanel_list').html();
			count   = $('ul#subpanel_list').children().length;
		}
		var return_val = count;
//		alert(count);
//		alert(content);

		this.cache_and_log('subpanel_count', return_val);
		return return_val;
	};


	// return the number of subpanels that have loaded
	this.subpanels_finished_loading_count = function()
	{
		var count = 0;

		this.log('counting footable-loaded subpanels');
		count = $('ul#subpanel_list .footable-loaded').length;

		var return_val = count;

		this.cache_and_log('subpanels_finished_loading_count', return_val);
		return return_val;
	};


	// check to see if all the subpanels have finished loading
	this.subpanels_finished_loading_check = function()
	{
		var total  = tsp.subpanel_count();
		var loaded = tsp.subpanels_finished_loading_count();
		var check   = false;

		this.log(loaded + ' / ' + total )

		if(total == loaded)
		{	check = true;
		}

		if(check)
		{
//			alert('subpanels_finished_loading_check passed');
			this.cache_and_log('subpanels_finished_loading_check passed', check );
			this.deferred.promise()
			return;
		}

		this.load_check_count++;

		this.cache_and_log('load_check_count', this.load_check_count);

		if(this.load_check_count < 100)
		{	this.subpanels_finished_loading_check();
		}
		else
		{
//			alert('subpanels failed to finished loading after 100 tries of checking');
			this.cache_and_log('subpanels failed to finished loading after 100 tries of checking', check );
		}
	};


	this.process_subpanels = function()
	{
		this.log( 'tabbing subpanels. this alert is being used to debug js race condition.' );
	
		var tab_links          = '';
		var tabs               = '';

		function suite_r_tab_title(tab_id)
		{
			$('#'+tab_id + ' h3 a').remove();
			$('#'+tab_id + ' h3 span span').remove();
			title = $('#'+tab_id + ' h3 span').html();
	
			return title;
		}

		function suite_p_tab_title(tab_id)
		{  
			$('#'+tab_id + ' div.panel-heading a img').remove();

			title = $('#'+tab_id + ' div.panel-heading a div div').html();
			title.trim();
	
			return title;
		}

		$.each( $('ul#subpanel_list').children(), function()
		{
			id = this.id;

			tab_title = suite_r_tab_title(id);
			if( $('#subpanel_list div.panel-heading').length > 1)
			{	tab_title = suite_p_tab_title(id);
			}

			tab_links += '<li><a href="#' + id + '" class="tabbed_subpanel_link">' + tab_title + '</a></li>';
		});
	
		var tabbed_link_list  = '<ul id="tabbed_subpanels_list">' + tab_links + '</ul>';
//		alert(tabbed_link_list);

		$('#subpanel_list').wrap('<div id="tabbed_subpanels_wrapper"></div>');
		$('#tabbed_subpanels_wrapper').prepend( tabbed_link_list );
		$('#tabbed_subpanels_wrapper').tabs();

	};

	this.run = function()
	{
		$(document).ready( function()
		{
			if( !tsp.already_executed_check() )
			{
				if(tsp.subpanels_present() )
				{	
					$.when( tsp.subpanels_finished_loading_check() )
					{
						tsp.process_subpanels();
					}
				}
			}
		});
	}


};
