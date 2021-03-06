class Attendee < ActiveRecord::Base
  attr_accessible :barcode, :enforcer, :first_name, :handle, :last_name, :pax_id
  belongs_to :pax
  
  has_many :checkouts
  
  validates_format_of :barcode, :with => /^[a-z]{3}\d{3,4}[a-z0-9]{2}$/i #also in application_controller.rb!
  #validates :barcode, presence: true
  validates :first_name, presence: true
  validates :last_name, presence: true
  
  def name
     last_name + ", " + first_name 
  end
end
