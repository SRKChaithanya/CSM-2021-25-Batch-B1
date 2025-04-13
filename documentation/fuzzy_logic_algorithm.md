# Fuzzy Logic Algorithm in Question Paper Generator

## Introduction

The Question Paper Generator application implements a fuzzy logic algorithm to ensure fair and balanced selection of questions. This document explains the fuzzy logic implementation, how it works, and why it's beneficial for question paper generation.

## What is Fuzzy Logic?

In the context of this application, "fuzzy logic" refers to a scoring mechanism that helps prioritize questions based on their usage history. Unlike traditional binary logic (used/not used), fuzzy logic assigns a continuous score that gradually changes as a question is used more frequently.

## The Fuzzy Score Formula

The application uses the following formula to calculate the fuzzy score for each question:

```
fuzzy_score = 1.0 / sqrt(1.0 + log10(usage_count))
```

Where:
- `usage_count` is the number of times a question has been selected for question papers
- `sqrt()` is the square root function
- `log10()` is the base-10 logarithm function

### Properties of the Formula

1. **Gradually Decreasing**: The score decreases as usage count increases, but at a decreasing rate.
2. **Range**: The score is always between 0 and 1, with new questions having a score of 1.0.
3. **Logarithmic Decay**: The logarithmic function ensures that the score doesn't decrease too rapidly even with frequent use.
4. **Square Root Moderation**: The square root function further moderates the rate of decay, allowing questions to remain viable for selection longer.

## Benefits of the Implemented Fuzzy Logic

1. **Question Diversity**: By prioritizing less-used questions, the system encourages diversity in question selection.
2. **Fair Distribution**: Each question gets a fair chance of being selected over time.
3. **Prevents Overuse**: Frequently used questions get lower scores, reducing their chances of immediate reselection.
4. **Graceful Aging**: The logarithmic and square root functions ensure that even after many uses, questions remain in the selection pool with manageable (non-zero) scores.
5. **Automatic Recovery**: As time passes without selection, questions effectively become more viable relative to frequently used ones.

## Implementation in the Question Selection Process

### Step-by-Step Algorithm

1. **Track Usage**: Each time a question is selected for a paper, its usage count is incremented in the `SelectedQuestion` table.
2. **Calculate Scores**: When populating the question bank for selection, calculate a fuzzy score for each question using the formula above.
3. **Rank Questions**: Sort questions by fuzzy score (higher scores first).
4. **Selection Pool**: From the sorted questions, take the top-performing half (highest fuzzy scores).
5. **Random Selection**: Randomly select questions from this filtered pool to maintain unpredictability while still favoring less-used questions.

## Pseudocode

```
function getFuzzyScore(question):
    usage_count = getUsageCount(question.id)
    if usage_count == 0:
        return 1.0
    else:
        return 1.0 / sqrt(1.0 + log10(usage_count))

function selectQuestionsForPaper(unit, course_code, marks):
    // Get all eligible questions
    questions = getAllQuestions(unit, course_code, marks)
    
    // Calculate fuzzy score for each question
    foreach question in questions:
        question.fuzzy_score = getFuzzyScore(question)
    
    // Sort by fuzzy score (descending)
    sortByFuzzyScore(questions)
    
    // Take top half for diversity
    topHalf = questions.slice(0, ceil(questions.length * 0.5))
    
    // Random selection from top half
    selectedQuestion = randomSelect(topHalf)
    
    // Update usage count in database
    incrementUsageCount(selectedQuestion.id)
    
    return selectedQuestion
```

## Practical Example

Suppose we have question Q1 with the following usage history:
- Never used: fuzzy_score = 1.0
- Used once: fuzzy_score = 1.0 / sqrt(1.0 + log10(1)) = 1.0 / sqrt(1.0) = 1.0
- Used twice: fuzzy_score = 1.0 / sqrt(1.0 + log10(2)) ≈ 0.76
- Used 5 times: fuzzy_score = 1.0 / sqrt(1.0 + log10(5)) ≈ 0.60
- Used 10 times: fuzzy_score = 1.0 / sqrt(1.0 + log10(10)) ≈ 0.53
- Used 100 times: fuzzy_score = 1.0 / sqrt(1.0 + log10(100)) ≈ 0.38

This demonstrates how the score gradually decreases with usage, but questions remain viable for selection even after multiple uses.

## Conclusion

The fuzzy logic algorithm implemented in this Question Paper Generator provides a balanced approach to question selection that maintains diversity while ensuring fair distribution over time. By using a combination of logarithmic and square root functions, the system achieves a gradual decay in question priority that supports educational goals of fair assessment while preventing question overuse.
