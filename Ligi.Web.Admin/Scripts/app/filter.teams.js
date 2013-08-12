define('filter.teams',
    ['ko','utils', 'config'],
    function (ko, utils, config) {
        var TeamFilter = function () {
            var self = this;
            self.searchText = ko.observable().extend({ throttle: config.throttle });
            return self;
        };

        TeamFilter.prototype = function () {
            var tagDelimiter = '|',
                escapedTagDelimiter = '\\|',
                searchTest = function (searchText, team) {
                    if (!searchText) return true; // always succeeds if no search text
                    var srch = utils.regExEscape(searchText.toLowerCase());
                    if (team.name().toLowerCase().search(srch) !== -1) return true;
                    debugger;
                    if ((tagDelimiter + team.tags().toLowerCase() + tagDelimiter)
                        .search(escapedTagDelimiter + srch + escapedTagDelimiter) !== -1) return true;
                    return false;
                },
                predicate = function(self, team) {
                    // Return true if all of these meet the filter criteria. Otherwise, return false
                    var match = searchTest(self.searchText(), team);
                    return match;
                };
            return {
                predicate: predicate
            };
        }();
        return TeamFilter;
    });