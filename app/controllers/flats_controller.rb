class FlatsController < ApplicationController
  def index
    @flats = Flat.all
  end

  def book
    flat = Flat.find(params[:flat_id])
    flat.status = 1
    flat.save
    redirect_to root_path
  end
end
