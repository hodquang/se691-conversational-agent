# This module converts third person text to first person. 

import gender_guesser.detector as gender
import inflect
import itertools
import numpy as np
import spacy

class PovMapper:
	allowed_suffixes = ["'s"]
	common_suffixes = ["Jr.", "Sr.", "II", "III", "IV"]

	forms_of_be_map = {
		"be": "am",
		"is": "am",
		"are": "am",
		"was": "was",
		"were": "was",
		"being": "am",
		"been": "am"
	}

	masculine_pronouns_pov_map = {
		"he": "I",
		"his": "my",
		"him": "mine"
	}

	feminine_pronouns_pov_map = {
		"she": "I",
		"her": "my",
		"hers": "mine",
	}

	valid_names_map = {}
	invalid_names_map = {}

def get_valid_name_opts(topics):
	allowed_pov = []
	defined_suffixes = [""]

	# If this person's name is known to carry a suffix, as indicated by their
	# name in Wikipedia title entries, identify it
	for s in PovMapper.common_suffixes:
		if s in topics[:-1]:  # Only check the full name entry
			defined_suffixes.append(s) # == .append(["", s]); Definitely a hack

	# Produce all possible combinations
	# e.g. Barack Jr. Obama Jr. and Barack Obama Jr. are all valid in English
	allowed_names_product = list(itertools.product(topics, defined_suffixes))
	allowed_names_product.extend(list(itertools.product(topics, PovMapper.allowed_suffixes)))

	# Do the same but we don't want to identify invalid identifiers for our intended
	# role model. For example, we don't want to include Obama Sr.
	# as a valid name for President Obama, when in fact that refers to his father.
	prohibited_names_product = (itertools.product(topics, [s for s in PovMapper.common_suffixes if s not in defined_suffixes]))

	allowed_names = []
	prohibited_names = []

	for name in allowed_names_product:
		allowed_names.append("".join(name).strip())

	for name in prohibited_names_product:
		prohibited_names.append(" ".join(name).strip())

	return allowed_names, prohibited_names

def build_pov_map(valid_names, invalid_names):
	mapper = PovMapper()

	for v in valid_names:
		if v.endswith("'s"):
			# It's worth it to identify this block as an indicator of possesion
			# but for now this literal will do. 
			mapper.valid_names_map[v] = "my"
		else:
			mapper.valid_names_map[v] = "I"

		for iv in invalid_names:
			# Note this might not always be correct depending on the subject of the sentence.
			mapper.invalid_names_map[iv] = "they"

	# print("\ninvalid = {}".format(mapper.invalid_names_map.keys()))
	# print("valid = {}".format(mapper.valid_names_map.keys()))
	

	return mapper

def get_gender(name):
	detector = gender.Detector()
	return detector.get_gender(name)

def update_pov(first_name, keywords, sentence, mapper):
	nlp = spacy.load("en_core_web_sm")
	converter = inflect.engine()

	# Determine gender to help us identify the right matching pronouns
	role_model_gender = get_gender(first_name)

	new_sentence = []
	first_person_pronouns = \
		mapper.masculine_pronouns_pov_map.values() if role_model_gender == "male" else mapper.masculine_pronouns_pov_map.values()
	
	# For each word in a given sentence we have to determine its first person equivalent
	# The steps are as follows:
	#	1) Find keyword string that contains word for this iteration, return None if no match exists
	# 2) If corresponding <b>keyword<b> is an invalid_name just keep the current word
	# 3) Else if word is an invalid_name get first person equivalent
	# 4) Repeat for valid_names, and masculine and feminine pronouns
	for index, word in enumerate(sentence):
		modified = False
		word_in_keywords = next((e for e in keywords if word.text in e), None)   
		keyword_in_invalid_names = \
			False if word_in_keywords == None else any(word_in_keywords in iv for iv in mapper.invalid_names_map.keys())

	#	print("\nword.text = {}".format(word.text))
	#	print("word_in_keywords = ", word_in_keywords)
	#	print("keyword_in_invalid_names = ", keyword_in_invalid_names)
 
		if keyword_in_invalid_names:
			new_sentence.append(word.text)
			modified = True
		elif word.text in mapper.invalid_names_map.keys():
			new_sentence.append(mapper.invalid_names_map[word.text])
			modified = True
		elif word.text in mapper.valid_names_map.keys():
			new_sentence.append(mapper.valid_names_map[word.text])
			modified = True
		elif word.text.lower() in mapper.masculine_pronouns_pov_map.keys() and role_model_gender == "male":
			new_sentence.append(mapper.masculine_pronouns_pov_map[word.text.lower()])
			modified = True
		elif word.text.lower() in mapper.feminine_pronouns_pov_map.keys() and role_model_gender == "female":
			new_sentence.append(mapper.feminine_pronouns_pov_map[word.text.lower()])
			modified = True

		if index > 0:
			# If we've modified the previous word, make sure the immediately
			# following verb agrees
			if new_sentence[index-1] in first_person_pronouns:
				if word.text in mapper.forms_of_be_map.keys():
					new_sentence.append(mapper.forms_of_be_map[word.text])
					modified = True
				elif word.pos_ == "VERB":
					# If the word is already singluar this may return false, let's just keep the word in that case
					singular = converter.singular_noun(word.text) if converter.singular_noun(word.text) else word.text
					new_sentence.append(singular)
					modified = True

		if not modified:
			new_sentence.append(word.text)

	new_sentence[0] = new_sentence[0].capitalize()

	new_sentence = " ".join(new_sentence)
	
	# Print something while processing to indicate it's running
	print("\noriginal sentence = {}\nnew_sentence = {}".format(sentence, new_sentence))
	return new_sentence


