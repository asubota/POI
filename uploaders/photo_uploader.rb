class PhotoUploader < CarrierWave::Uploader::Base
  storage :file

  def default_url
    "/images/pois/" + [version_name, "default.jpg"].compact.join('_')
  end

  def store_dir
    'public/my/upload/directory'
  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end
end
