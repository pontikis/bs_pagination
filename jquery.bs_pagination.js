/**
 * @fileOverview bs_pagination: jQuery pagination plugin, based on Twitter Bootstrap.
 *               <p>License MIT
 *               <br />Copyright Christos Pontikis <a href="http://pontikis.net">http://pontikis.net</a>
 *               <br />Project page <a href="http://www.pontikis.net/labs/bs_pagination">http://www.pontikis.net/labs/bs_pagination</a>
 * @version 1.0.2 (09 May 2014)
 * @author Christos Pontikis http://www.pontikis.net
 * @requires jquery >= 1.8, twitter bootstrap >= 2
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

    var pluginName = "bs_pagination";

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
                 * using $.extend, settings modification will affect elem.data() and vice versa
                 */
                var settings = elem.data(pluginName);
                if(typeof settings == "undefined") {
                    var bootstrap_version = "3";
                    if(options.hasOwnProperty("bootstrap_version") && options["bootstrap_version"] == "2") {
                        bootstrap_version = "2";
                    }
                    var defaults = methods.getDefaults.call(elem, bootstrap_version);
                    settings = $.extend({}, defaults, options);
                } else {
                    settings = $.extend({}, settings, options);
                }
                if(settings.totalRows == 0) {
                    settings.totalRows = settings.totalPages * settings.rowsPerPage;
                }
                elem.data(pluginName, settings);

                // bind events
                elem.unbind("onChangePage").bind("onChangePage", settings.onChangePage);
                elem.unbind("onLoad").bind("onLoad", settings.onLoad);

                // retrieve options
                var container_id = elem.attr("id"),

                    nav_list_id = create_id(settings.nav_list_id_prefix, container_id),
                    nav_top_id = create_id(settings.nav_top_id_prefix, container_id),
                    nav_prev_id = create_id(settings.nav_prev_id_prefix, container_id),
                    nav_item_id_prefix = create_id(settings.nav_item_id_prefix, container_id) + "_",
                    nav_next_id = create_id(settings.nav_next_id_prefix, container_id),
                    nav_last_id = create_id(settings.nav_last_id_prefix, container_id),

                    goto_page_id = create_id(settings.nav_goto_page_id_prefix, container_id),
                    rows_per_page_id = create_id(settings.nav_rows_per_page_id_prefix, container_id),
                    rows_info_id = create_id(settings.nav_rows_info_id_prefix, container_id),

                    html = "",
                    previous_selection, current_selection,
                    selector_nav_top, selector_nav_prev, selector_nav_pages, selector_nav_next, selector_nav_last,
                    selector_go_to_page, selector_rows_per_page;

                /* CREATE NAV PANEL ----------------------------------------- */
                if(settings.bootstrap_version == "3") {
                    html += '<div class="' + settings.mainWrapperClass + '">';

                    html += '<div class="' + settings.navListContainerClass + '">';
                    html += '<div class="' + settings.navListWrapperClass + '">';
                    html += '<ul id="' + nav_list_id + '" class="' + settings.navListClass + '">';
                    html += '</ul>';
                    html += '</div>';
                    html += '</div>';

                    if(settings.showGoToPage && settings.visiblePageLinks < settings.totalPages) {
                        html += '<div class="' + settings.navGoToPageContainerClass + '">';
                        html += '<div class="input-group">';
                        html += '<span class="input-group-addon" title="' + rsc_bs_pag.go_to_page_title + '"><i class="' + settings.navGoToPageIconClass + '"></i></span>';
                        html += '<input id="' + goto_page_id + '" type="text" class="' + settings.navGoToPageClass + '" title="' + rsc_bs_pag.go_to_page_title + '">';
                        html += '</div>';
                        html += '</div>';
                    }
                    if(settings.showRowsPerPage) {
                        html += '<div class="' + settings.navRowsPerPageContainerClass + '">';
                        html += '<div class="input-group">';
                        html += '<span class="input-group-addon" title="' + rsc_bs_pag.rows_per_page_title + '"><i class="' + settings.navRowsPerPageIconClass + '"></i></span>';
                        html += '<input id="' + rows_per_page_id + '" value="' + settings.rowsPerPage + '" type="text" class="' + settings.navRowsPerPageClass + '" title="' + rsc_bs_pag.rows_per_page_title + '">';
                        html += '</div>';
                        html += '</div>';
                    }
                    if(settings.showRowsInfo) {
                        html += '<div class="' + settings.navInfoContainerClass + '">';
                        html += '<div id="' + rows_info_id + '" class="' + settings.navInfoClass + '"></div>';
                        html += '</div>';
                    }

                } else {
                    html += '<div class="' + settings.mainWrapperClass + '">';

                    html += '<div class="' + settings.navListContainerClass + '">';
                    html += '<div class="' + settings.navListWrapperClass + '">';
                    html += '<ul id="' + nav_list_id + '" class="' + settings.navListClass + '">';
                    html += '</ul>';
                    html += '</div>';
                    html += '</div>';

                    if((settings.showGoToPage && settings.visiblePageLinks < settings.totalPages) || settings.showRowsPerPage) {

                        html += '<div class="' + settings.navInputsContainerClass + '">';

                        if(settings.showGoToPage && settings.visiblePageLinks < settings.totalPages) {
                            html += '<div class="' + settings.navGoToPageWrapperClass + '">';
                            html += '<span class="add-on" title="' + rsc_bs_pag.go_to_page_title + '"><i class="' + settings.navGoToPageIconClass + '"></i></span>';
                            html += '<input id="' + goto_page_id + '" type="text" class="' + settings.navGoToPageClass + '" title="' + rsc_bs_pag.go_to_page_title + '">';
                            html += '</div>';
                        }
                        if(settings.showRowsPerPage) {
                            html += '<div class="' + settings.navRowsPerPageWrapperClass + '">';
                            html += '<span class="add-on" title="' + rsc_bs_pag.rows_per_page_title + '"><i class="' + settings.navRowsPerPageIconClass + '"></i></span>';
                            html += '<input id="' + rows_per_page_id + '" value="' + settings.rowsPerPage + '" type="text" class="' + settings.navRowsPerPageClass + '" title="' + rsc_bs_pag.rows_per_page_title + '">';
                            html += '</div>';
                        }

                        html += '</div>';
                    }

                    if(settings.showRowsInfo) {
                        html += '<div class="' + settings.navInfoContainerClass + '">';
                        html += '<div id="' + rows_info_id + '" class="' + settings.navInfoClass + '"></div>';
                        html += '</div>';
                    }
                }

                html += '</div>';

                // set nav_pane_html
                elem.html(html);

                previous_selection = null;
                current_selection = settings.currentPage;
                change_page(container_id, previous_selection, current_selection, true, false);

                // apply style
                elem.removeClass().addClass(settings.containerClass);

                // panel events ------------------------------------------------
                if(!settings.directURL) {

                    // click on go to top
                    selector_nav_top = "#" + nav_top_id;
                    elem.off("click", selector_nav_top).on("click", selector_nav_top, function() {
                        var previous_selection = settings.currentPage;
                        settings.currentPage = 1;
                        var current_selection = settings.currentPage;
                        change_page(container_id, previous_selection, current_selection, true, true);
                    });

                    // click on go to prev
                    selector_nav_prev = "#" + nav_prev_id;
                    elem.off("click", selector_nav_prev).on("click", selector_nav_prev, function() {
                        if(settings.currentPage > 1) {
                            var previous_selection = settings.currentPage;
                            settings.currentPage = parseInt(settings.currentPage) - 1;
                            var current_selection = settings.currentPage;
                            var recreate_nav = (elem.data("nav_start") == previous_selection);
                            change_page(container_id, previous_selection, current_selection, recreate_nav, true);
                        }
                    });

                    // click on go to next
                    selector_nav_next = "#" + nav_next_id;
                    elem.off("click", selector_nav_next).on("click", selector_nav_next, function() {
                        if(settings.currentPage < settings.totalPages) {
                            var previous_selection = settings.currentPage;
                            settings.currentPage = parseInt(settings.currentPage) + 1;
                            var current_selection = settings.currentPage;
                            var recreate_nav = (elem.data("nav_end") == previous_selection);
                            change_page(container_id, previous_selection, current_selection, recreate_nav, true);
                        }
                    });

                    // click on go to last
                    selector_nav_last = "#" + nav_last_id;
                    elem.off("click", selector_nav_last).on("click", selector_nav_last, function() {
                        var previous_selection = settings.currentPage;
                        settings.currentPage = parseInt(settings.totalPages);
                        var current_selection = settings.currentPage;
                        change_page(container_id, previous_selection, current_selection, true, true);
                    });

                    // click on nav page item
                    selector_nav_pages = '[id^="' + nav_item_id_prefix + '"]';
                    elem.off("click", selector_nav_pages).on("click", selector_nav_pages, function(event) {
                        var previous_selection = settings.currentPage;
                        var len = nav_item_id_prefix.length;
                        settings.currentPage = parseInt($(event.target).attr("id").substr(len));
                        var current_selection = settings.currentPage;
                        change_page(container_id, previous_selection, current_selection, false, true);
                    });
                }

                // go to page event
                if(settings.showGoToPage) {
                    selector_go_to_page = "#" + goto_page_id;
                    elem.off("keypress", selector_go_to_page).on("keypress", selector_go_to_page, function(event) {
                        if(event.which === 13) {
                            var gtp = parseInt($(selector_go_to_page).val());
                            $(selector_go_to_page).val("");
                            if(!isNaN(gtp) && gtp > 0) {

                                if(gtp > settings.totalPages) {
                                    gtp = settings.totalPages;
                                }

                                var previous_selection = settings.currentPage;
                                settings.currentPage = gtp;
                                var current_selection = gtp;

                                if(settings.directURL) {
                                    location.href = settings.directURL(current_selection);
                                } else {
                                    change_page(container_id, previous_selection, current_selection, true, true);
                                }

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
                if(settings.showRowsPerPage) {
                    selector_rows_per_page = "#" + rows_per_page_id;
                    elem.off("keypress", selector_rows_per_page).on("keypress", selector_rows_per_page, function(event) {
                        if(event.which === 13) {
                            var rpp = parseInt($(selector_rows_per_page).val());
                            if(!isNaN(rpp) && rpp > 0) {

                                if(rpp > settings.maxRowsPerPage) {
                                    rpp = settings.maxRowsPerPage;
                                }
                                $(selector_rows_per_page).val(rpp);

                                settings.rowsPerPage = rpp;
                                settings.totalPages = Math.ceil(settings.totalRows / settings.rowsPerPage);

                                var previous_selection = settings.currentPage;
                                settings.currentPage = 1;
                                var current_selection = 1;

                                if(settings.directURL) {
                                    location.href = settings.directURL(current_selection);
                                } else {
                                    change_page(container_id, previous_selection, current_selection, true, true);
                                }

                            } else {
                                selector_rows_per_page.val(settings.rowsPerPage);
                            }
                            event.preventDefault(); // MSIE strange behaviour
                        } else {
                            if(!(event.which === 8 || event.which === 0 || (event.shiftKey === false && (event.which > 47 && event.which < 58)))) {
                                event.preventDefault();
                            }
                        }
                    });
                }

            });

        },

        /**
         * Get plugin version
         * @returns {string}
         */
        getVersion: function() {
            return "1.0.2";
        },

        /**
         * Get default values
         * @example $(element).bs_pagination("getDefaults", "3");
         * @param bootstrap_version
         * @returns {Object}
         */
        getDefaults: function(bootstrap_version) {
            var default_settings = {
                currentPage: 1,
                rowsPerPage: 10,
                maxRowsPerPage: 100,
                totalPages: 100,
                totalRows: 0,

                visiblePageLinks: 5,

                showGoToPage: true,
                showRowsPerPage: true,
                showRowsInfo: true,
                showRowsDefaultInfo: true,

                directURL: false, // or a function with current page as argument
                disableTextSelectionInNavPane: true, // disable text selection and double click

                bootstrap_version: "3",

                // bootstrap 3
                containerClass: "well",

                mainWrapperClass: "row",

                navListContainerClass: "col-xs-12 col-sm-12 col-md-6",
                navListWrapperClass: "",
                navListClass: "pagination pagination_custom",
                navListActiveItemClass: "active",

                navGoToPageContainerClass: "col-xs-6 col-sm-4 col-md-2 row-space",
                navGoToPageIconClass: "glyphicon glyphicon-arrow-right",
                navGoToPageClass: "form-control small-input",

                navRowsPerPageContainerClass: "col-xs-6 col-sm-4 col-md-2 row-space",
                navRowsPerPageIconClass: "glyphicon glyphicon-th-list",
                navRowsPerPageClass: "form-control small-input",

                navInfoContainerClass: "col-xs-12 col-sm-4 col-md-2 row-space",
                navInfoClass: "",

                // element IDs
                nav_list_id_prefix: "nav_list_",
                nav_top_id_prefix: "top_",
                nav_prev_id_prefix: "prev_",
                nav_item_id_prefix: "nav_item_",
                nav_next_id_prefix: "next_",
                nav_last_id_prefix: "last_",

                nav_goto_page_id_prefix: "goto_page_",
                nav_rows_per_page_id_prefix: "rows_per_page_",
                nav_rows_info_id_prefix: "rows_info_",

                onChangePage: function() { // returns page_num and rows_per_page after a link has clicked
                },
                onLoad: function() { // returns page_num and rows_per_page on plugin load
                }
            };

            if(bootstrap_version == "2") {
                default_settings.bootstrap_version = "2";

                default_settings.containerClass = "well";

                default_settings.mainWrapperClass = "row-fluid";

                default_settings.navListContainerClass = "span6";
                default_settings.navListWrapperClass = "pagination pagination_custom";
                default_settings.navListClass = "";
                default_settings.navListActiveItemClass = "active";

                default_settings.navInputsContainerClass = "span4 row-space";
                default_settings.navGoToPageWrapperClass = "input-prepend goto_page_wrapper";
                default_settings.navGoToPageIconClass = "icon-arrow-right";
                default_settings.navGoToPageClass = "small-input";
                default_settings.navRowsPerPageWrapperClass = "input-prepend rows_per_page_wrapper";
                default_settings.navRowsPerPageIconClass = "icon-th-list";
                default_settings.navRowsPerPageClass = "small-input";

                default_settings.navInfoContainerClass = "span2 row-space";
                default_settings.navInfoClass = "";
            }

            return default_settings;
        },

        /**
         * Get any option set to plugin using its name (as string)
         * @example $(element).bs_pagination("getOption", some_option);
         * @param opt
         * @return {*}
         */
        getOption: function(opt) {
            var elem = this;
            return elem.data(pluginName)[opt];
        },

        /**
         * Get all options
         * @example $(element).bs_pagination("getAllOptions");
         * @return {*}
         */
        getAllOptions: function() {
            var elem = this;
            return elem.data(pluginName);
        },

        /**
         * Destroy plugin
         * @example $(element).bs_pagination("destroy");
         */
        destroy: function() {
            var elem = this;
            elem.removeData();
        },

        /**
         * Set rows info
         * @example $(element).bs_pagination("setRowsInfo", info_html);
         * @param info_html
         */
        setRowsInfo: function(info_html) {
            var elem = this,
                rows_info_id = create_id(methods.getOption.call(elem, "getOption", "nav_rows_info_id_prefix"), elem.attr("id"));
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
     * Change page
     * @param container_id
     * @param previous_selection
     * @param current_selection
     * @param update_nav_items
     * @param trigger_change_page
     */
    var change_page = function(container_id, previous_selection, current_selection, update_nav_items, trigger_change_page) {

        // retrieve options, define variables
        var elem = $("#" + container_id),
            s = methods.getAllOptions.call(elem),
            nav_item_id_prefix = create_id(s.nav_item_id_prefix, container_id) + "_";

        if(update_nav_items) {

            var nav_list = create_id(s.nav_list_id_prefix, container_id),
                nav_top_id = create_id(s.nav_top_id_prefix, container_id),
                nav_prev_id = create_id(s.nav_prev_id_prefix, container_id),
                nav_next_id = create_id(s.nav_next_id_prefix, container_id),
                nav_last_id = create_id(s.nav_last_id_prefix, container_id),

                elem_nav_list = $("#" + nav_list),
                nav_html = "",
                nav_start = parseInt(s.currentPage),
                nav_end,
                i, mod, offset, totalSections,
                nav_url = "",
                no_url = "javascript:void(0);";

            // navigation pages numbers
            if(s.totalPages < s.visiblePageLinks) {
                nav_start = 1;
                nav_end = s.totalPages;
            } else {
                totalSections = Math.ceil(s.totalPages / s.visiblePageLinks);
                if(nav_start > s.visiblePageLinks * (totalSections - 1)) {
                    nav_start = s.totalPages - s.visiblePageLinks + 1;
                } else {
                    mod = nav_start % s.visiblePageLinks;
                    offset = mod == 0 ? -s.visiblePageLinks + 1 : -mod + 1;
                    nav_start += offset;
                }
                nav_end = nav_start + s.visiblePageLinks - 1;
            }

            // store nav_start nav_end
            elem.data("nav_start", nav_start);
            elem.data("nav_end", nav_end);

            // create nav pages html -----------------------------------------------
            // show - hide backward nav controls
            if(nav_start > 1) {
                nav_url = s.directURL ? s.directURL(1) : no_url;
                nav_html += '<li><a id="' + nav_top_id + '" href="' + nav_url + '">' + rsc_bs_pag.go_top_text + '</a></li>';
                nav_url = s.directURL ? s.directURL(nav_start - 1) : no_url;
                nav_html += '<li><a id="' + nav_prev_id + '" href="' + nav_url + '">' + rsc_bs_pag.go_prev_text + '</a></li>';
            }
            // show nav pages
            for(i = nav_start; i <= nav_end; i++) {
                nav_url = s.directURL ? s.directURL(i) : no_url;
                nav_html += '<li><a id="' + nav_item_id_prefix + i + '" href="' + nav_url + '">' + i + '</a></li>';
            }
            // show - hide forward nav controls
            if(nav_end < s.totalPages) {
                nav_url = s.directURL ? s.directURL(nav_end + 1) : no_url;
                nav_html += '<li><a id="' + nav_next_id + '" href="' + nav_url + '">' + rsc_bs_pag.go_next_text + '</a></li>';
                nav_url = s.directURL ? s.directURL(s.totalPages) : no_url;
                nav_html += '<li><a id="' + nav_last_id + '" href="' + nav_url + '">' + rsc_bs_pag.go_last_text + '</a></li>';
            }
            elem_nav_list.html(nav_html);

            if(s.disableTextSelectionInNavPane) {
                disableSelection(elem_nav_list);
            }

        }

        // retrieve options
        var prev_elem = $("#" + nav_item_id_prefix + previous_selection),
            current_elem = $("#" + nav_item_id_prefix + current_selection);

        // change selected page, applying appropriate styles
        prev_elem.closest("li").removeClass(s.navListActiveItemClass);
        current_elem.closest("li").addClass(s.navListActiveItemClass);


        // update title
        var active_title = rsc_bs_pag.current_page_label + " " + current_selection + " " + rsc_bs_pag.total_pages_label + " " + s.totalPages;
        prev_elem.prop("title", "");
        current_elem.prop("title", active_title);

        if(s.showRowsInfo && s.showRowsDefaultInfo) {
            var page_first_row = ((s.currentPage - 1) * s.rowsPerPage) + 1,
                page_last_row = Math.min(page_first_row + s.rowsPerPage - 1, s.totalRows),
                info_html = page_first_row + "-" + page_last_row + " " +
                    rsc_bs_pag.total_rows_label + " " + s.totalRows + " " + rsc_bs_pag.rows_info_records +
                    " (" + rsc_bs_pag.current_page_abbr_label + s.currentPage + rsc_bs_pag.total_pages_abbr_label + s.totalPages + ")",
                rows_info_id = create_id(s.nav_rows_info_id_prefix, container_id);
            $("#" + rows_info_id).html(info_html);
        }

        // trigger event onChangePage (only after some link pressed, not on plugin load)
        if(trigger_change_page) {
            elem.triggerHandler("onChangePage", {currentPage: current_selection, rowsPerPage: s.rowsPerPage});
        } else {
            elem.triggerHandler("onLoad", {currentPage: current_selection, rowsPerPage: s.rowsPerPage});
        }

    };

    /**
     * Disable selection (jquery 1.8)
     * http://stackoverflow.com/questions/2700000/how-to-disable-text-selection-using-jquery
     * @param element
     * @return {*}
     */
    var disableSelection = function(element) {
        return element
            .attr("unselectable", "on")
            .css("user-select", "none")
            .on("selectstart", false);
    };

    /**
     * bs_pagination - jQuery pagination plugin, based on Twitter Bootstrap.
     *
     * @class bs_pagination
     * @memberOf $.fn
     */
    $.fn.bs_pagination = function(method) {

        if(this.size() != 1) {
            var err_msg = "You must use this plugin (" + pluginName + ") with a unique element (at once)";
            this.html('<span style="color: red;">' + 'ERROR: ' + err_msg + '</span>');
            $.error(err_msg);
        }

        // Method calling logic
        if(methods[method]) {
            return methods[ method ].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if(typeof method === "object" || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error("Method " + method + " does not exist on jQuery." + pluginName);
        }

    };

})(jQuery);