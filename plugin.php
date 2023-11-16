<?php

/**
 * Plugin Name:       latest posts
 * Description:       Display and filter latest posts.
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       latest-posts
 *
 * @package           create-block
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */

function blocks_latest_posts_render_callback($attributes, $content)
{
	$args = array(
		'posts_per_page' => $attributes['numberOfPosts'],
		'posts_status' => 'publish',
		'order' => $attributes['order'],
		'orderby' => $attributes['orderBy'],

	);
	$recent_posts = get_posts($args);
	$posts = '<ul ' . get_block_wrapper_attributes() . ' >';

	foreach ($recent_posts as $post) {
		$title = get_the_title($post->ID);
		$title = $title ? $title : '(no title)';
		$permalink = get_the_permalink($post->ID);
		$excerpt = get_the_excerpt($post->ID);
		$posts .= '<li>';
		if ($attributes['displayFeaturedImage'] && has_post_thumbnail($post->ID)) {
			$posts .= '<a href="' . esc_url($permalink) . '">';
			$posts .= get_the_post_thumbnail($post->ID, 'thumbnail');
			$posts .= '</a>';
		}
		$posts .= '<h5><a href="' . esc_url($permalink) . '">' . $title . '</a></h5>';
		$posts .= '<time datetime="' . esc_attr(get_the_date(DATE_W3C, $post->ID)) . '">' . esc_html(get_the_date('', $post->ID)) . '</time>';

		if (!empty($excerpt)) {
			$posts .= '<p>' . $excerpt . '</p>';
		}
		$posts .= '</li>';
	}

	$posts .= '</ul>';
	return $posts;
}
function create_block_latest_posts_block_init()
{
	register_block_type_from_metadata(__DIR__, array(
		'render_callback' => 'blocks_latest_posts_render_callback'
	));
}
add_action('init', 'create_block_latest_posts_block_init');
