require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/config_file'
require "sinatra/json"

require "./helpers/app_helper"

Dir["./presenters/*.rb"].each { |file| require file }
Dir["./models/*.rb"].each {|file| require file }

helpers AppHelper

configure do
  config_file './../config/app.yml'
  set :views, settings.root + '/../views'
  set :public_folder, File.dirname(__FILE__) + '/../assets'
end

before do
  params.merge! json_body_params
end

get '/' do
  erb :index
end

get '/pois' do
  data = Poi.all
  json data
end

get "/pois/:id" do
  data = Poi.find params[:id]
  json data
end

delete "/pois/:id" do
  Poi.find(params[:id]).destroy
  status 200
end

put "/pois/:id" do
  data = Poi.find(params[:id])
  if data.update_attributes(params[:poi])
    status 201
    json data
  else
    status 422
    json data.errors
  end
end

post "/pois" do
  data = Poi.new(params[:poi])
  if data.save
    status 200
    json data
  else
    status 422
    json data.errors
  end
end
