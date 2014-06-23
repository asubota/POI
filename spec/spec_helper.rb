ENV['RACK_ENV'] = 'test'

require 'rspec'
require 'rack/test'
require 'database_cleaner'

require "./controllers/app"

RSpec.configure do |config|
  RSpec::Matchers.define :have_constant do |const|
    match do |owner|
      owner.const_defined?(const)
    end
  end

  Dir[File.dirname(__FILE__) + '/support/helpers/*_helper.rb'].each do |file|
    file =~ /[a-z]+_helper/
    require "support/helpers/#{$~[0]}"
    config.include $~[0].camelize.constantize
  end

  config.before(:suite) do
    DatabaseCleaner.strategy = :transaction
    DatabaseCleaner.clean_with(:truncation)
  end

  config.before(:each) do
    DatabaseCleaner.start
  end

  config.after(:each) do
    DatabaseCleaner.clean
  end

end
