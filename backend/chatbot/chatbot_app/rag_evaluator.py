from langchain_community.llms import Ollama

from sacrebleu import corpus_bleu
from rouge_score import rouge_scorer
from bert_score import score
from nltk.util import ngrams

class RAGEvaluator:
    def __init__(self):
        self.llama_model = Ollama(model="llama3")

    def evaluate_bleu_rouge(self, candidates, references):
        bleu_score = corpus_bleu(candidates, [references]).score

        scorer = rouge_scorer.RougeScorer(['rouge1', 'rouge2', 'rougeL'], use_stemmer=True)
        rouge_scores = [scorer.score(ref, cand) for ref, cand in zip(references, candidates)]
        rouge1 = sum([score['rouge1'].fmeasure for score in rouge_scores]) / len(rouge_scores)
        
        return bleu_score, rouge1

    def evaluate_bert_score(self, candidates, references):
        P, R, F1 = score(candidates, references, lang="en", model_type="bert-base-uncased")
        return P.mean().item(), R.mean().item(), F1.mean().item()

    def evaluate_diversity(self, texts):
        all_tokens = [tok for text in texts for tok in text.split()]
        unique_bigrams = set(ngrams(all_tokens, 2))
        diversity_score = len(unique_bigrams) / len(all_tokens) if all_tokens else 0
        return diversity_score

    def evaluate_all(self, question, response, reference):
        candidates = [response]
        references = [reference]

        bleu, rouge1 = self.evaluate_bleu_rouge(candidates, references)

        bert_p, bert_r, bert_f1 = self.evaluate_bert_score(candidates, references)

        diversity = self.evaluate_diversity(candidates)

        return {
            "BLEU": bleu,
            "ROUGE-1": rouge1,
            "BERT P": bert_p,
            "BERT R": bert_r,
            "BERT F1": bert_f1,
            "Diversity": diversity
        }