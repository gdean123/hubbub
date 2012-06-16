class RemoveAncestryFromItem < ActiveRecord::Migration
  def self.up
    remove_column :items, :ancestry
  end

  def self.down
    add_column :items, :ancestry, :string
  end
end
