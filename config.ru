require 'rubygems'
require 'bundler/setup'

require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/config_file'
require 'sinatra/json'

require 'fileutils'
require 'carrierwave'
require 'carrierwave/orm/activerecord'

require './helpers/app_helper'
require './uploaders/photo_uploader'
require './controllers/app'

Dir['./presenters/*.rb'].each { |file| require file }
Dir['./models/*.rb'].each { |file| require file }

run Sinatra::Application
