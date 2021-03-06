import { Button, IconButton, TextField, withStyles } from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import * as firebase from 'firebase/app';
import MaskedInput from 'react-text-mask';
import moment from 'moment';
import { Cancel, Description, Highlight } from '@material-ui/icons';
import axios from 'axios';
import { upload } from '../../Services/FileService';
import { toast } from 'react-toastify';
import { hashtags } from '../../hashtags';
interface IModalState {
  file: File | undefined;
  author: string | undefined | null;
  name: string;
  courseCode: string;
  description: string;
  hashtags: string[] | null;
  faculty: string;
  semester: string | undefined | null;
  nameError: boolean;
  authorError: boolean;
  courseCodeError: boolean;
  descriptionError: boolean;
  facultyError: boolean;
  semesterError: boolean;
}

interface TextMaskCustomProps {
  inputRef: (ref: HTMLInputElement | null) => void;
}

function TextMaskCustom(props: TextMaskCustomProps) {
  const { inputRef, ...other } = props;
  console.log(inputRef);

  return (
    <MaskedInput
      {...other}
      ref={(ref: any) => {
        inputRef(ref ? ref.inputElement : null);
      }}
      mask={[
        /[a-zA-Z]/,
        /[a-zA-Z]/,
        /[a-zA-Z]/,
        /[a-zA-Z]/,
        /[1-9]/,
        /\d/,
        /\d/,
        /\d/,
      ]}
      placeholderChar={'\u2000'}
    />
  );
}

function getSemesterOptions() {
  const mid = moment().quarter();
  let semester = mid <= 2 ? 1 : 2;
  let year = moment().year();
  let smesterOptions: string[] = [];
  for (let i = 0; i <= 5; i++) {
    if (semester == 2) {
      smesterOptions.push(`Semester 2, ${year}`);
      semester--;
    } else {
      smesterOptions.push(`Semester 1, ${year}`);
      semester++;
      year--;
    }
  }
  return smesterOptions;
}

interface IModalProps {
  onClose: () => void;
  onSubmit: () => void;
}

export default function Modal(props: IModalProps) {
  const user = firebase.auth().currentUser;
  const username = user?.displayName;

  const [state, setState] = useState<IModalState>({
    file: undefined,
    name: '',
    author: username,
    courseCode: '',
    description: '',
    hashtags: [],
    faculty: '',
    semester: '',
    nameError: false,
    authorError: false,
    courseCodeError: false,
    descriptionError: false,
    facultyError: false,
    semesterError: false,
  });

  const handleSubmit = (e: any) => {
    const isFormValid = validateForm(e);

    console.log(isFormValid);

    if (isFormValid) {
      axios
        .post('./api/create-note', {
          name: state.name,
          author: state.author,
          courseCode: state.courseCode,
          description: state.description,
          hashtags: state.hashtags,
          faculty: state.faculty,
          semester: state.semester,
        })
        .then((d) => {
          upload(state.file!, d.data.id, state.name, handleSuccess);
          console.log(d);
        })
        .catch((e) => {
          toast.error(e);
        });
    }
  };

  const handleSuccess = () => {
    toast.success('File uploaded!');
    props.onClose();
    props.onSubmit();
  };

  const validateForm = (e: any): boolean => {
    e.preventDefault();

    const nameError = state.name.length > 0 ? false : true;
    const authorError = (state.author as string).length > 0 ? false : true;
    const courseCodeError = state.courseCode.length > 0 ? false : true;
    const descriptionError = state.description.length > 0 ? false : true;
    const facultyError = state.faculty.length > 0 ? false : true;
    // const semesterError = (state.semester as string).length > 0 ? false : true;

    setState({
      ...state,
      nameError: nameError,
      authorError: authorError,
      courseCodeError: courseCodeError,
      descriptionError: descriptionError,
      facultyError: facultyError,
      // semesterError: semesterError,
    });

    return (
      !nameError &&
      !authorError &&
      !courseCodeError &&
      !descriptionError &&
      !facultyError
      // && !semesterError
    );
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <div className="upper">
          <Dropzone
            onDrop={(acceptedFiles) =>
              setState({ ...state, file: acceptedFiles[0] })
            }
            accept={'application/pdf'}
            maxFiles={1}
          >
            {({ getRootProps, getInputProps }) => (
              <section className="dropzone">
                <div className="area" {...getRootProps()}>
                  <input {...getInputProps()} />
                  {state.file ? (
                    <>
                      <div className="file-icon">
                        <Description />
                      </div>

                      <div className="file-name">{state.file.name}</div>
                      <div className="delete-file">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            setState({ ...state, file: undefined });
                          }}
                        >
                          <Cancel />
                        </IconButton>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="button">
                        <UploadButton>Upload Note</UploadButton>
                      </div>

                      <div className="drop">Or drop one here</div>
                    </>
                  )}

                  {/* <div className="area"></div> */}
                </div>
              </section>
            )}
          </Dropzone>
          <div className="input">
            <InputTextField
              className="input-field"
              id="course"
              placeholder="Name"
              variant="outlined"
              fullWidth
              onChange={(e) => setState({ ...state, name: e.target.value })}
              error={state.nameError}
              helperText={
                state.nameError ? 'Please enter a valid note name' : ''
              }
            />
            <InputTextField
              className="input-field"
              id="course"
              placeholder="Course Code"
              variant="outlined"
              fullWidth
              InputProps={{ inputComponent: TextMaskCustom as any }}
              onChange={(e) =>
                setState({ ...state, courseCode: e.target.value })
              }
              error={state.courseCodeError}
              helperText={
                state.courseCodeError ? 'Please enter a valid coursecode' : ''
              }
            />
            <InputTextField
              className="input-field"
              id="faculty"
              placeholder="Faculty"
              variant="outlined"
              fullWidth
              onChange={(e) => setState({ ...state, faculty: e.target.value })}
              error={state.facultyError}
              helperText={
                state.facultyError ? 'Please enter a valid faculty' : ''
              }
            />

            <Autocomplete
              id="combo-box-demo"
              options={getSemesterOptions()}
              getOptionLabel={(option) => option}
              fullWidth
              onChange={(event: any, newValue: string | null) => {
                setState({ ...state, semester: newValue });
              }}
              // style={{ width: 300 }}
              renderInput={(params) => (
                <InputTextField
                  {...params}
                  placeholder="Semester"
                  variant="outlined"
                />
              )}
            />
          </div>
        </div>
        <div className="lower">
          <Autocomplete
            className="hashtags"
            multiple
            id="tags-outlined"
            options={hashtags}
            getOptionLabel={(option) => option}
            disableCloseOnSelect
            // defaultValue={[top100Films[2]]}
            filterSelectedOptions
            onChange={(event: any, newValue: string[] | null) => {
              setState({ ...state, hashtags: newValue });
            }}
            renderInput={(params) => (
              <InputTextField
                {...params}
                variant="outlined"
                placeholder="#Hashtags"
              />
            )}
          />

          <InputTextField
            id="outlined-basic"
            placeholder="Description"
            variant="outlined"
            fullWidth
            multiline
            rows={3}
            onChange={(e) =>
              setState({ ...state, description: e.target.value })
            }
            error={state.descriptionError}
            helperText={
              state.descriptionError ? 'Please enter a valid description' : ''
            }
          />
        </div>
        <div className="submit">
          <CancelButton fullWidth onClick={props.onClose}>
            Cancel
          </CancelButton>
          <UploadButton type="submit" fullWidth>
            Submit
          </UploadButton>
        </div>
      </form>
    </div>
  );
}

