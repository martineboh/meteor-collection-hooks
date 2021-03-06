CollectionHooks.defineAdvice("findOne", function (userId, _super, aspects, getTransform, args) {
  var self = this
  var ctx = {context: self, _super: _super};
  var ret, abort;

  // args[0] : selector
  // args[1] : options

  args[0] = args[0] || {};
  args[1] = args[1] || {};

  // before
  _.each(aspects.before, function (aspect) {
    var r = aspect.call(ctx, userId, args[0], args[1]);
    if (r === false) abort = true;
  });

  if (abort) return false;

  function after(doc) {
    _.each(aspects.after, function (aspect) {
      aspect.call(ctx, userId, args[0], args[1], doc);
    });
  }

  ret = _super.apply(self, args);
  after(ret);

  return ret;
});