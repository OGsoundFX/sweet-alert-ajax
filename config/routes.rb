Rails.application.routes.draw do
  root to: "flats#index"
  
  get "book", to: "flats#book"
  get "book_alt", to: "flats#book_alt"
end
