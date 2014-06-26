require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/config_file'
require 'sinatra/json'
require 'fileutils'

require "./helpers/app_helper"

helpers AppHelper

Dir["./presenters/*.rb"].each { |file| require file }
Dir["./models/*.rb"].each {|file| require file }

UPLOADS_DIR = 'uploads'
TMP_DIR = 'tmp'

configure do
  config_file './../config/app.yml'
  set :views, settings.root + '/../views'
  set :public_folder, File.dirname(__FILE__) + '/../public' # has LOWER priority during filesearch
  use Rack::Static, urls: ["/#{UPLOADS_DIR}"], root: TMP_DIR
end

before do
  params.merge! json_body_params
end

post '/upload' do
  path = File.join TMP_DIR, UPLOADS_DIR
  FileUtils.mkdir_p path unless File.directory? path

  unless params[:file] && (tmpfile = params[:file][:tempfile]) && (name = params[:file][:filename])
    status 422
    return json 'fail'
  end

  FileUtils.copy tmpfile.path, "#{path}/#{name}"
  json url: File.join(UPLOADS_DIR, name)
end

get '/' do
  erb :index
end

get '/api/pois' do
  data = PoiPresenter.new(Poi.all).set_photo
  json data
end

get '/api/pois/:id' do
  data = PoiPresenter.new(Poi.find params[:id]).set_photo_single
  json data
end

delete '/api/pois/:id' do
  Poi.find(params[:id]).destroy
  status 200
end

put '/api/pois/:id' do
  new_params = accept_params params, :id, :title, :description, :lat, :lng, :visited, :priority
  poi = Poi.find new_params[:id]

  if poi.update_attributes new_params
    status 200
    json PoiPresenter.new(poi).set_photo_single
  else
    status 422
    json poi.errors
  end
end

post '/api/pois' do
  new_params = accept_params params, :id, :title, :description, :lat, :lng, :visited, :priority
  poi = Poi.new new_params

  if poi.save
    status 200
    json PoiPresenter.new(poi).set_photo_single
  else
    status 422
    json poi.errors
  end
end
