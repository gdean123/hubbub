class CreateItems < ActiveRecord::Migration
  def self.up
    create_table :items do |t|
      t.string :description
      t.integer :parent_id
      t.integer :user_id
      t.string :details
      t.integer :recurring
      t.string :tags
      t.string :location
      t.string :priority
      t.integer :completion_status
      t.datetime :due_date

      t.timestamps
    end
  end

  def self.down
    drop_table :items
  end
end
