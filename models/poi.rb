class Poi < ActiveRecord::Base
  mount_uploader :photo, PhotoUploader
end
