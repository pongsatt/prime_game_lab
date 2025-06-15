extends Node2D

# Constants
const PLANET_COLORS = ["red", "blue", "yellow"]
const PLANET_NAMES = {"red": "Mars", "blue": "Earth", "yellow": "Sun"}
const PLANET_HEX_COLORS = {"red": "#FF0000", "blue": "#0080FF", "yellow": "#FFFF00"}
const PLANET_POSITIONS = {
	"red": Vector2(320, 360),
	"blue": Vector2(640, 500),
	"yellow": Vector2(960, 360)
}
const ROCKET_SPEED = 0.5
const PLANET_SCALE_ANIMATION = 1.2
const FLASH_DURATION = 0.2

# Node references
@onready var astronaut = $GameElements/Astronaut
@onready var rocket = $GameElements/Rocket
@onready var planets = $GameElements/Planets
@onready var prompt_label = $UI/PromptLabel
@onready var menu_button = $UI/MenuButton
@onready var stars = $Background/Stars
@onready var confetti = $Effects/Confetti

# Game state
var current_sequence = []
var current_index = 0
var is_playing = false
var round_count = 0

# Audio players
var hop_sound
var error_sound
var success_sound

func _ready():
	# Initialize game
	setup_planets()
	setup_ui()
	setup_particles()
	create_audio_players()
	
	# Connect signals
	menu_button.pressed.connect(_on_menu_button_pressed)
	
	# Start first round
	start_round()

func setup_planets():
	# Create planet nodes
	for color in PLANET_COLORS:
		var planet_container = Node2D.new()
		planet_container.name = PLANET_NAMES[color]
		planet_container.position = PLANET_POSITIONS[color]
		planets.add_child(planet_container)
		
		# Create visual representation
		var planet_visual = ColorRect.new()
		planet_visual.size = Vector2(256, 256)
		planet_visual.position = -planet_visual.size / 2
		planet_visual.color = Color(PLANET_HEX_COLORS[color])
		planet_visual.mouse_filter = Control.MOUSE_FILTER_PASS
		planet_container.add_child(planet_visual)
		
		# Create circular shape
		var circle_texture = preload("res://icon.svg") if has_node("/root/EditorNode") else null
		if not circle_texture:
			# Create a simple circular shape using a polygon
			var polygon = Polygon2D.new()
			var points = PackedVector2Array()
			var segments = 32
			for i in range(segments):
				var angle = i * TAU / segments
				points.append(Vector2(cos(angle), sin(angle)) * 128)
			polygon.polygon = points
			polygon.color = Color(PLANET_HEX_COLORS[color])
			planet_container.add_child(polygon)
			planet_visual.visible = false
		
		# Create collision area
		var area = Area2D.new()
		area.name = "ClickArea"
		planet_container.add_child(area)
		
		var collision = CollisionShape2D.new()
		var shape = CircleShape2D.new()
		shape.radius = 120
		collision.shape = shape
		area.add_child(collision)
		
		# Connect click detection
		area.input_event.connect(_on_planet_clicked.bind(color))

func setup_ui():
	# Configure prompt label
	prompt_label.add_theme_font_size_override("font_size", 32)
	prompt_label.add_theme_color_override("font_color", Color.WHITE)
	
	# Position astronaut
	astronaut.position = Vector2(640, 100)
	
	# Position rocket at starting location
	rocket.position = Vector2(640, 360)
	rocket.scale = Vector2(0.5, 0.5)

func setup_particles():
	# Configure star background
	stars.emitting = true
	stars.amount = 50
	stars.lifetime = 10.0
	stars.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	stars.emission_rect_extents = Vector2(640, 360)
	stars.spread = 0
	stars.initial_velocity_min = 0
	stars.initial_velocity_max = 0
	stars.scale_amount_min = 0.1
	stars.scale_amount_max = 0.3
	stars.color = Color(1, 1, 1, 0.7)
	
	# Configure confetti
	confetti.emitting = false
	confetti.amount = 100
	confetti.lifetime = 2.0
	confetti.one_shot = true
	confetti.emission_shape = CPUParticles2D.EMISSION_SHAPE_SPHERE
	confetti.emission_sphere_radius = 50
	confetti.spread = 45
	confetti.initial_velocity_min = 200
	confetti.initial_velocity_max = 400
	confetti.angular_velocity_min = -180
	confetti.angular_velocity_max = 180
	confetti.gravity = Vector2(0, 500)
	confetti.scale_amount_min = 0.5
	confetti.scale_amount_max = 1.5

