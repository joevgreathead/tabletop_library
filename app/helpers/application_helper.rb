module ApplicationHelper

    def full_title(page_title)
        base = "PAX TT HQ"
        if page_title.empty?
            base
        else
            "#{base} - #{page_title}"
        end
    end
    
    def admin_label(user)
        base = ""
        if user.nil?
            base
        else
            "Logged in as: " + admin_name(user)
        end
    end
    
    def admin_name(user)
        if user.nil?
            nil
        else
            user.name
        end
    end
    
    def sign_out_link(user)
        if user.nil?
            nil
        else
            link_to 'sign out', signout_path, method: "delete"
        end
    end
    
    def tab_class(tab)
        current = 'current'
        case tab
        when 'checkout'
            if controller.class == CheckoutsController || session[:redirect] == 'checkout'
                logger.debug controller.class
                current
            end
        when 'return'
            if controller.class == ReturnsController
                current
            end
        when 'newattendee'
            if controller.class == AttendeesController && controller.action_name != 'index' && controller.action_name != 'show' && session[:redirect] != 'checkout'
                current
            end
        when 'admin'
            if controller.class == SessionsController
                current
            end
        else
            
        end
    end
    
    def current_pax_label
        current_pax = get_current_pax
        if current_pax
            current_pax.full_name
        else
            nil
        end
    end
    
    def get_current_pax
        pax = Pax.where({:current => true}).first
        if !pax
            Pax.find(:all, :order => 'start DESC').first
        else
            pax
        end
    end
    
end
