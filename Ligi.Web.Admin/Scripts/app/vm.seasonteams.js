define('vm.seasonteams',['ko'],
    function (ko) {
        var Init = function (selectedSeason) {
            var teams = function () {
                if (!selectedSeason()) {
                    return null;
                }
                var list = selectedSeason().teams();
                totalResults(list.length);
                return list;
            },
            totalResults = ko.observable(),
            pager = ko.pager(totalResults);
            return {
                teams: teams,
                pager: pager
            };
        };
        return {
            Init: Init
        };
    });