extends Control

var steps := 0
var counter: Label

func _ready() -> void:
	var center := CenterContainer.new()
	center.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	add_child(center)
	var column := VBoxContainer.new()
	column.add_theme_constant_override("separation", 24)
	center.add_child(column)
	var title := Label.new()
	title.text = "KUN KING"
	title.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	title.add_theme_font_size_override("font_size", 48)
	column.add_child(title)
	var subtitle := Label.new()
	subtitle.text = "Your next chapter starts here."
	subtitle.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	column.add_child(subtitle)
	var button := Button.new()
	button.text = "Take a step"
	button.custom_minimum_size = Vector2(280, 52)
	button.pressed.connect(_on_step)
	column.add_child(button)
	counter = Label.new()
	counter.text = "Steps: 0"
	counter.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	column.add_child(counter)
	button.grab_focus()

func _on_step() -> void:
	steps += 1
	counter.text = "Steps: %d" % steps
