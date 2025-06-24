import requests
import ast
from ragas import EvaluationDataset, evaluate
from ragas.llms import LangchainLLMWrapper
from ragas.metrics import LLMContextRecall, Faithfulness, FactualCorrectness
from langchain_openai import ChatOpenAI
import os
from dotenv import load_dotenv

load_dotenv()

if not os.environ.get("SUPAVEC_BASE_URL"):
    print("ERROR: SUPAVEC_BASE_URL environment variable is not set!")
    exit(1)

if not os.environ.get("OPENAI_API_KEY"):
    print("ERROR: OPENAI_API_KEY environment variable is not set!")
    exit(1)

if not os.environ.get("SUPAVEC_API_KEY"):
    print("ERROR: SUPAVEC_API_KEY environment variable is not set!")
    exit(1)

if not os.environ.get("FILE_ID"):
    print("ERROR: FILE_ID environment variable is not set!")
    exit(1)

SUPAVEC_BASE_URL = os.environ.get("SUPAVEC_BASE_URL")

FILE_ID = os.environ.get("FILE_ID")
SUPAVEC_API_KEY = os.environ.get("SUPAVEC_API_KEY")


def search_documents(query, file_ids, k=3):
    """Call the Supavec /search endpoint to get relevant documents."""
    url = f"{SUPAVEC_BASE_URL}/search"
    headers = {
        "Content-Type": "application/json",
        "authorization": SUPAVEC_API_KEY,
    }
    payload = {
        "query": query,
        "file_ids": file_ids,
        "k": k,
        "include_embeddings": False,
    }

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error calling search endpoint: {e}")
        return None


def chat_with_documents(query, file_ids, k=3):
    """Call the Supavec /chat endpoint to get an answer."""
    url = f"{SUPAVEC_BASE_URL}/chat"
    headers = {
        "Content-Type": "application/json",
        "authorization": SUPAVEC_API_KEY,
    }
    payload = {"query": query, "file_ids": file_ids, "k": k, "stream": False}

    try:
        response = requests.post(url, headers=headers, json=payload)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error calling chat endpoint: {e}")
        return None


def main():
    sample_queries = [
        "What was the average indoor radon activity concentration during the burning season in Chiang Mai?",
        "What was the average indoor radon activity concentration during the non-burning season?",
        "How many RADUET detectors were used in total for the indoor radon measurements?",
        "Across how many dwellings were those detectors deployed?",
        "What was the average absorbed gamma dose rate in air measured during the burning season?",
        "What effective dose due to indoor radon exposure did the study estimate for residents?",
        "What was the external (outdoor) effective dose estimated during the burning season?",
        "What was the total annual effective dose combining indoor radon and external radiation?",
        "What excess lifetime cancer risk (ELCR) did the study estimate during the burning season?",
        "According to the study, how many radon-induced lung cancer cases per million persons per year were estimated during the burning season?",
    ]

    expected_responses = [
        "Indoor radon activity concentration during the burning season was 63 Bq/m³ on average.",
        "Indoor radon activity concentration during the non-burning season was 46 Bq/m³ on average.",
        "The study used a total of 220 RADUET detectors for the indoor radon measurements.",
        "These detectors were deployed across 45 dwellings.",
        "During the burning season, the average absorbed gamma dose rate in air was 66 nGy/h.",
        "The effective dose due to indoor radon exposure was estimated at 1.6 mSv per year.",
        "The external (outdoor) effective dose during the burning season was estimated at 0.08 mSv per year.",
        "The total annual effective dose, combining indoor radon and external radiation, was 1.68 mSv per year.",
        "The excess lifetime cancer risk attributable to indoor radon during the burning season was 0.67 percent.",
        "The study estimated 28.44 radon-induced lung-cancer cases per million persons per year during the burning season.",
    ]

    print("Starting RAG evaluation with RAGAS...")

    # Collect evaluation data
    dataset = []
    file_ids = [FILE_ID]

    for i, (query, reference) in enumerate(zip(sample_queries, expected_responses)):
        print(f"Processing query {i+1}/{len(sample_queries)}: {query[:50]}...")

        # Get relevant documents using /search endpoint
        search_result = search_documents(query, file_ids, k=3)
        if not search_result or not search_result.get("success"):
            print(f"Failed to get search results for query: {query}")
            continue

        retrieved_contexts = [
            doc["content"] for doc in search_result.get("documents", [])
        ]

        # Get answer using /chat endpoint
        chat_result = chat_with_documents(query, file_ids, k=3)
        if not chat_result or not chat_result.get("success"):
            print(f"Failed to get chat response for query: {query}")
            print("  Using a placeholder response for evaluation purposes")
            response = f"[Chat endpoint failed] Based on the retrieved context: {retrieved_contexts[0][:200] if retrieved_contexts else 'No context available'}..."
        else:
            response = chat_result.get("answer", "")

        dataset.append(
            {
                "user_input": query,
                "retrieved_contexts": retrieved_contexts,
                "response": response,
                "reference": reference,
            }
        )

        print(f"✓ Query {i+1} processed successfully")

    if not dataset:
        print("No data collected. Exiting...")
        return

    print(f"\nCollected {len(dataset)} evaluation samples")

    # Load the dataset into EvaluationDataset object
    evaluation_dataset = EvaluationDataset.from_list(dataset)

    # Set up evaluator LLM for RAGAS
    try:
        llm = ChatOpenAI(model="gpt-4o-mini")  # Using cheaper model for evaluation
        evaluator_llm = LangchainLLMWrapper(llm)

        print("\nStarting RAGAS evaluation...")

        # Evaluate using RAGAS metrics
        result = evaluate(
            dataset=evaluation_dataset,
            metrics=[LLMContextRecall(), Faithfulness(), FactualCorrectness()],
            llm=evaluator_llm,
        )

        print("\n" + "=" * 50)
        print("RAG EVALUATION RESULTS")
        print("=" * 50)

        result_str = str(result)

        if result_str.startswith("{") and result_str.endswith("}"):
            try:
                metrics_dict = ast.literal_eval(result_str)

                for metric_name, metric_value in metrics_dict.items():
                    formatted_name = (
                        metric_name.replace("_", " ").replace("(", " (").title()
                    )
                    if isinstance(metric_value, (int, float)):
                        print(f"{formatted_name}: {metric_value:.4f}")
                    else:
                        print(f"{formatted_name}: {metric_value}")

            except Exception as e:
                print(f"Failed to parse evaluation results as dictionary: {e}")
                print(f"Raw evaluation result: {result}")
        print("=" * 50)

    except Exception as e:
        print(f"Error during RAGAS evaluation: {e}")
        print("Make sure you have set your OPENAI_API_KEY environment variable")


if __name__ == "__main__":
    main()
