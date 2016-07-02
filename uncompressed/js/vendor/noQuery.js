/**
 * ------------------------------------
 * noQuery
 * 
 * These are basic utilities that allow
 * for cross-browser support, replacing
 * the need to use jQuery.
 *
 * Has Class
 * Add Class
 * Remove Class
 * ------------------------------------
 */
var noQuery = (function(){
    
    /**
     * Has Class:
     * Does the target element have the target class?
     * @param  {object}  el        The target element.
     * @param  {string}  className The target class.
     * @return {Boolean}           If the el has the class, output 'true'. Otherwise 'false'.
     */
    function _hasClass(el, className){
        if (el.classList) {
            var result = el.classList.contains(className);
        } else {
            var result = new RegExp('(^| )' + className + '( |$)', 'gi').test(el.className);
        }
        return result;
    }

    /**
     * Add Class:
     * Add a class to the target element.
     * @param {object} el        The target element.
     * @param {string} className The target class.
     */
    function _addClass(el, className){
        if (el.classList) {
            el.classList.add(className);
        }
        else {
            el.className += ' ' + className;
        }
    }

    /**
     * Remove Class:
     * Remove a class from the target element.
     * @param  {object} el        The target element.
     * @param  {string} className The target class.
     */
    function _removeClass(el, className){
        if (el.classList) {
            el.classList.remove(className);
        }
        else {
            el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        }
    }


    var publicAPI = {
        hasClass: _hasClass,
        addClass: _addClass,
        removeClass: _removeClass
    };
    return publicAPI;
})();