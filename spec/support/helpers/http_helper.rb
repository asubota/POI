module HttpHelper
  include Rack::Test::Methods

  def app() Sinatra::Application end

  def json_data
    JSON::parse last_response.body
  end
end
