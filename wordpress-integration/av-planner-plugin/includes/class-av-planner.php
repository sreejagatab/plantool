<?php
/**
 * Main AV Planner Plugin Class
 */

class AV_Planner {
    
    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_head', array($this, 'add_config_script'));
    }
    
    public function enqueue_scripts() {
        // Only load on pages with the shortcode or specific page templates
        if ($this->should_load_scripts()) {
            wp_enqueue_style(
                'av-planner-css',
                AV_PLANNER_PLUGIN_URL . 'assets/index.css',
                array(),
                AV_PLANNER_VERSION
            );
            
            wp_enqueue_script(
                'av-planner-js',
                AV_PLANNER_PLUGIN_URL . 'assets/index.js',
                array(),
                AV_PLANNER_VERSION,
                true
            );
            
            // Localize script with WordPress data
            wp_localize_script('av-planner-js', 'avPlannerWP', array(
                'ajaxUrl' => admin_url('admin-ajax.php'),
                'nonce' => wp_create_nonce('av_planner_nonce'),
                'userId' => get_current_user_id(),
                'siteUrl' => home_url(),
                'pluginUrl' => AV_PLANNER_PLUGIN_URL,
                'contactEmail' => get_option('av_planner_contact_email', get_option('admin_email')),
                'companyName' => get_option('av_planner_company_name', get_bloginfo('name')),
                'phone' => get_option('av_planner_phone', ''),
            ));
        }
    }
    
    public function add_config_script() {
        if ($this->should_load_scripts()) {
            echo '<script>window.avPlannerConfig = window.avPlannerWP || {};</script>';
        }
    }
    
    private function should_load_scripts() {
        global $post;
        
        // Load on pages with shortcode
        if (is_a($post, 'WP_Post') && has_shortcode($post->post_content, 'av_planner')) {
            return true;
        }
        
        // Load on specific page templates
        if (is_page_template('page-av-planner.php')) {
            return true;
        }
        
        return false;
    }
}
?>