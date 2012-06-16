# http://stackoverflow.com/questions/1200568/using-rails-how-can-i-set-my-primary-key-to-not-be-an-integer-typed-column
# execute "ALTER TABLE items ADD PRIMARY KEY (id);"

class ChangeItemIdToGuid < ActiveRecord::Migration
  def self.up
    change_column :items, :id, :string
  end

  def self.down
    change_column :items, :id, :integer
  end
end