class Item < ActiveRecord::Base
  set_primary_key :id
  has_ancestry :primary_key_format => /[A-Z0-9\-]*/i
  attr_accessible :description, :details, :parent_id

  validate :description, :presence => {:message => "Description can not be blank"}
  
  def as_json(options = {})
    super(:only => [ :id, :description, :details ], :methods => :parent_id)
  end
  
end
