var get = function(editor) {
        return Math.floor(
            parseInt(editor.find('.textae-editor__body__text-box').css('line-height')) / 16
        );
    },
    // Reduce the space under the .textae-editor__body__text-box same as padding-top.
    reduceBottomSpace = function(editor) {
        var $textBox = editor.find('.textae-editor__body__text-box');

        // The height calculated by auto is exclude the value of the padding top.
        // Rest small space.
        $textBox
            .css({
                'height': 'auto'
            }).css({
                'height': $textBox.height() + 20
            });
    },
    set = function(editor, heightValue) {
        var $textBox = editor.find('.textae-editor__body__text-box');

        $textBox.css({
            'line-height': heightValue + 'px',
            'padding-top': heightValue / 2 + 'px'
        });

        reduceBottomSpace(editor);
    },
    setToTypeGap = function(editor, model, typeGapValue) {
        var TEXT_HEIGHT = 23,
            MARGIN_TOP = 60,
            MINIMUM_HEIGHT = 16 * 4,
            heightOfType = typeGapValue * 18 + 18,
            maxHeight = _.max(model.annotationData.span.all()
                .map(function(span) {
                    var height = TEXT_HEIGHT + MARGIN_TOP;
                    var countHeight = function(span) {
                        // Grid height is height of types and margin bottom of the grid.
                        height += span.getTypes().length * heightOfType;
                        if (span.parent) {
                            countHeight(span.parent);
                        }
                    };

                    countHeight(span);

                    return height;
                }).concat(MINIMUM_HEIGHT)
            );

        set(editor, maxHeight);
    };

module.exports = {
    get: get,
    set: set,
    setToTypeGap: setToTypeGap,
    reduceBottomSpace: reduceBottomSpace
};
