class RemoveParentIdFromItems < ActiveRecord::Migration
  def self.up
    remove_column :items, :parent_id
  end

  def self.down
    add_column :items, :parent_id, :string
  end
end
