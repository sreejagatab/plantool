<?php
/**
 * Plugin Name: AV Planning Tool
 * Plugin URI: https://yourwebsite.com/av-planner
 * Description: Professional audiovisual planning and quoting tool for events
 * Version: 1.0.0
 * Author: Your Company Name
 * Author URI: https://yourwebsite.com
 * License: GPL v2 or later
 * Text Domain: av-planner
 * Domain Path: /languages
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('AV_PLANNER_VERSION', '1.0.0');
define('AV_PLANNER_PLUGIN_URL', plugin_dir_url(__FILE__));
define('AV_PLANNER_PLUGIN_PATH', plugin_dir_path(__FILE__));

// Include required files
require_once AV_PLANNER_PLUGIN_PATH . 'includes/class-av-planner.php';
require_once AV_PLANNER_PLUGIN_PATH . 'includes/class-av-planner-shortcode.php';
require_once AV_PLANNER_PLUGIN_PATH . 'includes/class-av-planner-ajax.php';

// Initialize the plugin
function av_planner_init() {
    new AV_Planner();
    new AV_Planner_Shortcode();
    new AV_Planner_Ajax();
}
add_action('plugins_loaded', 'av_planner_init');

// Activation hook
register_activation_hook(__FILE__, 'av_planner_activate');
function av_planner_activate() {
    // Create database tables if needed
    av_planner_create_tables();
}

// Deactivation hook
register_deactivation_hook(__FILE__, 'av_planner_deactivate');
function av_planner_deactivate() {
    // Cleanup if needed
}

// Create database tables
function av_planner_create_tables() {
    global $wpdb;
    
    $table_name = $wpdb->prefix . 'av_planner_quotes';
    
    $charset_collate = $wpdb->get_charset_collate();
    
    $sql = "CREATE TABLE $table_name (
        id mediumint(9) NOT NULL AUTO_INCREMENT,
        quote_id varchar(50) NOT NULL,
        user_id bigint(20),
        event_name varchar(255) NOT NULL,
        event_date date,
        location varchar(255),
        guest_count int,
        event_type varchar(50),
        selected_package varchar(50),
        add_ons text,
        total_price decimal(10,2),
        form_data longtext,
        status varchar(20) DEFAULT 'draft',
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        updated_at datetime DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        UNIQUE KEY quote_id (quote_id)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql);
}
?>