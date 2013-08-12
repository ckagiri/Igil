define('model.seasonleader',
    ['ko', 'config'],
    function() {
        var SeasonLeader = function() {
            var self = this;
            self.id = ko.observable();
            self.userId = ko.observable();
            self.userName = ko.observable();
            self.seasonId = ko.observable();
            self.totalPayout = ko.observable();
            self.totalStake = ko.observable();
            self.profit = ko.observable();
        };

        SeasonLeader.Nullo = new SeasonLeader()
            .id(0)
            .userId(0)
            .userName("Not a User")
            .seasonId(0)
            .totalPayout(0)
            .totalStake(0)
            .profit(0);

        return SeasonLeader;
    });