import Note from '../Types/Note';

export const filterBySearchString = (
  noteArray: Note[],
  searchString: string,
) => {
  if (searchString.length === 0) {
    return noteArray;
  }

  return noteArray.filter((note) => {
    if (note.name.toLowerCase().includes(searchString.toLowerCase())) {
      return note;
    }
  });
};
