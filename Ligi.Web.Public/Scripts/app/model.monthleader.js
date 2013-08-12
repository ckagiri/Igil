define('model.monthleader',
    ['ko', 'config'],
    function() {
        var MonthLeader = function() {
            var self = this;
            self.id = ko.observable();
            self.userId = ko.observable();
            self.userName = ko.observable();
            self.seasonId = ko.observable();
            self.totalPayout = ko.observable();
            self.totalStake = ko.observable();
            self.profit = ko.observable();
            self.year = ko.observable();
            self.month = ko.observable();
        };

        MonthLeader.Nullo = new MonthLeader()
            .id(0)
            .userId(0)
            .userName("Not a User")
            .seasonId(0)
            .totalPayout(0)
            .totalStake(0)
            .profit(0)
            .year(2010)
            .month(1);

        return MonthLeader;
    });