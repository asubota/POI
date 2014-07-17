class PhotoUploader < CarrierWave::Uploader::Base
  include CarrierWave::MiniMagick

  storage :file

  version :full do
    process resize_to_fill: [800,600]
  end

  version :medium, from_version: :full do
    process resize_to_fill: [400,300]
  end

  version :small, from_version: :medium do
    process resize_to_fill: [60,45]
  end

  def filename
    if original_filename.present?
      name ||= Digest::MD5.hexdigest File.dirname(current_path)
      "#{name}.#{file.extension}"
    end
  end

  def default_url
    "/images/pois/" + [version_name, "default.jpg"].compact.join('_')
  end

  def store_dir
    "images/pois"
  end

  def cache_dir
    "tmp_upload"
  end

  def extension_white_list
    %w{jpg jpeg gif png}
  end
end
