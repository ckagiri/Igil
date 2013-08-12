define('vm.seasons',['ko'],
    function (ko) {
        var Init = function(selectedLeague) {
            var
                seasons = function () {
                if (!selectedLeague()) {
                    return null;
                }
                var list = selectedLeague().seasons();
                totalResults(list.length);
                return list;
            },
            totalResults = ko.observable(),
            pager = ko.pager(totalResults);
            return {
                seasons: seasons,
                pager: pager,
            };
        };
        return {
            Init: Init
        };
    });