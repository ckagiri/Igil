LigiAdmin.module('Entities', function (Entities, LigiAdmin, Backbone, Marionette, $, _) {
    Entities.Repository = function (options) {
        var original = options.collection;
        var stored = new original.constructor();
        stored.add(original.models);
        stored.filterFunction = options.filterFunction;

        stored.filter = function (filterCriterion) {
            stored._currentFilter = 'filter';
            var items = applyFilter(filterCriterion, 'filter');

            // reset the stored collection with the new items
            stored.reset(items);
        };
        


        stored.where = function (filterCriterion) {
            stored._currentFilter = 'where';
            var items = applyFilter(filterCriterion, 'where');

            // reset the stored collection with the new items
            stored.reset(items);
        };

        // when the original collection is reset,
        // the stored collection will re-filter itself
        // and end up with the new stored result set
        original.on("reset", function () {
            var items = applyFilter(stored._currentCriterion, stored._currentFilter);

            // reset the stored collection with the new items
            stored.reset(items);
        });

        // if the original collection gets models added to it:
        // 1. create a new collection
        // 2. filter it
        // 3. add the stored models (i.e. the models that were added *and*
        //     match the filtering criterion) to the `stored` collection
        original.on("add", function (models) {
            var coll = new original.constructor();
            coll.add(models);
            var items = applyFilter(stored._currentCriterion, stored._currentFilter, coll);
            stored.add(items);
        });

        return stored;
    };
});