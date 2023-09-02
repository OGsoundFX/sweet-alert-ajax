Rails.application.routes.draw do
  root to: "flats#index"
  
  get "book", to: "flats#book"
end
