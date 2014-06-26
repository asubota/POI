class PoiPresenter < Presenter
  def prepare
    @data.each do |item|
      item.photo ||= photo_path
      item.lat = item.lat.to_f
      item.lng = item.lng.to_f
    end
  end

  def prepare_single
    @data.photo ||= photo_path
    @data.lat = @data.lat.to_f
    @data.lng = @data.lng.to_f

    @data
  end

  private
  def photo_path
    'images/pois/thumb/default.jpg'
  end
end
