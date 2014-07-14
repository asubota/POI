helpers AppHelper

UPLOADS_DIR = 'uploads/pois'
TMP_DIR = 'tmp'

configure do
  config_file './config/app.yml'
  set :views, settings.root + '/views'
  set :public_folder, settings.root + '/public'
  use Rack::Static, urls: ["/#{UPLOADS_DIR}"], root: TMP_DIR
end

before do
  params.merge! json_body_params
end

post '/upload' do
  poi = Poi.new photo: params[:photo]
  json poi.photo
end

get '/' do
  erb :index
end

get '/api/pois' do
  data = PoiPresenter.new(Poi.all).prepare
  json data
end

get '/api/pois/:id' do
  data = PoiPresenter.new(Poi.find params[:id]).prepare_single
  json data
end

delete '/api/pois/:id' do
  poi = Poi.find params[:id]
  delete_photo poi.photo unless poi.photo.nil?
  poi.destroy
  status 200
end

put '/api/pois/:id' do
  new_params = accept_params params, allowed_params
  poi = Poi.find new_params[:id]

  if poi.update_attributes new_params
    status 200
    update_photo poi
    json PoiPresenter.new(poi).prepare_single
  else
    status 422
    json poi.errors
  end
end

post '/api/pois' do
  new_params = accept_params params, allowed_params
  poi = Poi.new new_params

  if poi.save
    status 200
    update_photo poi
    json PoiPresenter.new(poi).prepare_single
  else
    status 422
    json poi.errors
  end
end

private
def update_photo(poi)
  if poi.photo =~ /uploads/
    ext = File.extname poi.photo
    file_path = 'images/pois'
    file_name = "#{poi.id}#{ext}"

    from_path = File.join Dir.pwd, TMP_DIR, poi.photo
    to_path = File.join Dir.pwd, 'public', file_path, file_name

    FileUtils.copy from_path, to_path
    poi.update_attributes photo: File.join(file_path, file_name)
    File.delete from_path
  end
end

def delete_photo(photo) # images/pois/24.png
  file_path = File.join Dir.pwd, 'public', photo
  File.delete file_path if File.exist?(file_path) && photo !~ /default\.jpg\z/
end

def allowed_params
  %i{id title description lat lng visited priority photo time}
end
