# RAG Evaluation with RAGAS and Supavec

This script implements a basic RAG evaluation using the RAGAS framework with Supavec API endpoints.

## Setup

1. **Navigate to the eval directory:**
   ```bash
   cd eval
   ```

2. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the eval directory or set the following environment variables:
   
   ```bash
   export SUPAVEC_BASE_URL="https://api.supavec.com"
   export OPENAI_API_KEY="your-openai-api-key-here"
   export SUPAVEC_API_KEY="your-supavec-api-key-here"
   export FILE_ID="your-uploaded-file-id"
   ```
   
   **Required Environment Variables:**
   - `SUPAVEC_BASE_URL`: The base URL for Supavec API endpoints
   - `OPENAI_API_KEY`: Your OpenAI API key (used for RAGAS evaluation)
   - `SUPAVEC_API_KEY`: Your Supavec API key
   - `FILE_ID`: The file ID of your uploaded document in Supavec

## What the Script Does

1. **Calls Supavec API endpoints:**
   - Uses `/search` endpoint to retrieve relevant document chunks
   - Uses `/chat` endpoint to generate answers based on the retrieved context

2. **Evaluates using RAGAS metrics:**
   - **Context Recall**: Measures how well the retrieval system finds relevant information
   - **Faithfulness**: Evaluates if the generated answer is grounded in the retrieved context
   - **Factual Correctness**: Compares the generated answer with the expected (reference) answer

3. **Sample Queries:** Based on Taishi Kato's resume, including questions about:
   - Personal information and contact details
   - Work experience and technical skills
   - Personal projects and achievements
   - Educational background

## Running the Script

**Run the evaluation:**
```bash
python evaluate_rag_with_ragas.py
```

The script will automatically check for required environment variables and exit with an error message if any are missing.

## Output

The script will:
- Process each query and collect evaluation data
- Run RAGAS evaluation metrics
- Display results in the console with formatted output

## Sample Output

```
Starting RAG evaluation with RAGAS...
Processing query 1/10: What is Taishi's full name and current role?...
✓ Query 1 processed successfully
...
Processing query 10/10: What is Supavec and what achievement did it get...
✓ Query 10 processed successfully

Collected 10 evaluation samples

Starting RAGAS evaluation...

==================================================
RAG EVALUATION RESULTS
==================================================
Context Recall: 0.9500
Faithfulness: 0.8750
Factual Correctness: 0.8200
==================================================
```

## Configuration

The script uses environment variables for configuration:
- `SUPAVEC_BASE_URL`: Base URL for Supavec API (required)
- `SUPAVEC_API_KEY`: Your Supavec API key (required)
- `FILE_ID`: The file ID of your uploaded document (required)
- `OPENAI_API_KEY`: Your OpenAI API key for RAGAS evaluation (required)

You can also modify the following in the script:
- `sample_queries` and `expected_responses`: Add your own queries and expected answers
- `k`: Number of relevant chunks to retrieve (default: 3)

## Metrics Explanation

- **Context Recall (0-1)**: Higher is better. Measures retrieval quality.
- **Faithfulness (0-1)**: Higher is better. Measures if answers are grounded in context.
- **Factual Correctness (0-1)**: Higher is better. Measures accuracy against reference answers.

## Troubleshooting

- **Missing environment variables**: The script will show specific error messages for missing required environment variables
- **API connectivity**: Verify that your Supavec API key and base URL are correct
- **File ID**: Ensure the FILE_ID corresponds to a valid uploaded file in your Supavec account
- **OpenAI API**: Make sure your OpenAI API key has sufficient credits and permissions
- **Dependencies**: Ensure all required packages are installed correctly with `pip install -r requirements.txt` 