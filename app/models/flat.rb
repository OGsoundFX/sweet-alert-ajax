class Flat < ApplicationRecord
  enum :status, [:available, :booked]
end
