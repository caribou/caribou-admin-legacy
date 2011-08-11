triface.admin = function() {
    var template = function() {
        var table = function(items) {
            return $('#contentTable').tmpl({items: items, headings: _.keys(_.first(items))});
        };

        return {
            table: table
        };
    }();

    var home = function() {
        var state = History.getState();
        var path = state.hash;
        var url = (path.length > 1) ? path : '/model';
        triface.api.get({
            url: url,
            success: function(response) {
                var body = template.table(response);
                $('#triface').html(body);
            }
        });
    };

    window.onstatechange = function(e) {
        home();
    };

    return {
        init: function() {
            triface.api.init();
            home();
        }
    };
}();



