import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import './editor.scss';
import { useSelect } from '@wordpress/data';
import { RawHTML } from '@wordpress/element';

import { format, dateI18n, getSettings } from '@wordpress/date';
import {
	PanelBody,
	ToggleControl,
	QueryControls,
	TextControl,
} from '@wordpress/components';
export default function Edit( { attributes, setAttributes } ) {
	const { numberOfPosts, displayFeaturedImage, order, orderBy } = attributes;

	const posts = useSelect(
		( select ) => {
			return select( 'core' ).getEntityRecords( 'postType', 'post', {
				per_page: numberOfPosts,
				_embed: true,
				order,
				orderby: orderBy,
			} );
		},
		[ numberOfPosts, order, orderBy ]
	);

	const onDisplayImageChange = ( value ) => {
		setAttributes( { displayFeaturedImage: value } );
	};

	const onNumberOfItemsChange = ( value ) => {
		setAttributes( { numberOfPosts: value } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody>
					<ToggleControl
						label="Display Featured Image"
						checked={ displayFeaturedImage }
						onChange={ onDisplayImageChange }
					/>
					<QueryControls
						numberOfItems={ numberOfPosts }
						onNumberOfItemsChange={ onNumberOfItemsChange }
						maxItems={ 10 }
						minItems={ 2 }
						orderBy={ orderBy }
						order={ order }
						onOrderByChange={ ( value ) => {
							setAttributes( { orderBy: value } );
						} }
						onOrderChange={ ( value ) => {
							setAttributes( { order: value } );
						} }
					/>
				</PanelBody>
			</InspectorControls>
			<ul { ...useBlockProps() }>
				{ posts &&
					posts.map( ( post ) => {
						const featuredImage =
							post?._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ]
								?.source_url;
						return (
							<li key={ post.id }>
								{ displayFeaturedImage && featuredImage && (
									<img src={ featuredImage } alt="" />
								) }
								<h5>
									<a href={ post.link }>
										<RawHTML>
											{ post.title.rendered
												? post.title.rendered
												: 'Untitled' }
										</RawHTML>
									</a>
								</h5>
								{ post.date_gmt && (
									<time
										dateTime={ format(
											'c',
											post.date_gmt
										) }
									>
										{ dateI18n(
											getSettings().formats.datetime,
											post.date_gmt
										) }
									</time>
								) }
								{ post.excerpt.rendered && (
									<RawHTML>{ post.excerpt.rendered }</RawHTML>
								) }
							</li>
						);
					} ) }
			</ul>
		</>
	);
}
