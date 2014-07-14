class Poi < ActiveRecord::Base
  attr_accessor :photo_cache
  mount_uploader :photo, PhotoUploader
end
