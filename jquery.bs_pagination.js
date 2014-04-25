/**
 * @fileOverview bs_pagination: jQuery pagination plugin, based on Twitter Bootstrap 3.
 *               <p>License MIT
 *               <br />Copyright Christos Pontikis <a href="http://pontikis.net">http://pontikis.net</a>
 *               <br />Project page <a href="http://www.pontikis.net/labs/bs_pagination">http://www.pontikis.net/labs/bs_pagination</a>
 * @version 0.9.0 (25 Apr 2014)
 * @author Christos Pontikis http://www.pontikis.net
 * @requires jquery >= 1.8, twitter bootstrap >= 3
 */

/**
 * See <a href="http://jquery.com">http://jquery.com</a>.
 * @name $
 * @class
 * See the jQuery Library  (<a href="http://jquery.com">http://jquery.com</a>) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 */

/**
 * See <a href="http://jquery.com">http://jquery.com</a>
 * @name fn
 * @class
 * See the jQuery Library  (<a href="http://jquery.com">http://jquery.com</a>) for full details.  This just
 * documents the function and classes that are added to jQuery by this plug-in.
 * @memberOf $
 */

/**
 * Pseudo-Namespace containing private methods (for documentation purposes)
 * @name _private_methods
 * @namespace
 */

"use strict";
(function($) {

    var pluginName = 'bs_pagination';

    /* public methods ------------------------------------------------------- */
    var methods = {

        /**
         * @lends $.fn.bs_pagination
         */
        init: function(options) {

            var elem = this;

            return this.each(function() {

                /**
                 * settings and defaults
                 * using $.extend, settings modification will affect elem.data() and vive versa
                 */
                var settings = elem.data(pluginName);
                if(typeof(settings) == 'undefined') {
                    var defaults = elem.bs_pagination('getDefaults');
                    settings = $.extend({}, defaults, options);
                } else {
                    settings = $.extend({}, settings, options);
                }
                elem.data(pluginName, settings);

                // bind events
                elem.unbind("onChangePage").bind("onChangePage", settings.onChangePage);
                elem.unbind("onSetRowsPerPage").bind("onSetRowsPerPage", settings.onSetRowsPerPage);
                elem.unbind("onDisplay").bind("onDisplay", settings.onDisplay);

                // retrieve options
                var container_id = elem.attr("id"),
                    currentPage = settings.currentPage,
                    rowsPerPage = settings.rowsPerPage,

                    showGoToPage = settings.showGoToPage,
                    showRowsPerPage = settings.showRowsPerPage,
                    showRowsInfo = settings.showRowsInfo,

                    containerClass = settings.containerClass,
                    navListContainerClass = settings.navListContainerClass,

                    navGoToPageContainerClass = settings.navGoToPageContainerClass,
                    navGoToPageClass = settings.navGoToPageClass,

                    navRowsPerPageContainerClass = settings.navRowsPerPageContainerClass,
                    navRowsPerPageClass = settings.navRowsPerPageClass,

                    navInfoContainerClass = settings.navInfoContainerClass,
                    navInfoClass = settings.navInfoClass,

                    nav_top_id = create_id(settings.nav_top_id_prefix, container_id),
                    nav_prev_id = create_id(settings.nav_prev_id_prefix, container_id),
                    nav_pages_id = create_id(settings.nav_pages_id_prefix, container_id),
                    nav_item_id_prefix = create_id(settings.nav_item_id_prefix, container_id) + '_',
                    nav_next_id = create_id(settings.nav_next_id_prefix, container_id),
                    nav_last_id = create_id(settings.nav_last_id_prefix, container_id),

                    goto_page_id = create_id(settings.nav_goto_page_id_prefix, container_id),
                    rows_per_page_id = create_id(settings.nav_rows_per_page_id_prefix, container_id),
                    rows_info_id = create_id(settings.nav_rows_info_id_prefix, container_id),

                    directURL = settings.directURL,

                    html = '',
                    selector;


                /* CREATE NAV PANEL ----------------------------------------- */
                html += '<div class="row">';

                html += '<div class="' + navListContainerClass + '">';
                html += '<div id="' + nav_pages_id + '"></div>';
                html += '</div>';

                if(showGoToPage) {
                    html += '<div class="' + navGoToPageContainerClass + '">';
                    html += '<div class="input-group">';
                    html += '<span class="input-group-addon" title="' + rsc_bs_pag.go_to_page_title + '"><i class="glyphicon glyphicon-arrow-right"></i></span>';
                    html += '<input id="' + goto_page_id + '" type="text" class="' + navGoToPageClass + '" title="' + rsc_bs_pag.go_to_page_title + '">';
                    html += '</div>';
                    html += '</div>';
                }

                if(showRowsPerPage) {
                    html += '<div class="' + navRowsPerPageContainerClass + '">';
                    html += '<div class="input-group">';
                    html += '<span class="input-group-addon" title="' + rsc_bs_pag.rows_per_page_title + '"><i class="glyphicon glyphicon-th-list"></i></span>';
                    html += '<input id="' + rows_per_page_id + '" value="' + rowsPerPage + '" type="text" class="' + navRowsPerPageClass + '" title="' + rsc_bs_pag.rows_per_page_title + '">';
                    html += '</div>';
                    html += '</div>';
                }

                if(showRowsInfo) {
                    html += '<div class="' + navInfoContainerClass + '">';
                    html += '<div id="' + rows_info_id + '" class="' + navInfoClass + '"></div>';
                    html += '</div>';
                }

                html += '</div>';

                // set nav_pane_html
                elem.html(html);

                create_nav_items(container_id);

                // apply style
                elem.removeClass().addClass(containerClass);

                // panel events ------------------------------------------------
                if(!directURL) {

                    // click on go to top button
                    selector = "#" + nav_top_id;
                    elem.off('click', selector).on('click', selector, function() {
                        var previous_selection = settings.currentPage;
                        settings.currentPage = 1;
                        var current_selection = settings.currentPage;
                        change_page(container_id, previous_selection, current_selection, true);
                    });

                    // click on go to prev button
                    selector = "#" + nav_prev_id;
                    elem.off('click', selector).on('click', selector, function() {
                        if(settings.currentPage > 1) {
                            var previous_selection = settings.currentPage;
                            settings.currentPage = parseInt(settings.currentPage) - 1;
                            var current_selection = settings.currentPage;
                            var recreate_nav = (elem.data('nav_start') == previous_selection);
                            change_page(container_id, previous_selection, current_selection, recreate_nav);
                        }
                    });

                    // click on go to next button
                    selector = "#" + nav_next_id;
                    elem.off('click', selector).on('click', selector, function() {
                        if(settings.currentPage < settings.totalPages) {
                            var previous_selection = settings.currentPage;
                            settings.currentPage = parseInt(settings.currentPage) + 1;
                            var current_selection = settings.currentPage;
                            var recreate_nav = (elem.data('nav_end') == previous_selection);
                            change_page(container_id, previous_selection, current_selection, recreate_nav);
                        }
                    });

                    // click on go to end button
                    selector = "#" + nav_last_id;
                    elem.off('click', selector).on('click', selector, function() {
                        var previous_selection = settings.currentPage;
                        settings.currentPage = parseInt(settings.totalPages);
                        var current_selection = settings.currentPage;
                        change_page(container_id, previous_selection, current_selection, true);
                    });

                    // click on nav page item
                    selector = '[id^="' + nav_item_id_prefix + '"]';
                    elem.off('click', selector).on('click', selector, function(event) {
                        var previous_selection = settings.currentPage;
                        var len = nav_item_id_prefix.length;
                        settings.currentPage = parseInt($(event.target).attr("id").substr(len));
                        var current_selection = settings.currentPage;
                        change_page(container_id, previous_selection, current_selection, false);
                    });
                }


                // go to page event
                if(showGoToPage) {
                    selector = "#" + goto_page_id;
                    elem.off('keypress', selector).on('keypress', selector, function(event) {
                        if(event.which === 13) {
                            var previous_selection = settings.currentPage;
                            var gtp = parseInt($(event.target).val());
                            $("#" + goto_page_id).val('');
                            if(!isNaN(gtp) && gtp > 0) {
                                settings.currentPage = gtp;
                                if(settings.currentPage > settings.totalPages) {
                                    settings.currentPage = settings.totalPages;
                                }
                                var current_selection = settings.currentPage;

                                if(directURL) {
                                    location.href = directURL(current_selection);
                                } else {
                                    change_page(container_id, previous_selection, current_selection, true);
                                }

                            } else {
                                elem.triggerHandler("onChangePage", settings.currentPage);
                            }
                            event.preventDefault(); // MSIE strange behaviour
                        } else {
                            if(!(event.which === 8 || event.which === 0 || (event.shiftKey === false && (event.which > 47 && event.which < 58)))) {
                                event.preventDefault();
                            }
                        }
                    });
                }

                // rows per page event
                if(showRowsPerPage) {
                    selector = "#" + rows_per_page_id;
                    elem.off('keypress', selector).on('keypress', selector, function(event) {
                        if(event.which === 13) {
                            var rpp = parseInt($(event.target).val());
                            if(!isNaN(rpp) && rpp > 0) {
                                settings.rowsPerPage = rpp;
                            } else {
                                $("#" + rows_per_page_id).val(settings.rowsPerPage);
                            }
                            elem.triggerHandler("onSetRowsPerPage", rpp);
                            event.preventDefault(); // MSIE strange behaviour
                        } else {
                            if(!(event.which === 8 || event.which === 0 || (event.shiftKey === false && (event.which > 47 && event.which < 58)))) {
                                event.preventDefault();
                            }
                        }
                    });
                }

                elem.triggerHandler("onChangePage", currentPage);
                elem.triggerHandler('onDisplay');

            });

        },

        /**
         * Get default values
         * @example $(element).bs_pagination('getDefaults');
         * @return {Object}
         */
        getDefaults: function() {
            return {
                currentPage: 1,
                visiblePageLinks: 5,
                maxVisiblePageLinks: 20,
                rowsPerPage: 10,
                totalPages: 100,

                showGoToPage: true,
                showRowsPerPage: true,
                showRowsInfo: true,

                directURL: false, // or a function with current page as argument
                disableSelectionNavPane: true, // disable text selection and double click (jquery >= 1.8)

                // styles
                containerClass: 'well',
                navListContainerClass: 'col-xs-12 col-sm-12 col-md-6',
                navListClass: 'pagination no-margin',
                navListActiveItemClass: 'active',

                navGoToPageContainerClass: 'col-xs-6 col-sm-4 col-md-2 row-space',
                navGoToPageClass: 'form-control small-input',

                navRowsPerPageContainerClass: 'col-xs-6 col-sm-4 col-md-2 row-space',
                navRowsPerPageClass: 'form-control small-input',

                navInfoContainerClass: 'col-xs-12 col-sm-4 col-md-2 row-space',
                navInfoClass: '',

                // element IDs
                nav_pages_id_prefix: 'nav_pages_',
                nav_top_id_prefix: 'top_',
                nav_prev_id_prefix: 'prev_',
                nav_item_id_prefix: 'nav_item_',
                nav_next_id_prefix: 'next_',
                nav_last_id_prefix: 'last_',

                nav_goto_page_id_prefix: 'goto_page_',
                nav_rows_per_page_id_prefix: 'rows_per_page_',
                nav_rows_info_id_prefix: 'rows_info_',

                onChangePage: function() {
                },
                onSetRowsPerPage: function() {
                },
                onDisplay: function() {
                }
            };
        },

        /**
         * Get any option set to plugin using its name (as string)
         * @example $(element).bs_pagination('getOption', some_option);
         * @param opt
         * @return {*}
         */
        getOption: function(opt) {
            var elem = this;
            return elem.data(pluginName)[opt];
        },

        /**
         * Get all options
         * @example $(element).bs_pagination('getAllOptions');
         * @return {*}
         */
        getAllOptions: function() {
            var elem = this;
            return elem.data(pluginName);
        },

        /**
         * Set option
         * @example $(element).bs_pagination('setOption', 'oprion_name',  'oprion_value',  reinit);
         * @param opt
         * @param val
         * @param reinit
         */
        setOption: function(opt, val, reinit) {
            var elem = this;
            elem.data(pluginName)[opt] = val;
            if(reinit) {
                elem.bs_pagination('init');
            }
        },

        /**
         * Destroy plugin
         * @example $(element).bs_pagination('destroy');
         * @return {*|jQuery}
         */
        destroy: function() {
            return $(this).each(function() {
                var $this = $(this);

                $this.removeData(pluginName);
            });
        },

        /**
         * Set rows info
         * @example $(element).bs_pagination('setRowsInfo', info_html);
         * @param info_html
         */
        setRowsInfo: function(info_html) {
            var elem = this;
            var rows_info_id = create_id(elem.bs_pagination('getOption', 'nav_rows_info_id_prefix'), $(this).attr("id"));
            $("#" + rows_info_id).html(info_html);
        }
    };

    /* private methods ------------------------------------------------------ */

    /**
     * @lends _private_methods
     */

    /**
     * Create element id
     * @param prefix
     * @param plugin_container_id
     * @return {*}
     */
    var create_id = function(prefix, plugin_container_id) {
        return prefix + plugin_container_id;
    };

    /**
     * Disable selection (jquery 1.8)
     * http://stackoverflow.com/questions/2700000/how-to-disable-text-selection-using-jquery
     * @param element
     * @return {*}
     */
    var disableSelection = function(element) {
        return element
            .attr('unselectable', 'on')
            .css('user-select', 'none')
            .on('selectstart', false);
    };

    /**
     * Create nagivation pages
     * @param container_id
     */
    var create_nav_items = function(container_id) {

        // retrieve options, define variables
        var elem = $("#" + container_id),
            s = $(elem).bs_pagination('getAllOptions'),

            totalPages = s.totalPages,
            currentPage = s.currentPage,
            visiblePageLinks = s.visiblePageLinks,
            directURL = s.directURL,
            disableSelectionNavPane = s.disableSelectionNavPane,

            navListClass = s.navListClass,
            navListActiveItemClass = s.navListActiveItemClass,

            nav_pages_id = create_id(s.nav_pages_id_prefix, container_id),
            nav_top_id = create_id(s.nav_top_id_prefix, container_id),
            nav_prev_id = create_id(s.nav_prev_id_prefix, container_id),
            nav_item_id_prefix = create_id(s.nav_item_id_prefix, container_id) + '_',
            nav_next_id = create_id(s.nav_next_id_prefix, container_id),
            nav_last_id = create_id(s.nav_last_id_prefix, container_id),

            elem_nav_pages = $("#" + nav_pages_id),
            nav_html = '',
            nav_start = parseInt(currentPage),
            nav_end,
            i, mod, offset, totalSections,
            active = '',
            nav_title = '',
            nav_url = '',
            no_url = 'javascript:void(0);';

        // navigation pages numbers
        if(totalPages < visiblePageLinks) {
            nav_start = 1;
            nav_end = totalPages;
        } else {
            totalSections = Math.ceil(totalPages / visiblePageLinks);
            if(nav_start > visiblePageLinks * (totalSections - 1)) {
                nav_start = totalPages - visiblePageLinks + 1;
            } else {
                mod = nav_start % visiblePageLinks;
                offset = mod == 0 ? -visiblePageLinks + 1 : -mod + 1;
                nav_start += offset;
            }
            nav_end = nav_start + visiblePageLinks - 1;
        }

        // store nav_start nav_end
        elem.data('nav_start', nav_start);
        elem.data('nav_end', nav_end);

        // create nav pages html -----------------------------------------------
        nav_html += '<ul class="' + navListClass + '">';

        // show - hide backward nav controls
        if(nav_start > 1) {
            nav_url = directURL ? directURL(1) : no_url;
            nav_html += '<li><a id="' + nav_top_id + '" href="' + nav_url + '">' + rsc_bs_pag.go_top_text + '</a></li>';
            nav_url = directURL ? directURL(nav_start - 1) : no_url;
            nav_html += '<li><a id="' + nav_prev_id + '" href="' + nav_url + '">' + rsc_bs_pag.go_prev_text + '</a></li>';
        }

        // show nav pages
        for(i = nav_start; i <= nav_end; i++) {
            active = currentPage == i ? ' class="' + navListActiveItemClass + '"' : '';
            nav_title = currentPage == i ? ' title="' + rsc_bs_pag.current_page_label + ' ' + currentPage + ' ' + rsc_bs_pag.total_pages_label + ' ' + totalPages + '" ' : '';
            nav_url = directURL ? directURL(i) : no_url;
            nav_html += '<li' + active + '><a id="' + nav_item_id_prefix + i + '" href="' + nav_url + '"' + nav_title + '>' + i + '</a></li>';
        }

        // show - hide forward nav controls
        if(nav_end < totalPages) {
            nav_url = directURL ? directURL(nav_end + 1) : no_url;
            nav_html += '<li><a id="' + nav_next_id + '" href="' + nav_url + '">' + rsc_bs_pag.go_next_text + '</a></li>';
            nav_url = directURL ? directURL(totalPages) : no_url;
            nav_html += '<li><a id="' + nav_last_id + '" href="' + nav_url + '">' + rsc_bs_pag.go_last_text + '</a></li>';
        }

        nav_html += '</ul>';

        elem_nav_pages.html(nav_html);

        if(disableSelectionNavPane) {
            disableSelection(elem_nav_pages);
        }

    };

    /**
     * Change page
     * @param container_id
     * @param previous_selection
     * @param current_selection
     * @param update_nav_items
     */
    var change_page = function(container_id, previous_selection, current_selection, update_nav_items) {
        if(update_nav_items) {
            create_nav_items(container_id);
        }
        update_current_page(container_id, previous_selection, current_selection);
    };

    /**
     * Update current page
     * @param container_id
     * @param current_selection
     * @param previous_selection
     */
    var update_current_page = function(container_id, previous_selection, current_selection) {

        // retrieve options
        var elem = $("#" + container_id),
            totalPages = elem.data(pluginName)["totalPages"],
            navListActiveItemClass = elem.data(pluginName)["navListActiveItemClass"],
            nav_item_id_prefix = create_id(elem.data(pluginName)["nav_item_id_prefix"], container_id) + '_',
            prev_elem = $("#" + nav_item_id_prefix + previous_selection),
            current_elem = $("#" + nav_item_id_prefix + current_selection);

        // change selected page, applying appropriate styles
        prev_elem.closest("li").removeClass(navListActiveItemClass);
        current_elem.closest("li").addClass(navListActiveItemClass);

        // update title
        var active_title = rsc_bs_pag.current_page_label + ' ' + current_selection + ' ' + rsc_bs_pag.total_pages_label + ' ' + totalPages;
        prev_elem.prop("title", "");
        current_elem.prop("title", active_title);

        // trigger event onChangePage
        elem.triggerHandler("onChangePage", current_selection);
    };

    /**
     * bs_pagination - datagrid jQuery plugin.
     *
     * @class bs_pagination
     * @memberOf $.fn
     */
    $.fn.bs_pagination = function(method) {

        if(this.size() != 1) {
            var err_msg = 'You must use this plugin (' + pluginName + ') with a unique element (at once)';
            this.html('<span style="color: red;">' + 'ERROR: ' + err_msg + '</span>');
            $.error(err_msg);
        }

        // Method calling logic
        if(methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if(typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.' + pluginName);
        }

    };

})(jQuery);