require 'rubygems'
require 'bundler/setup'

require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/config_file'
require 'sinatra/json'

require 'fileutils'
require 'carrierwave'
require 'carrierwave/orm/activerecord'

Dir['./{uploaders,presenters,models,helpers}/*.rb'].each { |file| require file }

require './controllers/app'

run Sinatra::Application
