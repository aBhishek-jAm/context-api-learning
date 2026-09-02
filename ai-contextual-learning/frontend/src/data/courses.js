export const nptelCourses = [
  {
    id: "java-programming",
    title: "Programming in Java",
    instructor: "Prof. Debasis Samanta",
    institute: "IIT Kharagpur",
    image: "https://img.youtube.com/vi/9wqvDPfjGvo/maxresdefault.jpg",
    progress: 15,
    videos: [
      { id: "9wqvDPfjGvo", title: "Lecture 1: Introduction to Java", duration: "32:15" },
      { id: "grEKMHGYyns", title: "Lecture 2: Object-Oriented Programming Concepts", duration: "45:20" },
      { id: "eIrMbAQSU34", title: "Lecture 3: Java Development Kit", duration: "28:40" },
    ]
  },
  {
    id: "deep-learning",
    title: "Deep Learning (NPTEL)",
    instructor: "Prof. Mitesh M. Khapra",
    institute: "IIT Madras",
    image: "https://img.youtube.com/vi/aircAruvnKk/maxresdefault.jpg",
    progress: 45,
    videos: [
      { id: "aircAruvnKk", title: "Lecture 1 - Introduction to Neural Networks", duration: "1:15:30" },
      { id: "IHZwWFHWa-w", title: "Lecture 2 - Gradient Descent", duration: "1:05:20" },
      { id: "Ilg3gGewQ5U", title: "Lecture 3 - Backpropagation", duration: "55:10" },
    ]
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    instructor: "Prof. Balaraman Ravindran",
    institute: "IIT Madras",
    image: "https://img.youtube.com/vi/jGwO_UgTS7I/maxresdefault.jpg",
    progress: 0,
    videos: [
      { id: "jGwO_UgTS7I", title: "Lecture 1 - Introduction to Machine Learning", duration: "58:45" },
      { id: "UzxYlbK2c7E", title: "Lecture 2 - Linear Regression", duration: "1:12:30" },
      { id: "O5xeyoRL95U", title: "Lecture 3 - Gradient Descent", duration: "1:02:15" },
    ]
  }
];

// Helper to find a video by ID and return its details along with course details
export const getVideoDetails = (videoId) => {
  for (const course of nptelCourses) {
    for (const video of course.videos) {
      if (video.id === videoId) {
        return {
          ...video,
          courseTitle: course.title,
          courseImage: course.image,
          instructor: course.instructor
        };
      }
    }
  }
  return null;
};
