define('model.team',
    ['ko', 'config'],
    function (ko, config) {
        var Team = function () {
            var self = this;
            self.id = ko.observable();
            self.name = ko.observable().extend({ required: true });
            self.code = ko.observable().extend({ required: true });
            self.homeGround = ko.observable().extend({ required: true });
            self.tags = ko.observable();
            self.tagsFormatted = ko.computed({
                read: function () {
                    var text = self.tags();
                    return text ? text.replace(/\|/g, ', ') : text;
                },

                write: function (value) {
                    self.tags(value.replace(/\, /g, '|'));
                }
            }),
            self.teamHash = ko.computed(function () {
                return config.hashes.teams + '/' + self.id();
            });
            self.dirtyFlag = new ko.DirtyFlag([
                self.name,
                self.code,
                self.homeGround]);
            return self;
        };

        Team.Nullo = new Team()
            .id(0)
            .name('Not a Team')
            .code('')
            .homeGround('');
        Team.Nullo.isNullo = true;
        Team.Nullo.dirtyFlag().reset();

        var _dc = null;
        Team.datacontext = function (dc) {
            if (dc) { _dc = dc; }
            return _dc;
        };

        return Team;
});