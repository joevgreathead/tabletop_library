class AttendeesController < ApplicationController

  def create
    missing_fields = Array.new
    params.each do |k, v|
      if v.nil? || v.empty?
        missing_fields << k unless k == 'handle'
      end
    end

    enforcer = !params[:handle].empty?
    
    @attendee = Attendee.new({
        first_name: capitalize_all(params[:first_name]),
        last_name: capitalize_all(params[:last_name]),
        handle: capitalize_all(params[:handle]),
        enforcer: enforcer,
        barcode: params[:co_a_id].upcase,
        pax_id: get_current_pax.id
        })
    
    render json: {
      success: @attendee.save,
      missing: missing_fields
      }
  end
  
  # checks to see if attendee exists and whether or not it has open checkouts
  # valid: always true if attendee exists
  # info:
  # message: 
  # games: 
  # coCount: 
  # hasGames: true if more than 0 open checkouts exist
  def get_attendee_by_id
    a_id = params[:a_id].upcase
    att = Attendee.where(:barcode => a_id, :pax_id => get_current_pax.id).first
    
    render json: get_attendee_data(att)
  end
  
  #def get_attendee_by_name
  #  get params
  #  att = Attendee.where() #etc
    
  #  render json: get_attendee_data(att)
  #end
  
  private
  def get_attendee_data(att)
    att_info = nil
    message = ''
    games = []
    
    if att
      Checkout.where(:attendee_id => att.id, :closed => false, :pax_id => get_current_pax.id).each do |co|
        games << {
          barcode: co.game.barcode,
          name: co.game.name,
          title: co.game.title_name,
          publisher: co.game.publisher_name
        }
      end
      
      if games.size > 0
        message = " has #{games.size} #{'game'.pluralize(games.size)} checked out."
      end
      
      att_info = {
        barcode: att.barcode,
        name: att.name,
        lastName: att.last_name,
        firstName: att.first_name,
        handle: att.handle,
        enforcer: att.enforcer
      }
    end
    
    return {
      valid: att,
      info: att_info,
      status: att ? message : 'Attendee does not exist.',
      games: games,
      hasGames: games.size > 0
      }
  end
  
end
