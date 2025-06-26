<?php
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

<?php get_footer(); ?>