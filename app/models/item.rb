class Item < ActiveRecord::Base
  has_ancestry
  attr_accessible :description, :details, :parent_id

  validate :description, :presence => {:message => "Description can not be blank"}
  
  def as_json(options = {})
    puts parent_id
    super(:only => [ :id, :description, :details ], :methods => :parent_id)
  end
  
end
