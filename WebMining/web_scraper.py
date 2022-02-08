""" Conversational Agent Scraper
This module scrapes data from Wikipedia and dumps it into a k:v csv file
of keywords to sentence, where ach keyword is a defining part of the sentence.

Input:
	- articles.py: wikipedia urls to scrape

Output:
	- {name}.csv: name is the name of the role model, which corresponds \
			to the title of the Wikipedia page scraped

Flags:
	- --no-enable-pov-converter: Bool to convert Wikipedia sentence from first person \ 
				to third person speech. This logic lives in pov_converter.py
"""

import argparse
import csv
import re
import spacy
import wikipedia
from urllib.parse import urlparse
from spacy.tokenizer import Tokenizer

# Could be useful if we want to process synonyms
#import nltk
#nltk.download('omw-1.4')
#nltk.download('wordnet')
#from nltk.corpus import wordnet

# Local imports from this directory
import articles 
import pov_converter

def parse_wikipedia(link):
	UNNECESSARY_SECTIONS = ['Notes', 'References', 'Citations', 'Print sources', 'Further reading', 'External links']

	topic = urlparse(link).path.split("/")[-1]
	wiki = wikipedia.page(topic, auto_suggest=False)

	content = ""
	for section_title in wiki.sections:
		if section_title not in UNNECESSARY_SECTIONS:
			if wiki.section(section_title) != None:
				content += wiki.section(section_title)
			else:
				print("couldnt add section_title: ", section_title)

	return topic.split("_"), content

def get_keywords(topic_entries, doc_sentence):
	kw = []
		
	for t in doc_sentence:
		if t.pos_ == "VERB" or (t.pos_ == "NOUN" and t.pos_ not in topic_entries):
			kw.append(t.text)

	keywords = set(kw + list(e.text for e in doc_sentence.ents if e.text not in topic_entries))
	return list(keywords)	

def main():
	parser = argparse.ArgumentParser(description='Scrape Wikipedia and dump text to csv file.')
	parser.add_argument("--no-enable-pov-converter", action="store_false")	# True if not set

	args = parser.parse_args()
	enable_pov_converter = args.no_enable_pov_converter

	for link in articles.URLS_TO_PARSE:
		text = ""
		topic_entries = []  # Title of Wikipedia page. Typically the persons's name

		if "wikipedia.org" in urlparse(link).netloc:	
			topic_entries, text = parse_wikipedia(link)
		
		# Topic should contain [first_name, last_name, first_name last_name]
		topic_entries.append(" ".join(topic_entries))  # Add first_name last_name

		if enable_pov_converter:
			valid_names, invalid_names = pov_converter.get_valid_name_opts(topic_entries)
			pov_mapper = pov_converter.build_pov_map(valid_names, invalid_names)

		if text == "":
			# log error and return
			return

		nlp = spacy.load('en_core_web_sm')
		nlp.tokenizer = Tokenizer(nlp.vocab)
		doc = nlp(text)

		keywords = []
		updated_sentences = []
		doc_sentences = list(doc.sents)
	
		MAX = len(doc_sentences)  # Decrease if processing takes too long
		sentences = doc_sentences[:MAX]
		for s	in sentences:
			kw = get_keywords(topic_entries, s)
			keywords.append(kw)
			if enable_pov_converter:
				updated_sentences.append(pov_converter.update_pov(topic_entries[0], kw, s, pov_mapper))

		final_sentences = []
		if updated_sentences:
			final_sentences = updated_sentences
		else:
			final_sentences = [s.text for s in sentences]
		
		scraper_output = "_".join(topic_entries[:-1]) + ".csv"
		fields = ["Keywords", "Sentence"]
		with open(scraper_output, "w") as csvfile:
			csvwriter = csv.writer(csvfile)
			csvwriter.writerow(fields)
	
			# Only write the first 50 sentences to the file
			# Not quite sure yet what happens if we expand this.	
			count = 0
			for i in range(MAX):
				for k in keywords[i]:
					# Number of k,v pairs must be <= 2k
					# https://cloud.google.com/dialogflow/es/docs/how/knowledge-bases
					if count < 1995:
						csvwriter.writerow([k] + [final_sentences[i]])
					else:
						break
					count += 1

main()

