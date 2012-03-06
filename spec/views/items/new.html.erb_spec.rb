require 'spec_helper'

describe "items/new" do
  before(:each) do
    assign(:item, stub_model(Item,
      :description => "MyString",
      :parent_id => 1,
      :user_id => 1,
      :details => "MyString",
      :recurring => 1,
      :tags => "MyString",
      :location => "MyString",
      :priority => "MyString",
      :completion_status => 1
    ).as_new_record)
  end

  it "renders new item form" do
    render

    # Run the generator again with the --webrat flag if you want to use webrat matchers
    assert_select "form", :action => items_path, :method => "post" do
      assert_select "input#item_description", :name => "item[description]"
      assert_select "input#item_parent_id", :name => "item[parent_id]"
      assert_select "input#item_user_id", :name => "item[user_id]"
      assert_select "input#item_details", :name => "item[details]"
      assert_select "input#item_recurring", :name => "item[recurring]"
      assert_select "input#item_tags", :name => "item[tags]"
      assert_select "input#item_location", :name => "item[location]"
      assert_select "input#item_priority", :name => "item[priority]"
      assert_select "input#item_completion_status", :name => "item[completion_status]"
    end
  end
end
