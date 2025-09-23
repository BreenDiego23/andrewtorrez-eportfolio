//
//  main.cpp
//  AdvisingProgramInput
//
//  Created by AndrewTorrez on 8/22/24.
//

#include <iostream>
#include <fstream>
#include <sstream>
#include <unordered_map>
#include <string>
#include <vector>
#include <limits>

using namespace std;

// Define a structure to hold course information
struct Course {
    string courseNumber;
    string courseTitle;
    vector<string> prerequisites;
};

// Function to load courses from a CSV file into a hash table
unordered_map<string, Course> loadCourses(const string& filename) {
    unordered_map<string, Course> courses;
    ifstream file(filename);
    string line;

    if (!file.is_open()) {
        cerr << "Error: Could not open file " << filename << endl;
        return courses;
    }

    // Parse the CSV file line by line
    while (getline(file, line)) {
        stringstream ss(line);
        Course course;
        string prerequisites;

        // Read course number, title, and prerequisites from each line
        getline(ss, course.courseNumber, ',');
        getline(ss, course.courseTitle, ',');
        getline(ss, prerequisites);

        // Split prerequisites into a vector
        stringstream prereqStream(prerequisites);
        string prereq;
        while (getline(prereqStream, prereq, ',')) {
            course.prerequisites.push_back(prereq);
        }

        // Add the course to the hash table
        courses[course.courseNumber] = course;
    }

    file.close();
    return courses;
}

// Function to display the menu
void displayMenu() {
    cout << "\nMenu:" << endl;
    cout << "1. Load Data Structure." << endl;
    cout << "2. Print Course List." << endl;
    cout << "3. Print Course." << endl;
    cout << "9. Exit" << endl;
}

// Function to display all courses in alphanumeric order
void displayCourses(const unordered_map<string, Course>& courses) {
    if (courses.empty()) {
        cout << "No courses loaded." << endl;
        return;
    }

    // Create a vector of courses to sort by course number
    vector<Course> courseList;
    for (const auto& coursePair : courses) {
        courseList.push_back(coursePair.second);
    }

    // Sort the vector by course number
    sort(courseList.begin(), courseList.end(), [](const Course& a, const Course& b) {
        return a.courseNumber < b.courseNumber;
    });

    // Print the sorted courses
    for (const auto& course : courseList) {
        cout << course.courseNumber << ", " << course.courseTitle << endl;
    }
}

// Function to search for a course by course number and display its details
void displayCourseDetails(const unordered_map<string, Course>& courses, const string& courseNumber) {
    auto it = courses.find(courseNumber);
    if (it != courses.end()) {
        const Course& course = it->second;
        cout << course.courseNumber << ", " << course.courseTitle << endl;
        cout << "Prerequisites: ";
        if (course.prerequisites.empty()) {
            cout << "None";
        } else {
            for (const auto& prereq : course.prerequisites) {
                cout << prereq << " ";
            }
        }
        cout << endl;
    } else {
        cout << "Course not found." << endl;
    }
}

int main() {
    unordered_map<string, Course> courses;
    int choice = 0;

    while (choice != 9) {
        displayMenu();
        cout << "Enter your choice: ";
        cin >> choice;

        // Clear the input buffer to avoid issues with leftover characters
        cin.ignore(numeric_limits<streamsize>::max(), '\n');

        switch (choice) {
            case 1: {
                string filename;
                cout << "Enter the filename to load: ";
                getline(cin, filename);

                courses = loadCourses(filename);
                if (!courses.empty()) {
                    cout << courses.size() << " courses loaded successfully." << endl;
                }
                break;
            }
            case 2:
                if (courses.empty()) {
                    cout << "No courses loaded. Please load the course data first." << endl;
                } else {
                    cout << "Here is a sample schedule:" << endl;
                    displayCourses(courses);
                }
                break;
            case 3: {
                if (courses.empty()) {
                    cout << "No courses loaded. Please load the course data first." << endl;
                } else {
                    cout << "What course do you want to know about? ";
                    string courseNumber;
                    getline(cin, courseNumber);
                    displayCourseDetails(courses, courseNumber);
                }
                break;
            }
            case 9:
                cout << "Thank you for using the course planner!" << endl;
                break;
            default:
                cout << choice << " is not a valid option." << endl;
                break;
        }
    }

    return 0;
}
