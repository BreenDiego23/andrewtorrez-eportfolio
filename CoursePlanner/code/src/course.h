#ifndef COURSE_H
#define COURSE_H

#include <string>
#include <vector>
#include <unordered_map>

struct Course {
    std::string courseNumber;
    std::string courseTitle;
    std::vector<std::string> prerequisites;
};

void displayCourses(const std::unordered_map<std::string, Course>& courses);
void displayCourseDetails(const std::unordered_map<std::string, Course>& courses,
                          const std::string& courseNumber);

#endif