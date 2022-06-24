/**
 * @name        jQuery Countdown Plugin
 * @author        Martin Angelov
 * @version    1.0
 * @url            http://tutorialzine.com/2011/12/countdown-jquery/
 * @license        MIT License
 */

(function ($) {

    // Number of seconds in every time division
    var days = 24 * 60 * 60,
        hours = 60 * 60,
        minutes = 60;

    // Creating the plugin
    $.fn.countdown = function (prop) {

        var options = $.extend({
            callback: function () {
            },
            timestamp: 0
        }, prop);

        var left, d, h, m, s, positions;

        // Initialize the plugin
        init(this, options);

        positions = this.find('.position');

        (function tick() {

            // Time left
            left = new Decimal(options.timestamp).minus(new Date().getTime()).dividedBy(1000).floor();

            if (left.comparedTo(new Decimal(0)) === -1) {
                left = new Decimal(0);
            }

            // Number of days left
            d = left.dividedBy(days).floor().toString();
            updateDuo(0, 2, d);
            left = left.minus(new Decimal(d).times(days));

            // Number of hours left
            h = new Decimal(left).dividedBy(hours).floor().toString();
            updateDuo(3, 4, h);
            left = left.minus(new Decimal(h).times(hours));

            // Number of minutes left
            m = new Decimal(left).dividedBy(minutes).floor().toString();
            updateDuo(5, 6, m);
            left = left.minus(new Decimal(m).times(minutes));

            // Number of seconds left
            s = left.toString();
            updateDuo(7, 8, s);

            // Calling an optional user supplied callback
            options.callback(d, h, m, s);

            // Scheduling another call of this function in 1s
            setTimeout(tick, 1000);
        })();

        // This function updates two digit positions at once
        function updateDuo(minor, major, value) {
            while (value.length > 0 && major > minor) {
                switchDigit(positions.eq(major), value.substr(value.length - 1));
                major = major - 1;
                value = value.substr(0, value.length - 1);
            }
        }

        return this;
    };

    $.fn.countup = function (prop) {

        var options = $.extend({
            callback: function () {
            },
            timestamp: 0
        }, prop);

        var left, d, h, m, s, positions;

        // Initialize the plugin
        init(this, options);

        positions = this.find('.position');

        (function tick() {

            // Time left
            left = new Decimal(new Date().getTime()).minus(options.timestamp).dividedBy(1000).floor();

            if (left.comparedTo(new Decimal(0)) === -1) {
                left = new Decimal(0);
            }

            // Number of days left
            d = left.dividedBy(days).floor().toString();
            updateDuo(0, 2, d);
            left = left.minus(new Decimal(d).times(days));

            // Number of hours left
            h = new Decimal(left).dividedBy(hours).floor().toString();
            updateDuo(3, 4, h);
            left = left.minus(new Decimal(h).times(hours));

            // Number of minutes left
            m = new Decimal(left).dividedBy(minutes).floor().toString();
            updateDuo(5, 6, m);
            left = left.minus(new Decimal(m).times(minutes));

            // Number of seconds left
            s = left.toString();
            updateDuo(7, 8, s);

            // Calling an optional user supplied callback
            options.callback(d, h, m, s);

            // Scheduling another call of this function in 1s
            setTimeout(tick, 1000);
        })();

        // This function updates two digit positions at once
        function updateDuo(minor, major, value) {
            while (value.length > 0 && major >= minor) {
                switchDigit(positions.eq(major), value.substr(value.length - 1));
                major = major - 1;
                value = value.substr(0, value.length - 1);
            }
        }

        return this;
    };

    function init(elem, options) {
        elem.addClass('countdownHolder');

        // Creating the markup inside the container
        $.each(['Days', 'Hours', 'Minutes', 'Seconds'], function (i) {
            var boxName;
            if (this == "Days") {
                boxName = "Days";
            } else if (this == "Hours") {
                boxName = "Hours";
            } else if (this == "Minutes") {
                boxName = "Minutes";
            } else {
                boxName = "Seconds";
            }
            $('<div class="count' + this + '">' +
                (boxName === "Days" ?
                ('<span class="position">' +
                '<span class="digit static" style="top: 0px; opacity: 1;">0</span>' +
                '</span>') :'') +
                '<span class="position">' +
                '<span class="digit static" style="top: 0px; opacity: 1;">0</span>' +
                '</span>' +
                '<span class="position">' +
                '<span class="digit static" style="top: 0px; opacity: 1;">0</span>' +
                '</span>' +
                '<span class="boxName">' +
                '<span class="' + this + '">' + boxName + '</span>' +
                '</span>'
            ).appendTo(elem);

            if (this != "Seconds") {
                elem.append('<span class="points">:</span><span class="countDiv countDiv' + i + '"></span>');
            }
        });

    }

    // Creates an animated transition between the two numbers
    function switchDigit(position, number) {

        var digit = position.find('.digit')

        if (digit.is(':animated')) {
            return false;
        }

        if (position.data('digit') == number) {
            // We are already showing this number
            return false;
        }

        position.data('digit', number);

        var replacement = $('<span>', {
            'class': 'digit',
            css: {
                top: 0,
                opacity: 0
            },
            html: number
        });

        // The .static class is added when the animation
        // completes. This makes it run smoother.

        digit
            .before(replacement)
            .removeClass('static')
            .animate({top: 0, opacity: 0}, 'fast', function () {
                digit.remove();
            })

        replacement
            .delay(100)
            .animate({top: 0, opacity: 1}, 'fast', function () {
                replacement.addClass('static');
            });
    }
})(jQuery);