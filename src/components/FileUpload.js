import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import Message from './Message';
import Progress from './Progress';
import axios from 'axios';
import ReactPolling from 'react-polling';
import theme from '../styles/theme';

const GENERATE_PAYMENT_INTENT_URL = 'https://2o3xrfdfxd.execute-api.us-west-2.amazonaws.com/get/file-status';
const FILE_STATUS_URL_WITH_KEY = `${GENERATE_PAYMENT_INTENT_URL}?key=`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const Loader = styled.div`
  border: 10px solid #f3f3f3; /* Light grey */
  border-top: 10px solid ${theme.color.secondary};
  border-radius: 50%;
  width: 50px;
  position: relative;
  left: 40%;
  height: 50px;
  animation: ${spin} 2s linear infinite;
`;

const InputDiv = styled.div`
  display: flex;
  flex-direction: row;
  padding-bottom: 16px;

  @media (max-width: ${(props) => props.theme.screen.sm}) {
    flex-direction: column;
  }
`;

const HeaderInput = styled.input`
  display: none;
`;

const HeaderInputButton = styled.button`
  content: none;
  font-weight: 500;
  font-size: 16px;
  color: ${(props) => props.theme.color.primary};
  line-height: 42px;
  width: 100%;
  text-align: left;
  height: 60px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => props.theme.color.secondary};
  border-image: initial;
  border-radius: 4px;
  padding: 8px 16px;
  outline: 0px;
  &:focus {
    box-shadow: inset ${(props) => props.theme.color.secondary} 0px 0px 0px 2px;
  }
  @media (max-width: ${(props) => props.theme.screen.md}) {
    margin-bottom: 8px;
  }
  @media (max-width: ${(props) => props.theme.screen.sm}) {
    display: block;
    width: 100%;
  }
`;

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
  background: ${(props) => props.theme.color.secondary};
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
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
  @media (max-width: ${(props) => props.theme.screen.md}) {
  }
  @media (max-width: ${(props) => props.theme.screen.sm}) {
    margin-left: 0;
  }
`;

const FormSubtitle = styled.span`
  ${(props) => props.theme.font_size.xxsmall}
`;

const FileUpload = (props) => {
  const inputFileRef = useRef(null);
  const [file, setFile] = useState('');
  const [filename, setFilename] = useState('Choose File');
  const [startPolling, setStartPolling] = useState(false);
  const [message, setMessage] = useState('');
  const [uploadPercentage, setUploadPercentage] = useState(0);
  const URLEndpoint = 'https://2o3xrfdfxd.execute-api.us-west-2.amazonaws.com/post/pre-signed-url';

  const onFileSelect = () => {
    // hacky workaround to hide the ugly upload file input
    inputFileRef.current.click();
  };

  const onChange = (e) => {
    setFile(e.target.files[0]);
    setFilename(e.target.files[0].name);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // first get the preauth url
    try {
      const res = await axios.post(URLEndpoint, {
        file_name: filename,
      });

      const uploadURL = res.data.url;

      try {
        await axios.put(uploadURL, file, {
          headers: {
            'Content-Type': 'text/csv',
          },
          onUploadProgress: (progressEvent) => {
            setUploadPercentage(parseInt(Math.round(progressEvent.loaded * 100) / progressEvent.total));

            // Clear percentage
            setTimeout(() => setUploadPercentage(0), 10000);
          },
        });
      } catch (err) {
        console.log(err);
        if (err.response.status === 500) {
          setMessage('There was a problem with the server');
        } else {
          setMessage(err.response.data.msg);
        }
      }

      // poll file status
      setStartPolling(true);
    } catch (err) {
      setMessage(err.response.data.msg);
    }
  };

  return (
    <div>
      {message ? <Message msg={message} /> : null}

      {!startPolling ? (
        <>
          <InputDiv>
            <HeaderInput type="file" ref={inputFileRef} onChange={onChange} />
            <HeaderInputButton onClick={onFileSelect}>{filename}</HeaderInputButton>

            <form onSubmit={onSubmit}>
              <HeaderButton disabled={filename === 'Choose File'} type="submit">
                Upload
              </HeaderButton>
            </form>
          </InputDiv>
          <FormSubtitle>*$0.10 CAD per valid contact</FormSubtitle>
        </>
      ) : (
        <ReactPolling
          url={FILE_STATUS_URL_WITH_KEY + filename}
          interval={5000} // in milliseconds(ms)
          retryCount={20} // this is optional
          onSuccess={(data) => {
            setUploadPercentage(100);
            props.setProgressConfig({
              step: 1,
              filename: filename,
              clientSecret: data.client_secret,
              amount: data.amount / 100, // convert to dollars
            });
            return false;
          }}
          onFailure={() => {
            // will retry so show progress bar progression
            return setUploadPercentage((100 - uploadPercentage) / 2 + uploadPercentage);
          }}
          method={'GET'}
          render={({ isPolling, stopPolling }) => {
            if (isPolling) {
              return <Loader />;
            } else if (stopPolling) {
              return <div></div>;
            }
          }}
        />
      )}
      {uploadPercentage === 0 || uploadPercentage === 100 ? null : <Progress percentage={uploadPercentage} />}
    </div>
  );
};

export default FileUpload;
