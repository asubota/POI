class PhotoUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  storage :file

  version :thumb do
    process :resize_to_fill => [200,200]
  end

  def default_url
    "/images/pois/" + [version_name, "default.jpg"].compact.join('_')
  end

  def store_dir
    'public/my/upload/directory'
  end

  def cache_dir
    'tmp1/projectname-cache'
  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end
end
