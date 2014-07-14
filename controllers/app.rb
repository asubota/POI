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
  poi.destroy
  status 200
end

put '/api/pois/:id' do
  new_params = accept_params params, allowed_params
  poi = Poi.find new_params[:id]

  photo_path = File.join settings.public_folder, new_params[:photo]
  poi.photo = File.open photo_path

  if poi.update_attributes new_params
    status 200
    json PoiPresenter.new(poi).prepare_single
  else
    status 422
    json poi.errors
  end
end

post '/api/pois' do
  new_params = accept_params params, allowed_params
  poi = Poi.new new_params

  photo_path = File.join settings.public_folder, new_params[:photo]
  poi.photo = File.open photo_path

  if poi.save
    status 200
    json PoiPresenter.new(poi).prepare_single
  else
    status 422
    json poi.errors
  end
end

private
def allowed_params
  %i{id title description lat lng visited priority photo time}
end
