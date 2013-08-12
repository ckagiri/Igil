define('model.weekleader',
    ['ko', 'config'],
    function() {
        var WeekLeader = function() {
            var self = this;
            self.id = ko.observable();
            self.userId = ko.observable();
            self.userName = ko.observable();
            self.seasonId = ko.observable();
            self.totalPayout = ko.observable();
            self.totalStake = ko.observable();
            self.profit = ko.observable();
            self.startDate = ko.observable();
            self.endDate = ko.observable();
        };

        WeekLeader.Nullo = new WeekLeader()
            .id(0)
            .userId(0)
            .userName("Not a User")
            .seasonId(0)
            .totalPayout(0)
            .totalStake(0)
            .profit(0)
            .startDate(new Date(2010, 1, 1, 1, 0, 0, 0))
            .endDate(new Date(2010, 1, 1, 1, 0, 0, 0));
        
        return WeekLeader;
    });