require 'spec_helper'

describe 'CRUD' do
  describe 'create' do
  end

  describe 'read' do
    context 'all' do
      before(:all) { get '/api/pois' }

      it { expect(last_response.status).to eq 200 }
      it { expect(last_response.header['Content-Type']).to include 'application/json' }
    end

    context 'single' do

    end
  end

  describe 'update' do

  end

  describe 'delete' do

  end
end
