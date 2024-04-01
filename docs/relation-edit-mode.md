---
layout: docs_with_textae
title: Relation Edit Mode
permalink: /docs/relation-edit-mode/
---

# Relation Edit Mode

Below is an instance of TextAE in the *Relation Edit* mode.
You are recommended to use it to practice with what is described in this page.

<div class="textae-editor" mode="relation-edit" padding_top="50px" style="max-width:550px; background-color:lightyellow">
	{
		"text":"Elon Musk is a member of the PayPal Mafia.",
		"denotations":[
			{"id":"T1","span":{"begin":0,"end":9},"obj":"Person"},
			{"id":"T2","span":{"begin":29,"end":41},"obj":"Group"}
		],
		"relations":[
			{"pred":"member","subj":"T1","obj":"T2"}
		],
		"config": {
			"boundarydetection": false,
			"non-edge characters": [],
			"function availability": {
				"term": false,
				"block": false,
				"simple": false,
				"replicate": false,
				"replicate-auto": false,
				"boundary-detection": false,
				"entity": false
			}
		}
	}
</div>

<h3>Basic operations</h3>

| function         | condition              | icon | shortcut |
|:----------------:|:----------------------:|:----:|:--------:|
|Change mode (view &harr; relation edit) | | ![](https://textae.pubannotation.org/lib/css/images/btn_view_mode_16.png), ![](https://textae.pubannotation.org/lib/css/images/btn_relation_edit_mode_16.png) | f |
|Change descriptor | A descriptor is chosen | ![](https://textae.pubannotation.org/lib/css/images/btn_pallet_16.png) | q |
|Edit properties   | A descriptor is chosen | ![](https://textae.pubannotation.org/lib/css/images/btn_edit_properties_16.png) | w |
|Delete            | A relation is chosen   | ![](https://textae.pubannotation.org/lib/css/images/btn_delete_16.png) | d |
|Undo              |         | ![](https://textae.pubannotation.org/lib/css/images/btn_undo_16.png) | z |
|Redo              |         | ![](https://textae.pubannotation.org/lib/css/images/btn_redo_16.png) | a |


When you are in another mode in TextAE, this mode can be entered by clicking the *Relation Edit Mode* icon
![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_relation_edit_mode_16.png)
.

## Creating a relation

A relation is established between two term annotations.
A relation annotation is thus created on top of term annotations.
If you click on a term annotation, it will be highlighted.
Subsequently, clicking another term will create a relation annotation between the two, with a default descriptor.
To cancel your initial selection of a term, press the *ESC* key.

## Adding an attribute to a relation

To add an attribute to a relation,
select a relation and click
the *Relation Configuration* icon ![](https://raw.githubusercontent.com/pubannotation/textae/stable/4/dist/lib/css/images/btn_pallet_16.png),
to open the *Relation Configuration* dialog,
where you can choose a predefined attribute type or define a new attribute type as you like.

Choose the attribute type and the value you want to add to the selected relation(s).
