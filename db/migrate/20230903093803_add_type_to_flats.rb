class AddTypeToFlats < ActiveRecord::Migration[7.0]
  def change
    add_column :flats, :kind, :string
  end
end
