import React, { useState } from 'react';
import styled from "styled-components"
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';

const HeaderForm = styled.form`
  display: flex;
  flex-direction: row;
  padding-bottom: 16px;

  @media (max-width: ${props => props.theme.screen.sm}) {
    flex-direction: column;
  }
`

const HeaderInput = styled.input`
  content: none;
  font-weight: 500;
  font-size: 16px;
  color: ${props => props.theme.color.primary};
  line-height: 42px;
  width: 100%;
  text-align: left;
  height: 60px;
  border-width: 1px;
  border-style: solid;
  border-color: ${props => props.theme.color.secondary};
  border-image: initial;
  border-radius: 4px;
  padding: 8px 16px;
  outline: 0px;
  &:focus {
    box-shadow: inset ${props => props.theme.color.secondary} 0px 0px 0px 2px;
  }
  @media (max-width: ${props => props.theme.screen.md}) {
    margin-bottom: 8px;
  }
  @media (max-width: ${props => props.theme.screen.sm}) {
    display: block;
    width: 100%;
  }
`

const HeaderButton = styled.button`
  font-weight: 500;
  font-size: 14px;
  color: white;
  letter-spacing: 1px;
  height: 60px;
  display: block;
  margin-left: 8px;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
  background: ${props => props.theme.color.secondary};
  border-radius: 4px;
  padding: 0px 40px;
  border-width: 0px;
  border-style: initial;
  border-color: initial;
  border-image: initial;
  outline: 0px;
  &:hover {
    box-shadow: rgba(110, 120, 152, 0.22) 0px 2px 10px 0px;
  }
  @media (max-width: ${props => props.theme.screen.md}) {
  }
  @media (max-width: ${props => props.theme.screen.sm}) {
    margin-left: 0;
  }
`

const FormSubtitle = styled.span`
  ${props => props.theme.font_size.xxsmall}
`

const FileUpload = (props) => {
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');

  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const URLEndpoint = "https://mft9fatmbi.execute-api.us-west-2.amazonaws.com/prod/action/pre-signed-url";


  const onChange = e => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async e => {
    e.preventDefault();

    // first get the preauth url
    try {
      console.log(filename);
      const res = await axios.post(URLEndpoint, {
        file_name: filename
      });

      // setMesssage(res.data);
      console.log(res.data);
      const uploadURL = res.data;

      // now upload to new file
      const formData = new FormData();
      formData.append('file', file);

      try {
        // await axios.post(uploadURL, formData, {
        //     headers: {
        //         'Content-Type': 'multipart/form-data'
        //     },
        //     onUploadProgress: progressEvent => {
        //         setUploadPercentage(
        //             parseInt(
        //                 Math.round((progressEvent.loaded * 100) / progressEvent.total)
        //             )
        //         );

        //         // Clear percentage
        //         setTimeout(() => setUploadPercentage(0), 10000);
        //     }
        // });

        //   const { filename, filePath } = res.data;

        // setUploadedFile({ fileName, filePath });

        setMessage('File Uploaded'); // TODO remove messages except for errors
        props.setFileUploadComplete(true); // pass in any info here
      } catch (err) {
        console.log(err);
        if (err.response.status === 500) {
          setMessage('There was a problem with the server');
        } else {

          setMessage(err.response.data.msg);
        }
      }

    } catch (err) {
      setMessage(err.response.data.msg);
    }
  };

  return (
    <div>
      {message ? <Message msg={message} /> : null}
      <HeaderForm onSubmit={onSubmit}>
        <HeaderInput
          type="file"
          // hidden
          onChange={onChange}
        />
        <HeaderButton type="submit">
          Upload
                </HeaderButton>
      </HeaderForm>
      <FormSubtitle>
        *$0.10 CAD per valid contact
            </FormSubtitle>
      <Progress percentage={uploadPercentage} />
    </div>
  );
};

export default FileUpload;
