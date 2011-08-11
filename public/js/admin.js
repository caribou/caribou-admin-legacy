triface.admin = function() {
    var template = function() {
        var table = function(items) {
            return $('#contentTable').tmpl({items: items, headings: _.keys(_.first(items))});
        };

        return {
            table: table
        };
    }();

    return {
        init: function() {
            triface.api.get({
                url: '/model',
                success: function(response) {
                    var body = template.table(response);
                    $('#triface').append(body);
                }
            });
        }
    };
}();



