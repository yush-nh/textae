import showVilidationDialog from '../component/showVilidationDialog';
import {
    hasError as hasError
}
from './model/AnnotationData/parseAnnotation/validateAnnotation';

export default function(annotationData, history, buttonStateHelper, leaveMessage, dataAccessObject, writable) {
    bindResetEvent(annotationData, history, writable);
    bindChangeEvent(history, buttonStateHelper, leaveMessage, writable);
    bindEndEvent(dataAccessObject, history, writable);
}

function bindResetEvent(annotationData, history, writable) {
    annotationData
        .on('all.change', (annotationData, multitrack, reject) => {
            history.reset();

            showVilidationDialog(self, reject);

            if (multitrack)
                toastr.success("track annotations have been merged to root annotations.");

            if (multitrack || hasError(reject)) {
                writable.forceModified(true);
            } else {
                writable.forceModified(false);
            }
        });
}

function bindChangeEvent(history, buttonStateHelper, leaveMessage, writable) {
    history.on('change', function(state) {
        //change button state
        buttonStateHelper.enabled("undo", state.hasAnythingToUndo);
        buttonStateHelper.enabled("redo", state.hasAnythingToRedo);

        //change leaveMessage show
        window.onbeforeunload = state.hasAnythingToSave ? function() {
            return leaveMessage;
        } : null;

        writable.update(state.hasAnythingToSave);
    });
}

function bindEndEvent(dataAccessObject, history, writable) {
    dataAccessObject
        .on('save', function() {
            history.saved();
            writable.forceModified(false);
            toastr.success("annotation saved");
        })
        .on('save error', function() {
            toastr.error("could not save");
        });
}
