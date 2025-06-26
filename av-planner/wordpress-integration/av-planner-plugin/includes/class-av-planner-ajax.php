<?php
/**
 * AV Planner AJAX Handler Class
 */

class AV_Planner_Ajax {
    
    public function __construct() {
        add_action('wp_ajax_av_planner_save_quote', array($this, 'save_quote'));
        add_action('wp_ajax_nopriv_av_planner_save_quote', array($this, 'save_quote'));
        
        add_action('wp_ajax_av_planner_get_quote', array($this, 'get_quote'));
        add_action('wp_ajax_nopriv_av_planner_get_quote', array($this, 'get_quote'));
    }
    
    public function save_quote() {
        // Verify nonce
        if (!wp_verify_nonce($_POST['nonce'], 'av_planner_nonce')) {
            wp_send_json_error('Security check failed');
            return;
        }
        
        global $wpdb;
        
        $quote_data = array(
            'quote_id' => sanitize_text_field($_POST['quote_id']),
            'user_id' => get_current_user_id(),
            'event_name' => sanitize_text_field($_POST['event_name']),
            'event_date' => sanitize_text_field($_POST['event_date']),
            'location' => sanitize_text_field($_POST['location']),
            'guest_count' => intval($_POST['guest_count']),
            'event_type' => sanitize_text_field($_POST['event_type']),
            'selected_package' => sanitize_text_field($_POST['selected_package']),
            'add_ons' => sanitize_text_field($_POST['add_ons']),
            'total_price' => floatval($_POST['total_price']),
            'form_data' => wp_kses_post($_POST['form_data']),
            'status' => 'draft'
        );
        
        $table_name = $wpdb->prefix . 'av_planner_quotes';
        
        $result = $wpdb->replace($table_name, $quote_data);
        
        if ($result !== false) {
            wp_send_json_success(array(
                'message' => 'Quote saved successfully',
                'quote_id' => $quote_data['quote_id']
            ));
        } else {
            wp_send_json_error('Failed to save quote');
        }
    }
    
    public function get_quote() {
        // Verify nonce
        if (!wp_verify_nonce($_REQUEST['nonce'], 'av_planner_nonce')) {
            wp_send_json_error('Security check failed');
            return;
        }
        
        global $wpdb;
        
        $quote_id = sanitize_text_field($_REQUEST['quote_id']);
        $table_name = $wpdb->prefix . 'av_planner_quotes';
        
        $quote = $wpdb->get_row(
            $wpdb->prepare("SELECT * FROM $table_name WHERE quote_id = %s", $quote_id)
        );
        
        if ($quote) {
            wp_send_json_success($quote);
        } else {
            wp_send_json_error('Quote not found');
        }
    }
}
?>