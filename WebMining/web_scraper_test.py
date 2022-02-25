import unittest
import spacy
from spacy.tokenizer import Tokenizer

import web_scraper

class TestArtifacts:
	sentence = 'Dubbed the "King of Pop", Michael Jackson is regarded as one of the most significant cultural figures of the 20th century.'
	nlp = spacy.load('en_core_web_sm')
	nlp.tokenizer = Tokenizer(nlp.vocab)
	doc = nlp(sentence)
	doc_sentence = list(doc.sents)[0]


class WebScraperTest(unittest.TestCase):
	sentence = TestArtifacts.doc_sentence
	topics = ["Michael", "Jackson", "Michael Jackson"]

	def test_parse_wikipedia(self):
		link = "https://en.wikipedia.org/wiki/Michael_Jackson"
		result_topics, result_content = web_scraper.parse_wikipedia(link)
		self.assertEqual(result_topics, self.topics)

	
	def test_get_keywords(self):
		keywords = ['regarded', 'Dubbed', '20th', 'figures']
		result = web_scraper.get_keywords(self.topics, self.sentence)
		self.assertEqual(keywords.sort(), result.sort())

if __name__ == '__main__':
	unittest.main()

