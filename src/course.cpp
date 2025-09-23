#include "course.h"
#include <iostream>
#include <algorithm>

// Copy into a vector and sort so list output is always predictable for users.
void displayCourses(const std::unordered_map<std::string, Course>& courses) {
    if (courses.empty()) {
        std::cout << "No courses loaded.\n";
        return;
    }
    std::vector<Course> courseList;
    courseList.reserve(courses.size());
    for (const auto& kv : courses) courseList.push_back(kv.second);

    std::sort(courseList.begin(), courseList.end(),
              [](const Course& a, const Course& b){ return a.courseNumber < b.courseNumber; });

    for (const auto& c : courseList) {
        std::cout << c.courseNumber << ", " << c.courseTitle;
        if (!c.prerequisites.empty()) {
            std::cout << " (Prereqs: ";
            for (size_t i = 0; i < c.prerequisites.size(); ++i) {
                std::cout << c.prerequisites[i];
                if (i + 1 < c.prerequisites.size()) std::cout << ", ";
            }
            std::cout << ")";
        }
        std::cout << '\n';
    }
}

void displayCourseDetails(const std::unordered_map<std::string, Course>& courses,
                          const std::string& courseNumber) {
    auto it = courses.find(courseNumber);
    if (it == courses.end()) {
        std::cout << "Course not found.\n";
        return;
    }
    const Course& c = it->second;
    std::cout << c.courseNumber << ", " << c.courseTitle << '\n';
    std::cout << "Prerequisites: ";
    if (c.prerequisites.empty()) {
        std::cout << "None\n";
    } else {
        for (size_t i = 0; i < c.prerequisites.size(); ++i) {
            std::cout << c.prerequisites[i];
            if (i + 1 < c.prerequisites.size()) std::cout << ", ";
        }
        std::cout << '\n';
    }
}