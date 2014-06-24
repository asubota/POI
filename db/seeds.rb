Dir["./models/*.rb"].each {|file| require file }

(1..3).each do |i|
	info = {
		title: "poi-title-#{i}",
		description: "poi-description-#{i}",
		photo: nil,
		priority: i,
		visited: false,
		lat:50,
		lng: 31
	}

	Poi.create info
end
