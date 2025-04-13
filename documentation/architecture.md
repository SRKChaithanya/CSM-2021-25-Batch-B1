
# Question Paper Generator System Architecture

## 1. System Architecture
```mermaid
graph TD
    A[User Interface] --> B[Flask Application]
    B --> C[Routes Layer]
    C --> D[Service Layer]
    D --> E[Data Access Layer]
    E --> F[(SQLite Database)]
    
    B --> G[Template Engine]
    G --> H[PDF Generator]
    
    subgraph Authentication
        I[Login Module] --> J[User Management]
    end
    
    subgraph Core_Features[Core Features]
        K[Question Management]
        L[Paper Generation]
        M[Department Management]
        N[Subject Management]
    end
    
    C --> I
    C --> K
```

## 2. Class Diagram
```mermaid
classDiagram
    class User {
        +id: Integer
        +username: String
        +password_hash: String
        +set_password()
        +check_password()
    }
    
    class Department {
        +dept_id: String
        +name: String
        +subjects: Relationship
    }
    
    class Subject {
        +course_code: String
        +department_id: String
        +course_name: String
        +year: Integer
        +semester: Integer
        +regulation_id: Integer
        +questions: Relationship
    }
    
    class Question {
        +id: Integer
        +unit: Integer
        +question_text: Text
        +marks: Integer
        +co: String
        +bl: String
        +subject_course_code: String
        +subject_department_id: String
        +image: Relationship
    }
    
    class Template {
        +id: Integer
        +name: String
        +exam_type: String
        +header: JSON
        +partA: JSON
        +partB: JSON
        +regulation_id: Integer
    }
    
    Department "1" --> "*" Subject
    Subject "1" --> "*" Question
    Question "1" --> "0..1" Image
    Regulation "1" --> "*" Template
    Subject "*" --> "1" Regulation
```

## 3. Question Generation Flow
```mermaid
flowchart TD
    A[Start] --> B[Select Department]
    B --> C[Choose Subject]
    C --> D[Select Template]
    D --> E[Configure Paper Settings]
    E --> F[Select Questions]
    F --> G{Valid Selection?}
    G -- Yes --> H[Generate PDF]
    G -- No --> F
    H --> I[Save History]
    I --> J[End]
```

## 4. Authentication Flow
```mermaid
flowchart LR
    A[User Access] --> B{Authenticated?}
    B -- No --> C[Login Page]
    C --> D[Check Credentials]
    D -- Valid --> E[Grant Access]
    D -- Invalid --> C
    B -- Yes --> E
    E --> F[Access Application]
```

## 5. Data Management Module
```mermaid
flowchart TD
    A[Data Management] --> B[Departments]
    A --> C[Subjects]
    A --> D[Questions]
    A --> E[Templates]
    
    B --> B1[Add Department]
    B --> B2[Edit Department]
    B --> B3[Delete Department]
    
    C --> C1[Add Subject]
    C --> C2[Edit Subject]
    C --> C3[Upload Questions]
    
    D --> D1[Question Bank]
    D --> D2[Question Analysis]
    
    E --> E1[Create Template]
    E --> E2[Edit Template]
    E --> E3[Delete Template]
```

## 6. Use Case Diagram
```mermaid
graph TD
    subgraph Users
        COE[Controller of Examinations]
    end

    subgraph System_Features[System Features]
        UC1[Manage Departments]
        UC2[Manage Subjects]
        UC3[Manage Question Bank]
        UC4[Generate Question Paper]
        UC5[Create/Edit Templates]
        UC6[View Question Analysis]
        UC7[Manage Users]
        UC8[Upload Questions]
    end

    COE --> UC1
    COE --> UC2
    COE --> UC3
    COE --> UC4
    COE --> UC5
    COE --> UC6
    COE --> UC7
    COE --> UC8

    %% Additional relationships
    UC3 --> UC4
    UC5 --> UC4
    UC8 --> UC3
```
