# CSM-2021-25-Batch-B1

# Fuzzy Logic Based Question Paper Generator

## Overview
An intelligent question paper generation system that utilizes fuzzy logic algorithms to create balanced and fair examination papers. This application helps educational institutions automate their question paper creation process while ensuring question diversity and maintaining academic standards.

## Core Features
- **Smart Question Selection**: Advanced fuzzy logic algorithm for optimal question distribution
- **Multi-Department Support**: Comprehensive management system for various departments
- **Dynamic Templates**: Customizable templates for different examination types (CIE-I, CIE-II, SEE)
- **Question Bank Management**: 
  - Systematic organization of questions by units
  - Support for multiple subjects and courses
  - Integration of Bloom's Taxonomy levels
  - Course Outcome mapping
  - Image support in questions
- **Analysis & Reporting**:
  - Detailed question usage statistics
  - CO/BL distribution analysis
  - Unit-wise question coverage
  - Pattern analysis for generated papers

## Technical Architecture

### Backend Framework
- **Flask (Python)**: Robust web framework for application logic
- **SQLAlchemy**: ORM for database operations
- **WeasyPrint**: PDF generation for question papers

### Database
- **SQLite**: Lightweight, serverless database
- **Structured Schema**: Optimized for educational data management

### Frontend
- **Bootstrap 5**: Responsive UI components
- **JavaScript**: Dynamic client-side interactions
- **Chart.js**: Statistical visualization

## System Components

### 1. Question Management
- Excel-based bulk question upload
- Image attachment support
- Automatic question categorization
- Usage tracking system

### 2. Paper Generation Process
- Template-based generation
- Configurable marks distribution
- Multiple question type support
- Automated/Manual selection modes
- Smart question selection using fuzzy logic

### 3. Department & Subject Management
- Hierarchical organization structure
- Course-specific configurations
- Regulation period management
- Subject-wise question banks

### 4. Template System
- Customizable headers
- Flexible question patterns
- Multiple exam type support
- Department-specific templates

## Fuzzy Logic Implementation

### Algorithm Overview
The system uses a sophisticated fuzzy logic algorithm that:
1. Tracks question usage history
2. Calculates dynamic selection scores
3. Ensures fair question distribution
4. Prevents over-repetition of questions

### Selection Formula
```python
fuzzy_score = 1.0 / sqrt(1.0 + log10(usage_count))
```
- Higher scores for less frequently used questions
- Logarithmic decay for balanced selection
- Automatic normalization of usage patterns

## Setup Instructions

### Prerequisites
- Python 3.11 or higher
- Required packages listed in pyproject.toml

1. **Initialize the Application**
   - Run the Flask server using the Run button
   - Access the application through the provided URL

2. **Initial Configuration**
   - Create departments
   - Add regulations
   - Set up subjects
   - Upload question banks

3. **Generate Question Papers**
   - Select department and subject
   - Choose template
   - Use automated selection or manual picking
   - Generate PDF output

## Project Structure
```
├── app.py              # Application initialization
├── models.py           # Database models
├── routes.py           # Route handlers
├── utils.py           # Utility functions
├── templates/         # HTML templates
├── static/           # Static assets
└── documentation/    # Project documentation
```
### Configuration
1. **Database Setup**
   - Run initialization scripts
   - Create admin account
   - Configure initial settings

2. **System Setup**
   - Create departments
   - Add regulations
   - Configure templates
   - Upload questions

## Usage Guide

### 1. Question Paper Generation
1. Select department and subject
2. Choose appropriate template
3. Configure paper settings
4. Select questions (manual/automated)
5. Generate PDF output

### 2. Question Bank Management
1. Prepare Excel template
2. Upload question bank
3. Verify uploaded questions
4. Monitor usage statistics

### 3. Analysis Tools
1. Access statistical dashboards
2. Review question distribution
3. Monitor CO/BL coverage
4. Track usage patterns

## Best Practices
- Regular question bank updates
- Balanced CO/BL distribution
- Periodic analysis review
- Template standardization
- Regular backup of question banks
