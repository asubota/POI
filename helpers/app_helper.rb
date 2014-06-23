module AppHelper
  def json_body_params
    @json_body_params ||= begin
      MultiJson.load(request.body.read.to_s, symbolize_keys: true)
    rescue MultiJson::LoadError
      {}
    end
  end

  def accept_params(params, *fields)
    fields.flatten!
    h = {}
    fields.each do |name|
      h[name] = params[name] unless params[name].nil?
    end
    h
  end

  def get_title
    settings.appName
  end
end
