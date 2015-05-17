define(
    [
        'jquery',
        'modal',
        'underscore'
    ],
    function (
        $,
        Modal,
        _
    ) {

    'use strict';

    var namespace = 'c_027',
        defaults = {
            "selectors": {
                "root": '.c_027',
                "modalLink": '.modal-link'
            },
            "classes": {
                "newsModal": 'news-modal-c-027'
            }
        },
        NewsModal;

    NewsModal = function(options) {
        this.settings = $.extend({}, defaults, options);

        this.$root = $(defaults.selectors.root);

        if (!this.$root.length) {
            return false;
        }

        this.$modalLink = this.$root.find(this.settings.selectors.modalLink);
    };

    NewsModal.prototype = {
        init: function() {
            this.initModal();
        },

        initModal: function() {
            if (!_.isUndefined(this.$modalLink) && this.$modalLink.length) {
                new Modal({
                    "openSelector": this.settings.selectors.modalLink,
                    "customClass": this.settings.classes.newsModal
                });
            }
        }
    };

    return NewsModal;
});
