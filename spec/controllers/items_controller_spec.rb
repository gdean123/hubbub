require 'spec_helper'

describe ItemsController do

  # This should return the minimal set of attributes required to create a valid
  # Item. As you add validations to Item, be sure to
  # update the return value of this method accordingly.
  def valid_attributes
    {
        :description => "a description"
    }
  end
  
  # This should return the minimal set of values that should be in the session
  # in order to pass any filters (e.g. authentication) defined in
  # ItemsController. Be sure to keep this updated too.
  def valid_session
    {}
  end

  describe "GET index" do
    it "returns JSON string containing all items" do
      item = Item.create! valid_attributes
      get :index, valid_session
      json = JSON(response.body)
      json[0]["description"].should eq "a description"
    end
  end

  describe "GET show" do
    it "returns JSON string containing the item" do
      item = Item.create! valid_attributes
      get :show, {:id => item.to_param}, valid_session
      json = JSON(response.body)
      json["description"].to_s.should eq "a description"
    end
  end
    
  describe "POST create" do
   describe "with valid params" do
     it "creates a new Item" do
       expect {
         post :create, valid_attributes, valid_session
       }.to change(Item, :count).by(1)
     end
  
     it "returns JSON string containing the item" do
       post :create, valid_attributes, valid_session
       json = JSON(response.body)
       json["description"].to_s.should eq "a description"       
     end
   end
  
   describe "with invalid params" do
     it "returns a json string with a nil description" do
       # Trigger the behavior that occurs when invalid params are submitted
       Item.any_instance.stub(:save).and_return(false)
       post :create, {}, valid_session
       json = JSON(response.body)
       json["description"].should be_nil
     end
   end
  end
  
  describe "PUT update" do
   describe "with valid params" do
     it "updates the requested item" do
       item = Item.create! valid_attributes
       # Assuming there are no other items in the database, this
       # specifies that the Item created on the previous line
       # receives the :update_attributes message with whatever params are
       # submitted in the request.
       # Item.any_instance.should_receive(:update_attributes).with({'description' => 'testing'}) 
       put :update, {:id => item.to_param, :description => 'testing'}, valid_session 
       json = JSON(response.body)
       json["description"].to_s.should eq "testing"       
     end  
   end
  
   describe "with invalid params" do
     it "returns a json string with a nil description" do
       # Trigger the behavior that occurs when invalid params are submitted
       item = Item.create! {}
       Item.any_instance.stub(:save).and_return(false)
       put :update, {:id => item.to_param}, valid_session
       json = JSON(response.body)
       json["description"].should be_nil
     end
   end
  end
  
  describe "DELETE destroy" do
   it "destroys the requested item" do
     item = Item.create! valid_attributes
     expect {
       delete :destroy, {:id => item.to_param}, valid_session
     }.to change(Item, :count).by(-1)
   end
  end

end
