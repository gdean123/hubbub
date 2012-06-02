require 'spec_helper'

describe PagesController do

  describe "GET 'home'" do
    it "returns http success" do
      get 'home'
      response.should be_success
    end
  end

  describe "GET 'forest'" do
    it "returns http success" do
      get 'forest'
      response.should be_success
    end
  end

end
