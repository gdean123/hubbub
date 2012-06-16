class AddParentIdToItem < ActiveRecord::Migration
  def self.up
    add_column :items, :parent_id, :string
  end

  def self.down
    remove_column :items, :parent_id, :string
  end
end
