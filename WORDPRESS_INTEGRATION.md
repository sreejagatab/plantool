# WordPress Integration Guide for AV Planning Tool

This guide explains how to integrate the AV Planning Tool into a WordPress website.

## Build Process

### 1. Build the Application

```bash
npm run build
```

This creates a `dist` folder with the compiled application.

### 2. WordPress Integration Options

#### Option A: Shortcode Integration (Recommended)

1. **Upload Files**
   - Upload the contents of `dist/assets/` to `/wp-content/themes/your-theme/av-planner/`
   - Or upload to `/wp-content/uploads/av-planner/`

2. **Create Shortcode**
   Add this to your theme's `functions.php`:

```php
function av_planner_shortcode($atts) {
    $atts = shortcode_atts(array(
        'width' => '100%',
        'height' => '800px',
        'theme' => 'default'
    ), $atts);
    
    // Enqueue styles and scripts
    wp_enqueue_style('av-planner-css', get_template_directory_uri() . '/av-planner/index.css');
    wp_enqueue_script('av-planner-js', get_template_directory_uri() . '/av-planner/index.js', array(), '1.0.0', true);
    
    return '<div id="av-planner-root" style="width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . ';"></div>';
}
add_shortcode('av_planner', 'av_planner_shortcode');
```

3. **Use Shortcode**
   Add `[av_planner]` to any page or post.

#### Option B: Page Template Integration

1. **Create Custom Page Template**
   Create `page-av-planner.php` in your theme:

```php
<?php
/*
Template Name: AV Planner
*/

get_header(); ?>

<div class="av-planner-container">
    <div id="av-planner-root"></div>
</div>

<script src="<?php echo get_template_directory_uri(); ?>/av-planner/index.js"></script>
<link rel="stylesheet" href="<?php echo get_template_directory_uri(); ?>/av-planner/index.css">

<?php get_footer(); ?>
```

2. **Create Page**
   - Create a new page in WordPress
   - Select "AV Planner" as the page template

#### Option C: Plugin Integration

1. **Create Plugin Structure**
```
av-planner-plugin/
├── av-planner.php
├── assets/
│   ├── index.js
│   ├── index.css
│   └── images/
└── readme.txt
```

2. **Main Plugin File** (`av-planner.php`):

```php
<?php
/**
 * Plugin Name: AV Planning Tool
 * Description: Professional audiovisual planning and quoting tool
 * Version: 1.0.0
 * Author: Your Name
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

class AVPlannerPlugin {
    
    public function __construct() {
        add_action('init', array($this, 'init'));
        add_shortcode('av_planner', array($this, 'shortcode'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_scripts'));
    }
    
    public function init() {
        // Plugin initialization
    }
    
    public function enqueue_scripts() {
        if (is_page() && has_shortcode(get_post()->post_content, 'av_planner')) {
            wp_enqueue_style('av-planner-css', plugin_dir_url(__FILE__) . 'assets/index.css');
            wp_enqueue_script('av-planner-js', plugin_dir_url(__FILE__) . 'assets/index.js', array(), '1.0.0', true);
        }
    }
    
    public function shortcode($atts) {
        $atts = shortcode_atts(array(
            'width' => '100%',
            'height' => '800px'
        ), $atts);
        
        return '<div id="av-planner-root" style="width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . ';"></div>';
    }
}

new AVPlannerPlugin();
?>
```

## Configuration Options

### Environment Variables

Create a `wp-config.php` section for AV Planner settings:

```php
// AV Planner Configuration
define('AV_PLANNER_API_URL', 'https://your-api-endpoint.com');
define('AV_PLANNER_CONTACT_EMAIL', 'info@yourcompany.com');
define('AV_PLANNER_PHONE', '(555) 123-4567');
define('AV_PLANNER_COMPANY_NAME', 'Your AV Company');
```

### Customization

#### Styling
Add custom CSS to override default styles:

```css
/* Custom AV Planner Styles */
#av-planner-root {
    font-family: inherit; /* Use theme font */
}

#av-planner-root .btn-primary {
    background: var(--wp-primary-color, #0073aa);
}

#av-planner-root .card {
    box-shadow: var(--wp-box-shadow, 0 2px 4px rgba(0,0,0,0.1));
}
```

#### JavaScript Configuration
Pass WordPress data to the React app:

```php
function av_planner_localize_script() {
    wp_localize_script('av-planner-js', 'avPlannerConfig', array(
        'apiUrl' => AV_PLANNER_API_URL,
        'contactEmail' => AV_PLANNER_CONTACT_EMAIL,
        'phone' => AV_PLANNER_PHONE,
        'companyName' => AV_PLANNER_COMPANY_NAME,
        'nonce' => wp_create_nonce('av_planner_nonce'),
        'ajaxUrl' => admin_url('admin-ajax.php')
    ));
}
add_action('wp_enqueue_scripts', 'av_planner_localize_script');
```

## Database Integration

### Quote Storage
Create a custom table to store quotes:

```sql
CREATE TABLE wp_av_planner_quotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote_id VARCHAR(50) UNIQUE,
    user_id INT,
    event_name VARCHAR(255),
    event_date DATE,
    location VARCHAR(255),
    guest_count INT,
    event_type VARCHAR(50),
    selected_package VARCHAR(50),
    add_ons TEXT,
    total_price DECIMAL(10,2),
    form_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### AJAX Handlers
Add AJAX handlers for quote operations:

```php
// Save quote
add_action('wp_ajax_save_av_quote', 'save_av_quote');
add_action('wp_ajax_nopriv_save_av_quote', 'save_av_quote');

function save_av_quote() {
    // Verify nonce
    if (!wp_verify_nonce($_POST['nonce'], 'av_planner_nonce')) {
        wp_die('Security check failed');
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
        'form_data' => sanitize_text_field($_POST['form_data'])
    );
    
    $result = $wpdb->insert(
        $wpdb->prefix . 'av_planner_quotes',
        $quote_data
    );
    
    if ($result) {
        wp_send_json_success(array('message' => 'Quote saved successfully'));
    } else {
        wp_send_json_error(array('message' => 'Failed to save quote'));
    }
}
```

## Security Considerations

1. **Sanitize Input**: Always sanitize user input
2. **Nonce Verification**: Use WordPress nonces for AJAX requests
3. **Capability Checks**: Check user capabilities for admin functions
4. **SQL Injection Prevention**: Use prepared statements

## Performance Optimization

1. **Lazy Loading**: Load the tool only when needed
2. **Caching**: Cache static assets
3. **Minification**: Use minified assets in production
4. **CDN**: Serve assets from a CDN if possible

## Troubleshooting

### Common Issues

1. **Scripts Not Loading**
   - Check file paths
   - Verify WordPress enqueue functions
   - Check browser console for errors

2. **Styling Issues**
   - Check CSS conflicts with theme
   - Verify CSS file is loading
   - Use browser dev tools to debug

3. **AJAX Errors**
   - Verify nonce generation
   - Check AJAX URL configuration
   - Review server error logs

### Debug Mode
Enable WordPress debug mode to see detailed errors:

```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

## Support

For technical support or customization requests, contact:
- Email: support@yourcompany.com
- Documentation: https://your-docs-site.com
- GitHub: https://github.com/your-repo/av-planner