func create_audio_players():
	# Create audio stream players
	hop_sound = AudioStreamPlayer.new()
	error_sound = AudioStreamPlayer.new()
	success_sound = AudioStreamPlayer.new()
	
	add_child(hop_sound)
	add_child(error_sound)
	add_child(success_sound)
	
	# Note: In a real implementation, you would load actual sound files here
	# For now, we'll use placeholder sounds or generate simple tones

func start_round():
	# Reset state
	current_index = 0
	is_playing = true
	round_count += 1
	
	# Generate random sequence
	current_sequence = generate_sequence()
	
	# Display first prompt
	update_prompt()

func generate_sequence():
	var sequence = []
	var available_colors = PLANET_COLORS.duplicate()
	
	# Fisher-Yates shuffle
	for i in range(3):
		var rand_index = randi() % available_colors.size()
		sequence.append(available_colors[rand_index])
		available_colors.remove_at(rand_index)
	
	return sequence

func update_prompt():
	if current_index < current_sequence.size():
		var color = current_sequence[current_index]
		var planet_name = PLANET_NAMES[color]
		prompt_label.text = "Click the %s planet!" % planet_name
		prompt_label.add_theme_color_override("font_color", Color(PLANET_HEX_COLORS[color]))
	else:
		complete_round()

func _on_planet_clicked(viewport, event, shape_idx, color):
	if not is_playing:
		return
		
	if event is InputEventMouseButton and event.pressed and event.button_index == MOUSE_BUTTON_LEFT:
		handle_click(color)

func handle_click(color):
	if current_sequence[current_index] == color:
		# Correct click
		correct_click(color)
	else:
		# Wrong click
		wrong_click()

func correct_click(color):
	# Play hop sound
	if hop_sound.stream:
		hop_sound.play()
	
	# Animate planet
	var planet = planets.get_node(PLANET_NAMES[color])
	animate_planet(planet)
	
	# Move rocket to planet
	move_rocket_to_planet(color)
	
	# Progress to next
	current_index += 1
	
	# Update prompt after rocket movement
	await get_tree().create_timer(ROCKET_SPEED).timeout
	update_prompt()

func wrong_click():
	# Play error sound
	if error_sound.stream:
		error_sound.play()
	
	# Flash screen red
	flash_screen_red()
	
	# Shake prompt label
	shake_prompt()

func animate_planet(planet):
	var tween = create_tween()
	tween.tween_property(planet, "scale", Vector2.ONE * PLANET_SCALE_ANIMATION, 0.2)
	tween.tween_property(planet, "scale", Vector2.ONE, 0.2)

func move_rocket_to_planet(color):
	var target_pos = PLANET_POSITIONS[color]
	var tween = create_tween()
	tween.tween_property(rocket, "position", target_pos, ROCKET_SPEED)
	
	# Add rotation during movement
	tween.parallel().tween_property(rocket, "rotation", rocket.rotation + TAU, ROCKET_SPEED)

func flash_screen_red():
	var flash = ColorRect.new()
	flash.color = Color(1, 0, 0, 0.3)
	flash.size = get_viewport_rect().size
	flash.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(flash)
	
	var tween = create_tween()
	tween.tween_property(flash, "modulate:a", 0, FLASH_DURATION)
	tween.finished.connect(func(): flash.queue_free())

func shake_prompt():
	var original_pos = prompt_label.position
	var tween = create_tween()
	
	for i in range(5):
		var offset = Vector2(randf_range(-10, 10), randf_range(-5, 5))
		tween.tween_property(prompt_label, "position", original_pos + offset, 0.05)
	
	tween.tween_property(prompt_label, "position", original_pos, 0.05)

func complete_round():
	is_playing = false
	
	# Play success sound
	if success_sound.stream:
		success_sound.play()
	
	# Show celebration
	prompt_label.text = "Great job! You did it!"
	prompt_label.add_theme_color_override("font_color", Color.GREEN)
	
	# Trigger confetti
	confetti.position = rocket.position
	confetti.restart()
	confetti.emitting = true
	
	# Start new round after delay
	await get_tree().create_timer(3.0).timeout
	start_round()

func _on_menu_button_pressed():
	# Return to menu or restart
	get_tree().reload_current_scene()