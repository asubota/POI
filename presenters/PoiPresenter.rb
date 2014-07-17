class PoiPresenter < Presenter

  def self.prepare(data)
    if data.respond_to? :map
      data.map{ |item| self.update item }
    else
      update data
    end
  end

  private
  def self.update(item)
    item
  end

end
