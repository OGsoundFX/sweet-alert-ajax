class CreateFlats < ActiveRecord::Migration[7.0]
  def change
    create_table :flats do |t|
      t.string :name
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
