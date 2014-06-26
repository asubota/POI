class CreatePois < ActiveRecord::Migration
  def change
    create_table :pois do |t|
      t.column :title, :string
      t.column :description, :string
      t.column :photo, :string
      t.column :time, :string
      t.column :visited, :boolean
      t.column :priority, :integer
      t.column :lat, :float
      t.column :lng, :float
    end
  end
end
