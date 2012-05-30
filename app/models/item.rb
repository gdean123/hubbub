class Item < ActiveRecord::Base
  attr_accessible :description, :details
  has_ancestry

  validate :description, :presence => {:message => "Description can not be blank"}
  
  def to_json(options = {})
    super(options.merge(:only => [ :id, :description, :details ]))
  end
  
end
