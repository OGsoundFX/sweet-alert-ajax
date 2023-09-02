class FlatsController < ApplicationController
  def index
    @flats = Flat.all.order(:id)
  end

  def book
    flat = Flat.find(params[:flat_id])
    flat.status = 1
    flat.save
    respond_to do |format|
      format.html { redirect_to root_path }
      format.text { render partial: "flat", locals: {flat: flat}, formats: [:html] }
    end
  end

  def book_alt
    flat = Flat.find(params[:flat_id])
    flat.status = 1
    flat.save
    redirect_to root_path
  end
end
