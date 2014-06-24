class PoiPresenter < Presenter
	def set_photo
		@data.each do |item|
			item.photo ||= '/images/pois/thumb/default.jpg'
		end
	end
end
