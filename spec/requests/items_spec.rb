require 'spec_helper'

describe "Items" do
  describe "GET /items" do
    it "works!" do
      get items_path
      response.status.should be(200)
    end
  end
end
