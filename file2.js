/* global window, document, $, jQuery, Modernizr, define, require */

define([
    'jquery',
    'underscore'
], function ($, _) {
    'use strict';

    var defaults = {
    
        scrollOnCollapse: true,
    
        selectorContentZone: null,
        collapseFromIndex: 1,
        collapseFromIndexAttr: 'c_002-collapse-from-index',

        debounce: 150,
        headerAdjustment: 60,
        
        ignoreSelector: '.contentCarousel',
        
        classCollapsable: 'c_002-collapsable',

        collapsedTextAttr: 'c_002-collapsed-text',
        expandedTextAttr: 'c_002-expanded-text',
        collapseEnableAttr: 'c_002-collapse-enabled',

        classCollapseInitialized: 'c_002-collapse-initialized',
        classCollapseEnabled: 'c_002-collapse-enabled',
        classCollapseDisabled: 'c_002-collapse-disabled',

        classExpanded: 'c_002-expanded',
        classExpandContent: 'c_002-expand-content',
        classCollapseContent: 'c_002-collapse-content',
        classHideContent: 'c_002-hide-content',
        classDoNotCollapse: 'c_002-do-not-collapse',
        classButtonClass: 'c_002-collapse-button'

    },
    $contentzones = null,
    settings = null;




    /**
     * Initialize c_002
     */
    function init(options) {
    
        // Create settings
        settings = $.extend({}, defaults, options);
        
        // Fetch the content zones for the page
        settings.selectorContentZone = '.c_002[data-' + settings.collapseEnableAttr + '="true"]';
        $contentzones = $( settings.selectorContentZone ).filter( _filterContentZones );

        // Enable the collapsable
        _initCollapsableZones();

        // Resize
        onResizeHandler();
        
        /*
            Disable the window.onResize callback for now, enabling content collapsing will only now happen on page load / c2 init.
            $(window).on( 'resize', _.debounce( onResizeHandler, settings.debounce ));
        */

    }


    /**
     * Filter Out Zones To Avoid Collapsing
     */
    function _filterContentZones(i, elem) {
        return ($( settings.ignoreSelector, $(elem) ).size() === 0);
    }


    /**
     * Detect Screen Size
     */
    function isSmallScreen() {
        return (window.matchMedia && window.matchMedia('(max-width: 36.3124em)').matches);
    }


    /**
     * Window Resize Handler
     */
    function onResizeHandler() {
        if (isSmallScreen()) {
            _enableAndCloseContent();
        } else {
            _disableAndExpandContent();
        }
    }


    /**
     * Hide The Content
     */
    function _enableAndCloseContent() {
        $contentzones.each(function () {

            var $contentzone = $(this);

            _toggleContentItems( $contentzone, false );

            $contentzone
                .removeClass( settings.classExpanded + ' ' + settings.classCollapseDisabled )
                .addClass( settings.classCollapseEnabled );

        });
    }


    /**
     * Show The Content
     */
    function _disableAndExpandContent() {
        $contentzones.each(function () {

            var $contentzone = $(this);

            _toggleContentItems( $contentzone, true );

            $contentzone
                .addClass( settings.classCollapseDisabled )
                .removeClass( settings.classExpanded + ' ' + settings.classCollapseEnabled );

        });
    }
    

    /**
     * Fetch Content Items
     */
    function _fetchCollapseFromIndex($contentzone) {
        var collapseFrom = parseInt( $contentzone.data( settings.collapseFromIndexAttr ), 10 );
        return (collapseFrom > 0) ? collapseFrom : 1;
    }


    /**
     * Fetch Content Items
     */
    function _fetchContentItems($contentzone) {

        var collapseFromAttrVal = _fetchCollapseFromIndex($contentzone),
            collapseFrom = (collapseFromAttrVal > 0) ? collapseFromAttrVal : settings.collapseFromIndex;
    
        var arrDoNotCollapse = [
            '.' + settings.classDoNotCollapse,
            '.c_004'
        ];
    
        var $contentItems = $contentzone.find('.grid-row > [class*="col-"]').not( arrDoNotCollapse.join(', ') );
        return $contentItems.slice( collapseFrom, $contentItems.size() );
    }


    /**
     * Force Close
     */
    function _forceClose($contentzone) {
        var $contentItems =  _fetchContentItems($contentzone);
        $contentItems.addClass( settings.classHideContent );
    }


    /**
     * Show/Hide content
     */
    function _toggleContentItems($contentzone, expand) {
        
        var $contentItems =  _fetchContentItems($contentzone);
        
        if (typeof expand === 'undefined') {
            expand = ($contentzone.hasClass( settings.classExpanded )) ? false : true;
        }
        
        if (!expand) {

           $contentItems.addClass( settings.classHideContent + ' ' + settings.classCollapsable);
           $contentzone.removeClass( settings.classExpanded );

        } else if (expand) {

           $contentItems.removeClass( settings.classHideContent );
           $contentzone.addClass( settings.classExpanded );

        }

    }


    /**
     * Enable Collapsing Content
     */
    function _initCollapsableZones() {

        $contentzones.each(function() {

            var $contentzone = $(this);
            
            if (!$contentzone.hasClass( settings.classCollapseInitialized )) {
               _initializeContentZone( $contentzone );
            }

        });

        $contentzones.on('click', 'button.' + settings.classButtonClass , _buttonClickHandler);

    }


    /**
     * Enable Collapsing Content
     */   
    function _initializeContentZone ( $contentzone ) {

        var $contentItems = _fetchContentItems($contentzone),
            numberItems = $contentItems.size();

        if (numberItems > 0) {
        
            $contentzone.addClass( settings.classCollapseEnabled );

            if (isSmallScreen()) {
                _toggleContentItems($contentzone, false);
            }

            var $firstItem = $contentItems.first(),
                $lastItem = $contentItems.last();

            $firstItem.after( _createButton( $contentzone, false ) );
            $lastItem.after( _createButton( $contentzone, true ) );

        }

        $contentzone.addClass( settings.classCollapseInitialized );

    }


    /**
     * Return Button Markup
     */
    function _createButton( $zone, expanded ) {

        var btnText = (expanded) ? $zone.data( settings.expandedTextAttr ) : $zone.data( settings.collapsedTextAttr ),
            btnClass = (expanded) ? settings.classCollapseContent : settings.classExpandContent ;

        return '<div class="col-12 ' + btnClass + ' ' + settings.classDoNotCollapse + '"><button type="button" class="' + settings.classButtonClass + '">' + btnText + '</button></div>';

    }


    /**
     * Collapse/Expand Button Handler
     */
    function _buttonClickHandler(e) {

        var $button = $( e.currentTarget ),
            $parent = $button.parents( settings.selectorContentZone ),
            scrollPosition = (parseInt($parent.offset().top, 10) - settings.headerAdjustment) + 'px';

            _toggleContentItems($parent);
            
            if (!$parent.hasClass( settings.classExpanded ) && settings.scrollOnCollapse ) {
                $('html, body').animate({
                    "scrollTop": scrollPosition
                });
            }

    }


    /**
     * Public Functions
     */
    return {
        init: init
    };

});
