require 'rubygems'
require 'bundler/setup'

require 'sinatra'
require 'sinatra/activerecord'
require 'sinatra/config_file'
require 'sinatra/json'

require 'fileutils'

require './helpers/app_helper'
require './controllers/app'

Dir['./presenters/*.rb'].each { |file| require file }
Dir['./models/*.rb'].each { |file| require file }

run Sinatra::Application
