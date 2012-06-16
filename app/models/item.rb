class Item < ActiveRecord::Base
  set_primary_key :id
  attr_accessible :description, :details, :parent_id

  validate :description, :presence => {:message => "Description can not be blank"}
  
  def as_json(options = {})
    super(:only => [ :id, :parent_id, :description, :details ])
  end
  
end
