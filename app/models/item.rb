class Item < ActiveRecord::Base
  attr_accessible :description, :details
  validate :description, :presence => {:message => "Description can not be blank"}
  
  def to_json(options = {})
    super(options.merge(:only => [ :id, :description, :details ]))
  end
  
end
