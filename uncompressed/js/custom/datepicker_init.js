/**
 * ------------------------
 * INITIALIZE DATEPICKER
 *
 * Set the options for the
 * Bootstrap Datepicker
 * [`vendor/datepicker.js`]
 * ------------------------
 */

/**
 * ----
 * VARS
 * ----
 */

var // Elements that influence the datepicker
    datepickerToggle = $('.datepickerToggle');

var // Opening Settings
    daysDisabled = [0,1,2,3,4];

/**
 * ---------------------------
 * XMAS/CHRISTMAS DATES
 *
 * xmasDateRange:
 * array of xmas period start
 * and end dates.
 *
 * checkIfXmasDates:
 * function to check if a unix
 * timestamp falls within the
 * dates of xmasDateRange
 * ---------------------------
 */
var xmasDateRange = {
    // NOTE:
    // with `new Date()`, numbers are zero-indexed,
    // so 0 = Jan & 11 = Dec.
    // Also, divide `getTime()` by 1000 to turn
    // milisecond timestamp to regular timestamp.
    'start': new Date(2015,11,16).getTime() / 1000,
    'end': new Date(2016,0,5).getTime() / 1000
};
function checkIfXmasDates(testDate,range){
    var start = range.start;
    var end = range.end;
    if (testDate > start && testDate < end) {
        return true;
    } else {
        return false;
    }
}

/**
 * --------------
 * THE DATEPICKER
 * --------------
 */
datepickerToggle.datepicker(
    {
        format: 'd M yyyy',
        // format: 'yyyy-mm-dd',
        startDate: Date(),
        autoclose: true,
        orientation: 'top',
        clearBtn: true,
        weekStart: 0,
        beforeShowDay: function(date) {

            // return false;

            // Only show Friday and Saturday as they are changeover days
            var day = date.getDay();

            // Convert to timestamp and check against xmas dates
            var dayTimestamp = date.getTime() / 1000;
            var checkXmas = checkIfXmasDates(dayTimestamp, xmasDateRange);

            if (checkXmas) {
                if(day == 1) {
                    return true;//[true, ''];
                } else {
                    return false;//[false, ''];
                }
            } else {
                if(day == 5 || day == 6) {
                    return true;//[true, ''];
                } else {
                    return false;//[false, ''];
                }
            }
        }//,
        //daysOfWeekDisabled: daysDisabled//,
        // beforeShowDay: function(date) {
        //     // Check if the selected park is open on the selected day
        //     var isDayAvailable = park_open(date, 6);
        //     if (isDayAvailable) {
        //         return true;
        //     } 
        //     return false;
        // }
    }
).on('show', function(ev) {
    $('html').addClass('datepickerOpenHack');
  // $('.datepicker').datepicker('hide');
}).on('hide',function(ev){
    $('html').removeClass('datepickerOpenHack');
});