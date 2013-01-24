class PaxesController < ApplicationController
    before_filter :signed_in_user, only: [:index, :show, :new, :edit]

    def index
        @paxes = Pax.all
    end

    def show
        @pax = Pax.find(params[:id])
    end

    def new
        @pax = Pax.new
    end

    def edit
        @pax = Pax.find(params[:id])
    end

    def create
        @pax = Pax.new(params[:pax])

        if @pax.save
            set_to_current_pax @pax
            redirect_to paxes_path, notice: 'Pax was successfully created.'
        else
            render action: "new"
        end
    end

    def update
        @pax = Pax.find(params[:id])

        if @pax.update_attributes(params[:pax])
            redirect_to @pax, notice: 'Pax was successfully updated.'
        else
            render action: "edit"
        end
    end

    def destroy
        set_to_current_pax params

        redirect_to paxes_path
    end

    private
  
    def set_to_current_pax(pax)
        current = Pax.where({:current => true}).first
        if current
            current.update_attributes({
                :current => false
            })
        end
        new_current = Pax.find(pax[:id])
        new_current.update_attributes({
            :current => true
        })
    end

end
