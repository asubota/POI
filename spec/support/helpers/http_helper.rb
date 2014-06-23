module HttpHelper
  include Rack::Test::Methods

  def json_data
    JSON::parse last_response.body
  end
end
