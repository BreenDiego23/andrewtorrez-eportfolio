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
#include <algorithm>
#include "string_utils.h"


// Define a structure to hold course information
struct Course {
    std::string courseNumber;
    std::string courseTitle;
    std::vector<std::string> prerequisites;
};

// Parse one CSV line: courseNumber, courseTitle, [prereqs...]
// Returns true on success and fills 'out'; false if malformed.
bool parseCourseLine(const std::string& line, Course& out) {
    std::stringstream ss(line);
    std::string number, title, rest;

    if (!std::getline(ss, number, ',')) return false;
    if (!std::getline(ss, title, ','))  return false;
    std::getline(ss, rest); // may be empty

    number = toUpper(trim(number));
    title  = trim(title);
    if (number.empty() || title.empty()) return false;

    out.courseNumber  = number;
    out.courseTitle   = title;
    out.prerequisites = splitCommaList(rest);
    return true;
}

// Function to load courses from a CSV file into a hash table
std::unordered_map<std::string, Course> loadCourses(const std::string& filename) {
    std::unordered_map<std::string, Course> courses;
    std::ifstream file(filename);
    std::string line;

    if (!file.is_open()) {
        std::cerr << "Error: Could not open file " << filename << std::endl;
        return courses;
    }

    while (std::getline(file, line)) {
        if (trim(line).empty()) continue; // ignore blank lines
        Course c;
        if (!parseCourseLine(line, c)) {
            std::cerr << "Warning: skipping malformed line: " << line << '\n';
            continue;
        }
        // Insert/overwrite by normalized key (courseNumber already uppercased)
        if (courses.count(c.courseNumber)) {
            std::cerr << "Warning: duplicate course " << c.courseNumber
                << " encountered; overwriting previous entry.\n";
        }
        courses[c.courseNumber] = std::move(c);
    }

    file.close();
    return courses;
}

// Function to display the menu
void displayMenu() {
    std::cout << "\nMenu:" << std::endl;
    std::cout << "1. Load Data Structure." << std::endl;
    std::cout << "2. Print Course List." << std::endl;
    std::cout << "3. Print Course." << std::endl;
    std::cout << "9. Exit" << std::endl;
}

// Function to display all courses in alphanumeric order
void displayCourses(const std::unordered_map<std::string, Course>& courses) {
    if (courses.empty()) {
        std::cout << "No courses loaded." << std::endl;
        return;
    }

    // Copy map values into a vector so we can sort them
    std::vector<Course> courseList;
    for (const auto& coursePair : courses) {
        courseList.push_back(coursePair.second);
    }

    // Sort the vector by course number
    std::sort(courseList.begin(), courseList.end(),
              [](const Course& a, const Course& b) {
                  return a.courseNumber < b.courseNumber;
              });

    // Print the sorted courses
    for (const auto& course : courseList) {
        std::cout << course.courseNumber << ", " << course.courseTitle;
        if (!course.prerequisites.empty()) {
            std::cout << " (Prereqs: ";
            for (size_t i = 0; i < course.prerequisites.size(); ++i) {
                std::cout << course.prerequisites[i];
                if (i + 1 < course.prerequisites.size()) std::cout << ", ";
            }
            std::cout << ")";
        }
        std::cout << '\n';
    }
}



// Function to search for a course by course number and display its details
void displayCourseDetails(const std::unordered_map<std::string, Course>& courses, const std::string& courseNumber) {
    auto it = courses.find(courseNumber);
    if (it != courses.end()) {
        const Course& course = it->second;
        std::cout << course.courseNumber << ", " << course.courseTitle << '\n';
        std::cout << "Prerequisites: ";
        if (course.prerequisites.empty()) {
            std::cout << "None\n";
        } else {
            for (size_t i = 0; i < course.prerequisites.size(); ++i) {
                std::cout << course.prerequisites[i];
                if (i + 1 < course.prerequisites.size()) std::cout << ", ";
            }
            std::cout << '\n';
        }
    } else {
        std::cout << "Course not found.\n";
    }
}

int main() {
    std::unordered_map<std::string, Course> courses;
    int choice = 0;

    while (choice != 9) {
        displayMenu();
        std::cout << "Enter your choice: ";
        std::cin >> choice;

        // Clear the input buffer to avoid issues with leftover characters
        std::cin.ignore(std::numeric_limits<std::streamsize>::max(), '\n');

        switch (choice) {
            case 1: {
                std::string filename;
                std::cout << "Enter the filename to load: ";
                std::getline(std::cin, filename);

                courses = loadCourses(filename);
                if (courses.empty()) {
                    std::cout << "No courses loaded. Check the path (e.g., data/courses.csv) "
                        << "and ensure each row has at least: number,title[,prereqs...]\n";
                } else {
                    std::cout << courses.size() << " courses loaded successfully.\n";
                }
                break;
            }
            case 2:
                if (courses.empty()) {
                    std::cout << "No courses loaded. Please load the course data first." << std::endl;
                } else {
                    std::cout << "Here is a sample schedule:" << std::endl;
                    displayCourses(courses);
                }
                break;
            case 3: {
                if (courses.empty()) {
                    std::cout << "No courses loaded. Please load the course data first." << std::endl;
                } else {
                    std::cout << "What course do you want to know about? ";
                    std::string courseNumber;
                    std::getline(std::cin, courseNumber);
                    courseNumber = toUpper(trim(courseNumber)); // normalize input
                    displayCourseDetails(courses, courseNumber);
                }
                break;
            }
            case 9:
                std::cout << "Thank you for using the course planner!" << std::endl;
                break;
            default:
                std::cout << choice << " is not a valid option." << std::endl;
                break;
        }
    }

    return 0;
}
