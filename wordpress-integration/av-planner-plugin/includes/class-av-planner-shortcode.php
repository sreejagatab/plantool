<?php
/**
 * AV Planner Shortcode Class
 */

class AV_Planner_Shortcode {
    
    public function __construct() {
        add_shortcode('av_planner', array($this, 'render_shortcode'));
    }
    
    public function render_shortcode($atts) {
        $atts = shortcode_atts(array(
            'width' => '100%',
            'height' => '800px',
            'theme' => 'default',
            'class' => ''
        ), $atts, 'av_planner');
        
        $style = sprintf(
            'width: %s; height: %s;',
            esc_attr($atts['width']),
            esc_attr($atts['height'])
        );
        
        $class = 'av-planner-container ' . esc_attr($atts['class']);
        
        return sprintf(
            '<div id="av-planner-root" class="%s" style="%s" data-theme="%s"></div>',
            $class,
            $style,
            esc_attr($atts['theme'])
        );
    }
}
?>