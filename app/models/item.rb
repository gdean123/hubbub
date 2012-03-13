class Item < ActiveRecord::Base
  attr_accessible :description, :details
  validate :description
  
  def to_json(options = {})
    super(options.merge(:only => [ :id, :description, :details ]))
  end
  
end
