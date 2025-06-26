#!/usr/bin/env node

/**
 * WordPress Build Script for AV Planning Tool
 * 
 * This script builds the React application and prepares it for WordPress integration.
 * It creates the necessary file structure and generates integration files.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BUILD_DIR = path.join(__dirname, '../dist');
const WORDPRESS_DIR = path.join(__dirname, '../wordpress-integration');
const PLUGIN_DIR = path.join(WORDPRESS_DIR, 'av-planner-plugin');

console.log('🚀 Building AV Planning Tool for WordPress...\n');

// Step 1: Build the React application
console.log('📦 Building React application...');
try {
  execSync('npm run build', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
  console.log('✅ React build completed\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Create WordPress integration directory structure
console.log('📁 Creating WordPress integration structure...');
const directories = [
  WORDPRESS_DIR,
  PLUGIN_DIR,
  path.join(PLUGIN_DIR, 'assets'),
  path.join(PLUGIN_DIR, 'includes'),
  path.join(WORDPRESS_DIR, 'shortcode'),
  path.join(WORDPRESS_DIR, 'theme-integration')
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`  Created: ${path.relative(__dirname, dir)}`);
  }
});

// Step 3: Copy built assets
console.log('\n📋 Copying built assets...');
const assetsDir = path.join(BUILD_DIR, 'assets');
const pluginAssetsDir = path.join(PLUGIN_DIR, 'assets');

if (fs.existsSync(assetsDir)) {
  copyDirectory(assetsDir, pluginAssetsDir);
  console.log('  Assets copied to plugin directory');
}

// Copy index.html for reference
if (fs.existsSync(path.join(BUILD_DIR, 'index.html'))) {
  fs.copyFileSync(
    path.join(BUILD_DIR, 'index.html'),
    path.join(PLUGIN_DIR, 'index.html.reference')
  );
  console.log('  Index.html copied as reference');
}

// Step 4: Generate WordPress plugin files
console.log('\n🔧 Generating WordPress plugin files...');

// Main plugin file
const pluginMainFile = `<?php
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
?>`;

fs.writeFileSync(path.join(PLUGIN_DIR, 'av-planner.php'), pluginMainFile);

// Main plugin class
const pluginClassFile = `<?php
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
?>`;

fs.writeFileSync(path.join(PLUGIN_DIR, 'includes', 'class-av-planner.php'), pluginClassFile);

// Shortcode class
const shortcodeClassFile = `<?php
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
?>`;

fs.writeFileSync(path.join(PLUGIN_DIR, 'includes', 'class-av-planner-shortcode.php'), shortcodeClassFile);

// AJAX class
const ajaxClassFile = `<?php
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
?>`;

fs.writeFileSync(path.join(PLUGIN_DIR, 'includes', 'class-av-planner-ajax.php'), ajaxClassFile);

// Step 5: Generate theme integration files
console.log('\n🎨 Generating theme integration files...');

// Shortcode integration
const shortcodeIntegration = `<?php
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
?>`;

fs.writeFileSync(path.join(WORDPRESS_DIR, 'shortcode', 'functions.php'), shortcodeIntegration);

// Page template
const pageTemplate = `<?php
/*
Template Name: AV Planner
*/

get_header(); ?>

<div class="av-planner-page">
    <div class="container">
        <?php while (have_posts()) : the_post(); ?>
            <h1 class="page-title"><?php the_title(); ?></h1>
            <div class="page-content">
                <?php the_content(); ?>
            </div>
        <?php endwhile; ?>
        
        <div id="av-planner-root"></div>
    </div>
</div>

<style>
.av-planner-page {
    padding: 2rem 0;
}
.av-planner-page .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}
</style>

<script src="<?php echo get_template_directory_uri(); ?>/av-planner/assets/index.js"></script>
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/av-planner/assets/index.css">

<?php get_footer(); ?>`;

fs.writeFileSync(path.join(WORDPRESS_DIR, 'theme-integration', 'page-av-planner.php'), pageTemplate);

// Step 6: Create README
const readmeContent = `# AV Planning Tool - WordPress Integration

This package contains everything needed to integrate the AV Planning Tool into WordPress.

## Installation Options

### Option 1: WordPress Plugin (Recommended)
1. Upload the \`av-planner-plugin\` folder to \`/wp-content/plugins/\`
2. Activate the plugin in WordPress admin
3. Use the shortcode \`[av_planner]\` on any page or post

### Option 2: Theme Integration
1. Copy the \`assets\` folder to your theme directory
2. Add the code from \`shortcode/functions.php\` to your theme's \`functions.php\`
3. Use the shortcode \`[av_planner]\` on any page or post

### Option 3: Page Template
1. Copy the \`assets\` folder to your theme directory
2. Copy \`theme-integration/page-av-planner.php\` to your theme directory
3. Create a new page and select "AV Planner" as the template

## Shortcode Options

\`\`\`
[av_planner width="100%" height="800px" theme="default" class="custom-class"]
\`\`\`

## Support

For support and customization, please refer to the WORDPRESS_INTEGRATION.md file.

Built on: ${new Date().toISOString()}
Version: 1.0.0
`;

fs.writeFileSync(path.join(WORDPRESS_DIR, 'README.md'), readmeContent);

console.log('✅ WordPress integration files generated\n');

// Step 7: Create zip file for easy distribution
console.log('📦 Creating distribution package...');
try {
  execSync(`cd "${WORDPRESS_DIR}" && zip -r av-planner-wordpress.zip .`, { stdio: 'inherit' });
  console.log('✅ Distribution package created: av-planner-wordpress.zip\n');
} catch (error) {
  console.log('⚠️  Could not create zip file (zip command not available)\n');
}

console.log('🎉 WordPress integration build completed!');
console.log('\nGenerated files:');
console.log(`  📁 ${path.relative(process.cwd(), WORDPRESS_DIR)}`);
console.log('  📄 Plugin files');
console.log('  📄 Theme integration files');
console.log('  📄 Documentation');
console.log('\nNext steps:');
console.log('  1. Review the generated files');
console.log('  2. Upload to your WordPress site');
console.log('  3. Follow the integration guide');

// Helper function to copy directory recursively
function copyDirectory(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  
  files.forEach(file => {
    const srcPath = path.join(src, file);
    const destPath = path.join(dest, file);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyDirectory(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  });
}
