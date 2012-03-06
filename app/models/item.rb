class Item < ActiveRecord::Base
  attr_accessible :description, :details
  
  def to_json(options = {})
    super(options.merge(:only => [ :id, :description, :details ]))
  end
  
end
