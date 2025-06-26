<?php
/**
 * AV Planner Shortcode Integration
 * Add this code to your theme's functions.php file
 */

// Enqueue AV Planner assets
function av_planner_enqueue_assets() {
    wp_enqueue_style('av-planner-css', get_template_directory_uri() . '/av-planner/assets/index.css');
    wp_enqueue_script('av-planner-js', get_template_directory_uri() . '/av-planner/assets/index.js', array(), '1.0.0', true);
    
    // Localize script
    wp_localize_script('av-planner-js', 'avPlannerConfig', array(
        'ajaxUrl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('av_planner_nonce'),
        'siteUrl' => home_url(),
        'contactEmail' => get_option('admin_email'),
        'companyName' => get_bloginfo('name')
    ));
}

// AV Planner shortcode
function av_planner_shortcode($atts) {
    $atts = shortcode_atts(array(
        'width' => '100%',
        'height' => '800px'
    ), $atts);
    
    av_planner_enqueue_assets();
    
    return '<div id="av-planner-root" style="width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . ';"></div>';
}
add_shortcode('av_planner', 'av_planner_shortcode');
?>