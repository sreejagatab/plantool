# AV Planning Tool - WordPress Integration

This package contains everything needed to integrate the AV Planning Tool into WordPress.

## Installation Options

### Option 1: WordPress Plugin (Recommended)
1. Upload the `av-planner-plugin` folder to `/wp-content/plugins/`
2. Activate the plugin in WordPress admin
3. Use the shortcode `[av_planner]` on any page or post

### Option 2: Theme Integration
1. Copy the `assets` folder to your theme directory
2. Add the code from `shortcode/functions.php` to your theme's `functions.php`
3. Use the shortcode `[av_planner]` on any page or post

### Option 3: Page Template
1. Copy the `assets` folder to your theme directory
2. Copy `theme-integration/page-av-planner.php` to your theme directory
3. Create a new page and select "AV Planner" as the template

## Shortcode Options

```
[av_planner width="100%" height="800px" theme="default" class="custom-class"]
```

## Support

For support and customization, please refer to the WORDPRESS_INTEGRATION.md file.

Built on: 2025-06-26T20:13:43.111Z
Version: 1.0.0
