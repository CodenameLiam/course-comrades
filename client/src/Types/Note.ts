type Note = {
  name: string;
  author: string;
  courseCode: string;
  description: string;
  hashtags: string[];
  faculty: string;
  semester: string;
  uploadDate: {
    _seconds: string;
  };
  id: string;
  likes: number;
  downloads: number;
};

export default Note;
