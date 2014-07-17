helpers AppHelper

configure do
  config_file './config/app.yml'
  set :views, settings.root + '/views'
  set :public_folder, settings.root + '/public'
end

before do
  params.merge! json_body_params
end

post '/upload' do
  poi = Poi.new photo: params[:photo]
  json PoiPresenter.prepare(poi)
end

get '/' do
  erb :index
end

get '/api/pois' do
  json PoiPresenter.prepare(Poi.all)
end

get '/api/pois/:id' do
  new_params = accept_params params, allowed_params
  poi = Poi.find new_params[:id]

  json PoiPresenter.prepare(poi)
end

delete '/api/pois/:id' do
  new_params = accept_params params, allowed_params
  poi = Poi.find new_params[:id]
  poi.destroy
  status 200
end

put '/api/pois/:id' do
  new_params = accept_params params, allowed_params
  poi = Poi.find new_params[:id]

  unless params[:photo_path].blank?
    photo_path = File.join settings.public_folder, params[:photo_path]
    poi.photo = File.open photo_path
  end

  if poi.update_attributes new_params
    status 200
    json PoiPresenter.prepare(poi)
  else
    status 422
    json poi.errors
  end
end

post '/api/pois' do
  new_params = accept_params params, allowed_params
  poi = Poi.new new_params

  unless params[:photo_path].blank?
    photo_path = File.join settings.public_folder, params[:photo_path]
    poi.photo = File.open photo_path
  end

  if poi.save
    status 200
    json PoiPresenter.prepare(poi)
  else
    status 422
    json poi.errors
  end
end
