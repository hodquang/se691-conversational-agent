import unittest
import spacy
from spacy.tokenizer import Tokenizer

import web_scraper
import pov_converter

class TestArtifacts:
	sentence = 'Dubbed the "King of Pop", Michael Jackson is regarded as one of the most significant cultural figures of the 20th century.'
	nlp = spacy.load('en_core_web_sm')
	nlp.tokenizer = Tokenizer(nlp.vocab)
	doc = nlp(sentence)
	doc_sentence = list(doc.sents)[0]


class PovConverterTest(unittest.TestCase):
	sentence = TestArtifacts.doc_sentence
	topics = ["Michael", "Jackson", "Michael Jackson"]

	def test_get_valid_name_opts(self):
		valid_names = ["Michael", "Jackson", "Michael Jackson", "Michael's", "Jackson's", "Michael Jackson's"]
		invalid_names = ['Michael Jr.', 'Michael III']
		result_valid_names, result_invalid_names = pov_converter.get_valid_name_opts(self.topics)
		self.assertEqual(valid_names, result_valid_names)
		for inv in result_invalid_names:
			self.assertIn(inv, result_invalid_names)

	def test_build_pov_map(self):
		valid_names = self.topics
		invalid_names = ["Michael Jr.", "Michael Jackson Sr.", "Michael III"]
		result_map = pov_converter.build_pov_map(valid_names, invalid_names)
	
		self.assertEqual(list(result_map.valid_names_map.keys()), ["Michael", "Jackson", "Michael Jackson"])


	def test_get_gender(self):
		masculine_name_1 = "Michael"
		masculine_name_2 = "Barack"
		feminine_name_1 = "Michelle"
		feminine_name_2 = "Brittany"

		self.assertEqual(pov_converter.get_gender(masculine_name_1), "male")
		self.assertEqual(pov_converter.get_gender(masculine_name_2), "male")
		self.assertEqual(pov_converter.get_gender(feminine_name_1), "female")
		self.assertEqual(pov_converter.get_gender(feminine_name_2), "female")


	def test_update_pov(self):
		nlp = spacy.load("en_core_web_sm")	
		nlp.tokenizer = Tokenizer(nlp.vocab)
		
		test_name = "Michael"
		test_valid_names, test_invalid_names = pov_converter.get_valid_name_opts(["Michael", "Jackson", "Michael Jackson"])

		test_mapper = pov_converter.build_pov_map(test_valid_names, test_invalid_names)

		print("\ntest invalid = {}".format(test_mapper.invalid_names_map.keys()))
		print("test valid = {}".format(test_mapper.valid_names_map.keys()))
		
		test_kws_1 = ["50"]
		test_sentence_1 = next(s for s in nlp("Michael was 50 years old").sents)
		
		test_kws_2 = ["singer"]
		test_sentence_2 = next(s for s in nlp("He was a singer").sents)
		
		test_kws_3 = ["Katherine"]
		test_sentence_3 = next(s for s in nlp("His mother's name was Katherine").sents)
		
		test_kws_4 = ["Clayton, Alabama"]
		test_sentence_4 = next(s for s in nlp("She was born in Clayton, Alabama").sents)

		test_kws_5 = ["Tito"]
		test_sentence_5 = next(s for s in nlp("Michael's brother Tito was also a performer").sents)

		test_kws_6 = ["Thriller"]
		test_sentence_6 = next(s for s in nlp("My album Thriller was a best-seller").sents)

		test_kws_7 = ["Michael Jackson Jr."]
		test_sentence_7 = next(s for s in nlp("Michael Jackson Jr. will not be accepted").sents)

		test_kws_8 = ["Michael Joseph Jackson"]
		test_sentence_8 = next(s for s in nlp("Michael Joseph Jackson will not be accepted either").sents)

		self.assertEqual(pov_converter.update_pov(test_name, test_kws_1, test_sentence_1, test_mapper), "I was 50 years old")
		self.assertEqual(pov_converter.update_pov(test_name, test_kws_2, test_sentence_2, test_mapper), "I was a singer")
		self.assertEqual(pov_converter.update_pov(test_name, test_kws_3, test_sentence_3, test_mapper), "My mother's name was Katherine")
		self.assertEqual(pov_converter.update_pov(test_name, test_kws_4, test_sentence_4, test_mapper), "She was born in Clayton, Alabama")
		self.assertEqual(pov_converter.update_pov(test_name, test_kws_5, test_sentence_5, test_mapper), "My brother Tito was also a performer")
		self.assertEqual(pov_converter.update_pov(test_name, test_kws_6, test_sentence_6, test_mapper), "My album Thriller was a best-seller")
		self.assertEqual(pov_converter.update_pov(test_name, test_kws_7, test_sentence_7, test_mapper), "Michael Jackson Jr. will not be accepted")
		# We don't currently handle middle names. Ideally we'll want to add this
		# as an entry to valid_names_map in pov_converter.py
		self.assertEqual(pov_converter.update_pov(test_name, test_kws_8, test_sentence_8, test_mapper), "I Joseph I will not be accepted either")


if __name__ == '__main__':
	unittest.main()

