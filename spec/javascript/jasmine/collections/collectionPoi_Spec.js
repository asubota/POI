describe('POI Collection', function() {
  var collection;

  beforeEach(function() {
    collection = new PoiManager.PoiCollection();
  });

  it('is defined', function() {
    expect(collection).toBeDefined();
  });

  it('has url', function() {
    expect(collection.url).toEqual('/api/pois');
  });
});
