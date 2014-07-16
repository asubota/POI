class Poi < ActiveRecord::Base
  mount_uploader :photo, PhotoUploader

  after_initialize :extract_geolocation

  def extract_geolocation
    if new_record? && photo.path.present?
      image = MiniMagick::Image.open photo.path

      self.lat, self.lng = %w{Latitude Longitude}.map{|key| parse_geo image["%[exif:GPS#{key}]:%[exif:GPS#{key}Ref]"] }
    end
  end

  private
  def parse_geo(str)
    return nil if str == ':'
    dms, ref = str.split ':'

    decimals = dms.split(',').map(&:strip).map{|r| Rational(r)} # [50.0, 25.0, 5.3878]

    decimal = decimals.each_with_index{|val, i| decimals[i] = val / 60 ** i }.reduce(:+).to_f
    decimal*-1 if %w{S W}.include? ref

    decimal
  end
end