export const InputTextField = withStyles({
  root: {
    // "& .MuiFormLabel-root.Mui-focused": {
    // 	color: "#51247a",
    // 	background: "#ffffff",
    // },
    '& .MuiOutlinedInput-root': {
      borderRadius: '1rem',
      boxShadow: '2px 2px 5px #dddddd',
      background: '#ffffff',
      marginBottom: '1rem',
      '& input': {
        borderRadius: '100rem 0rem 0rem 100rem',
        paddingLeft: '1rem',
      },

      '& fieldset': {
        transition: 'box-shadow 0.3s',
        borderColor: '#dddddd',
      },
      '&:hover fieldset': {
        borderColor: '#dddddd',
        boxShadow: '2px 2px 10px #dddddd',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#dddddd',
        boxShadow: '2px 2px 10px #dddddd',
      },
    },
    '& .Mui-error': {
      '& fieldset': {
        transition: 'box-shadow 0.3s',
        borderColor: '#e62645',
      },
    },
  },
})(TextField);

const UploadButton = withStyles({
  root: {
    background:
      'linear-gradient(171deg, rgba(81, 36, 122, 1) 0%, rgba(150, 42, 187, 1) 100%);',
    borderRadius: 100,
    height: '42px',
    width: '50%',
    marginBottom: '0.5rem',
    marginTop: '1rem',
    color: 'white',
    fontSize: '1rem',
    fontFamily: "'Poppins', sans-serif",
    boxShadow: '2px 2px 5px #c5c5c5',
    // boxShadow: "2px 4px 4px -2px #962abb",
    '&:hover': {
      boxShadow: '2px 2px 10px #989898',
      // boxShadow: "2px 5px 8px -1px #962abb",
    },
  },
})(Button);

const CancelButton = withStyles({
  root: {
    background: '#c5c5c5',
    borderRadius: 100,
    height: '42px',
    width: '50%',
    marginBottom: '0.5rem',
    marginTop: '1rem',
    color: 'white',
    fontSize: '1rem',
    fontFamily: "'Poppins', sans-serif",
    boxShadow: '2px 2px 5px #c5c5c5',
    // boxShadow: "2px 4px 4px -2px #962abb",
    '&:hover': {
      background: '#c5c5c5',
      boxShadow: '2px 2px 10px #989898',
      // boxShadow: "2px 5px 8px -1px #962abb",
    },
  },
})(Button);
