---
layout: docs_with_textae
title: Term Edit Mode
permalink: /docs/term-edit-mode/
---

# Term Edit Mode

Here is an instance of TextAE in the "*Term Edit*" mode.
Feel free to use it to practice the concepts described on this page.

<div class="textae-editor" mode="edit">
	{
		"text":"Elon Musk is a member of the PayPal Mafia.",
		"denotations":[
			{"span":{"begin":0,"end":9},"obj":"Person"},
			{"span":{"begin":29,"end":41},"obj":"Group"}
		],
		"config": {
			"boundarydetection": false,
			"non-edge characters": [],
			"function availability": {
				"relation": false,
				"block": false,
				"simple": false,
				"replicate": false,
				"replicate-auto": false,
				"setting": false
			}
		}
	}
</div>

<h3>Basic operations</h3>

| function         | condition              | icon | shortcut |
|:----------------:|:----------------------:|:----:|:--------:|
|Change mode (view &harr; term edit) | | ![](https://textae.pubannotation.org/lib/css/images/btn_view_mode_16.png), ![](https://textae.pubannotation.org/lib/css/images/btn_term_edit_mode_16.png) | f |
|Change descriptor | A denotation is chosen | ![](https://textae.pubannotation.org/lib/css/images/btn_pallet_16.png) | q |
|Edit properties   | A denotation is chosen | ![](https://textae.pubannotation.org/lib/css/images/btn_edit_properties_16.png) | w |
|Delete            | An object is chosen    | ![](https://textae.pubannotation.org/lib/css/images/btn_delete_16.png) | d |
|Cut               | A denotation is chosen | | Ctrl+x |
|Copy              | A denotation is chosen | | Ctrl+c |
|Paste             | A span is chosen       | | Ctrl+v |
|Undo              |         | ![](https://textae.pubannotation.org/lib/css/images/btn_undo_16.png) | z |
|Redo              |         | ![](https://textae.pubannotation.org/lib/css/images/btn_redo_16.png) | a |
|Toggle boundary detection | | ![](https://textae.pubannotation.org/lib/css/images/btn_boundary_detection_16.png) | b |


To switch to Term Edit mode in TextAE, click on the "Term Edit Mode" icon
![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_term_edit_mode_16.png),
when you're in another mode.

In Term Edit mode, you can choose a specific span of text to which a descriptor can be added.
This type of annotation is referred to as a "*denotation*".

To learn about the annotation types supported by TextAE, refer to the manual of *PubAnnotation*:
[PubAnnotation JSON Format](https://www.pubannotation.org/docs/annotation-format/).

## Creating a term annotation (denotation)

To create a term annotation, which we call *denotation*, select a text span using the mouse drag and drop, then, a term annotation will be created with a default type which is initially "_something_".

![](/img/denotation-create-wo-boundary-detection.gif){: height="60" }

When the function *Boundary Detection* is turned on, the boundary of the span will be automatically adjusted as below:

![](/img/denotation-create-with-boundary-detection.gif){: height="60" }

The default type is initially "*Something*". It can be specified by a configuration, or automatically determined to be, e.g., the most frequent one.

## Changing the span of a term annotation

Sometimes, we want to change the span of an already existing term annotation, expanding or contracting the span.

To expand the span of a term annotation, one can use a mouse drag-and-drop operatin from inside to the outside of the span, then, the span will be expanded:

![](/img/denotation-expand-right-with-boundary-detection.gif){: height="60" }


Note that for the span expand operation, the beginning position of the drag-and-drop is not important as long as it is inside the span, however the ending position decides where the span expansion stops. In the above example, the drag-and-operation ends in the middle of the word *Mafia*, and the span is expanded to the end of the word because the function *Boundary Detection* is turned on.

To expand the span to the left direction, one can also use a mouse drag-and-drop operation to the left direction as below, as below:

![](/img/denotation-expand-left-with-boundary-detection.gif){: height="60" }


To contract the span of a term annoation, one can use a mouse drag-and-drop operation from outside to inside of the span as below:

![](/img/denotation-contract-left-with-boundary-detection.gif){: height="60" }


## Changing the descriptor (type) of a term

To change the descriptor of a term,
1. first, select the type, and
2. second, change the type using either of
	1. the *Edit Properties* dialog (icon: ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_edit_properties_16.png), shortcut key: _w_), where you can directly write the type you want, or
	2. the *Entity Configuration* dialog (icon: ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_pallet_16.png), shortcut key: _q_), where you can select one from the list of predefined types.

A type is represented by its _id_.
Optionally, a type can be defined with a _label_.
The difference between ids and lables is in that ids are for machine read, and lables are for human read.
It means while ids will be used for actual annotation data, labels can be shown in TextAE for human readability.

For example, in *NCBI Taxonomy*, the *ID* of _homo sapiens_ is 9606,
and you may want to use a ID like _9606_, _taxonomy:9606_ or something like them, for annotation.
However, for human annotators, such IDs are not straightforward and convenient.
In the case, you can defind the label of the type to be _human_, then inside TextAE, the label, instead of the ID, will be displayed for the type, improving human readibility of the annotation.
Note that however labels will only affect how the annotoation will be displayed inside TextAE, and they have no effect in the actual annotation data.

## Adding an attribute to a denotation

To add an attribute to a denotation,
select a denotation and click
the *Entity Configuration* icon ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_pallet_16.png),
to open the *Entity Configuration* dialog,
where you can choose a predefined attribute type or define a new attribute type as you like.

Choose the attribute type and the value you want to add to the selected denotation(s).
