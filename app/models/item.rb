class Item < ActiveRecord::Base
  attr_accessible :description, :details, :parent_id
  has_ancestry

  validate :description, :presence => {:message => "Description can not be blank"}
  
  def to_json(options = {})
    super(options.merge(:only => [ :id, :parent_id, :description, :details ]))
  end
  
end
