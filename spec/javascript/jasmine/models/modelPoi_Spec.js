describe('POI Model', function() {
  var model;

  beforeEach(function() {
    model = new PoiManager.Poi();
  });

  it('is defined', function() {
    expect(model).toBeDefined();
  });

  it('has default values', function() {
    expect(model.get('title')).toEqual('New POI title');
    expect(model.get('description')).toEqual('New POI description');
    expect(model.get('time')).toEqual('1h');
  });

  it('has urlRoot', function() {
    expect(model.urlRoot).toEqual('/api/pois');
  });
});
