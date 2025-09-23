# UniversityCoursePlanner

A simple C++ console application that loads university courses from a CSV file and allows users to:

- Load course data into memory
- Display all courses in alphanumeric order
- Look up details for a specific course (title + prerequisites)

## How to Build & Run

From the root of the project:

```bash
g++ -std=c++17 -Wall -Wextra -o courseplanner src/main.cpp
./courseplanner
```

When prompted, enter the CSV file path:

data/courses.csv

## Project Structure

UniversityCoursePlanner/
├── src/          # Source code
│   └── main.cpp
├── data/         # Sample input files
│   └── courses.csv
└── README.md     # Project documentation

Enhancements Completed (CS-499)

This artifact has been enhanced as part of CS-499 to better demonstrate Algorithms and Data Structures skills:
	•	Case-insensitive lookups: User input is normalized (trim + uppercase).
	•	CSV validation: Skips malformed rows, warns on duplicates, ensures minimum column count.
	•	Duplicate handling: Warns when a course number appears twice in the input.
	•	Sorted output: Courses displayed in alphanumeric order using std::sort.
	•	Coding standards: Removed using namespace std;, added std:: qualifiers, added comments.
	•	User experience: Default file path provided, displays number of courses loaded, clearer error messages.
	•	Demo file: Added bad_courses.csv to showcase robustness against bad input.

⸻

Demo Instructions
	•	Run the app and enter data/courses.csv → loads valid courses and allows lookups.
	•	Run with data/bad_courses.csv → observe warnings for malformed/duplicate rows.
	•	From the main menu, try:
	•	Option 2 to see courses listed in order
	•	Option 3 to look up a course by number (e.g., cs101 or CS101)ling
	•	Add clearer comments and documentation