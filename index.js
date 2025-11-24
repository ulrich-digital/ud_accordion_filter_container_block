if (typeof wp !== 'undefined' && wp.blocks && wp.element && (wp.blockEditor || wp.editor)) {
    const { registerBlockType } = wp.blocks;
    const { useBlockProps, InnerBlocks } = wp.blockEditor || wp.editor;
    const { createElement } = wp.element;

    registerBlockType('ud/ud-accordion-filter-container-block', {
        edit: function() {
            const blockProps = useBlockProps({ className: 'accordion-block-container' });
            return createElement(
                'div',
                blockProps,
                createElement(
                    'div',
                    null,
			        createElement('p', { className: 'accordion-editor-hint' }, 'Container für filtergesteuerte Akkordeon-Blocks'),
                    createElement(InnerBlocks, {
                        allowedBlocks: ['ud/accordion-block']
                    })
                )
            );
        },
        save: function() {
            return createElement(
                'div',
                { className: 'accordion-block-container' },
                createElement(InnerBlocks.Content)
            );
        }
    });

document.addEventListener('DOMContentLoaded', function() {
    // Dein Custom JS hier, falls nötig
});

} else {
    console.error('WordPress Block-Editor Scripts nicht geladen!');
}

