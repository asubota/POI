class PoiPresenter < Presenter
  def set_photo
    @data.each do |item|
      item.photo ||= photo_path
    end
  end

  def set_photo_single
    @data.photo ||= photo_path
    @data
  end

  private

  def photo_path
    '/images/pois/thumb/default.jpg'
  end
end
