class ItemsController < ApplicationController
  # GET /items
  # GET /items.xml
  def index
    render :json => Item.all.as_json
  end

  # GET /items/1
  # GET /items/1.xml
  def show
    render :json => Item.find(params[:id]).to_json
  end

  # GET /items/new
  # GET /items/new.xml
  def new
  end

  # GET /items/1/edit
  def edit
    # @item = Item.find(params[:id])
  end

  # POST /items
  # POST /items.xml
  def create
    item = Item.create! params
    
    render :json => item
  end

  # PUT /items/1
  # PUT /items/1.xml
  def update
    item = Item.find_by_id(params[:id])
    
    # Create a new item if we were not able to find an item with the given id
    if item.nil?
      item = Item.new
      item.id = params[:id]
      item.parent_id = params[:parent_id]
      item.description = params[:description]
      item.details = params[:details]
      item.save!

    # If the item already existed, just update it's attributes
    else
      item.update_attributes! params    
    end
        
    render :json => item
  end

  # DELETE /items/1
  # DELETE /items/1.xml
  def destroy
    item = Item.find(params[:id])
    item.destroy
    render :json => item
  end
end
