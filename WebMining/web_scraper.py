import urllib.request

import csv
import requests
import re
import spacy
from urllib.parse import urlparse
import wikipedia
# might also need pip3 install wikipedia_sections

import articles 

from bs4 import BeautifulSoup
from transformers import pipeline

import nltk
#nltk.download('omw-1.4')
#nltk.download('wordnet')
from nltk.corpus import wordnet

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

def update_pov(sentence):
	pass

def get_keywords(topic_entries, doc_sentence):
	kw = []
		
	for t in doc_sentence:
		if t.pos_ == "VERB" or (t.pos_ == "NOUN" and t.pos_ not in topic_entries):
			kw.append(t.text)

	keywords = set(kw + list(e.text for e in doc_sentence.ents if e.text not in topic_entries))
	return list(keywords)	

def main():
	for link in articles.URLS_TO_PARSE:
		text = ""

		if "wikipedia.org" in urlparse(link).netloc:	
			topic_entries, text = parse_wikipedia(link)

		topic_entries.append(" ".join(topic_entries))
		print("topic_entries = ", topic_entries)

		if text == "":
			# log error and return
			return

		nlp = spacy.load('en_core_web_sm')
		doc = nlp(text)
		sentences = list(doc.sents)
		keywords = []
		for s	in sentences:
			kw = get_keywords(topic_entries, s)
			keywords.append(kw)

		scraper_output = "_".join(topic_entries[:-1]) + ".csv"
		fields = ["Keywords", "Sentence"]

		with open(scraper_output, "w") as csvfile:
			csvwriter = csv.writer(csvfile)
			csvwriter.writerow(fields)
	
			# Only write the first 50 sentences to the file
			# Not quite sure yet what happens if we expand this.	
			for i in range(50):
				for k in keywords[i]:
					csvwriter.writerow([k] + [sentences[i].text])

main()

